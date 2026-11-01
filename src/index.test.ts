import { describe, expect, it, vi } from "vitest";
import worker, { GameState } from "./index";
import { Env } from "./types";

class MemoryStorage {
	private readonly values = new Map<string, unknown>();
	private alarmAt: number | null = null;

	get<T>(key: string): Promise<T | undefined> {
		return Promise.resolve(this.values.get(key) as T | undefined);
	}

	put<T>(key: string, value: T): Promise<void> {
		this.values.set(key, value);
		return Promise.resolve();
	}

	deleteAll(): Promise<void> {
		this.values.clear();
		return Promise.resolve();
	}

	setAlarm(value: number): Promise<void> {
		this.alarmAt = value;
		return Promise.resolve();
	}

	getAlarm(): Promise<number | null> {
		return Promise.resolve(this.alarmAt);
	}
}

class FakeDurableObjectState {
	readonly storage = new MemoryStorage();
}

class FakeNamespace {
	private nextId = 0;
	private readonly instances = new Map<string, GameState>();

	constructor(private readonly ai: Ai) {}

	newUniqueId(): DurableObjectId {
		this.nextId += 1;
		return this.idFromString(`game-${this.nextId}`);
	}

	idFromString(value: string): DurableObjectId {
		return { toString: () => value } as DurableObjectId;
	}

	get(id: DurableObjectId): DurableObjectStub {
		const key = id.toString();
		let instance = this.instances.get(key);
		if (!instance) {
			instance = new GameState(new FakeDurableObjectState() as unknown as DurableObjectState, { AI: this.ai });
			this.instances.set(key, instance);
		}
		return { fetch: (request: Request) => instance!.fetch(request) } as unknown as DurableObjectStub;
	}
}

function createEnvironment(aiResponse = "The road is pleasant today.") {
	const ai = {
		run: vi.fn(async () => ({ response: aiResponse })),
	} as unknown as Ai;
	const namespace = new FakeNamespace(ai);
	return {
		env: {
		AI: ai,
		ASSETS: { fetch: vi.fn(async () => new Response("assets")) },
		GAME_STATE: namespace,
	} as unknown as Env,
		ai,
	};
}

async function createGame(env: Env) {
	const response = await worker.fetch(new Request("https://guesshin.test/api/games", { method: "POST" }), env);
	return { response, body: (await response.json()) as { gameId: string; status: string; messages: Array<{ content: string }> } };
}

async function readSse(response: Response) {
	const text = await response.text();
	return text
		.split("\n")
		.filter((line) => line.startsWith("data: ") && line !== "data: [DONE]")
		.map((line) => JSON.parse(line.slice("data: ".length)) as { type: string; status?: string; response?: string; reveal?: { name: string } });
}

describe("Guesshin Worker game boundary", () => {
	it("keeps the secret character out of the initial public state", async () => {
		const random = vi.spyOn(Math, "random").mockReturnValue(0);
		const { env, ai } = createEnvironment();
		const { body } = await createGame(env);

		expect(body.status).toBe("active");
		expect(body.gameId).toBe("game-1");
		expect(JSON.stringify(body)).not.toContain("Amber");
		expect(ai.run).toHaveBeenCalled();
		random.mockRestore();
	});

	it("supports ordinary messages through an SSE response", async () => {
		const random = vi.spyOn(Math, "random").mockReturnValue(0);
		const { env } = createEnvironment("The wind carries news from the hills.");
		const { body } = await createGame(env);
		const response = await worker.fetch(new Request(`https://guesshin.test/api/games/${body.gameId}/messages`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ message: "What do you enjoy?" }),
		}), env);
		const events = await readSse(response);

		expect(response.headers.get("content-type")).toContain("text/event-stream");
		expect(events).toContainEqual({ type: "state", status: "active" });
		expect(events).toContainEqual({ type: "message", response: "The wind carries news from the hills." });
		random.mockRestore();
	});

	it("transitions to Won on a correct Guess and reveals the character", async () => {
		const random = vi.spyOn(Math, "random").mockReturnValue(0);
		const { env } = createEnvironment();
		const { body } = await createGame(env);
		const response = await worker.fetch(new Request(`https://guesshin.test/api/games/${body.gameId}/messages`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ message: "Are you Amber?" }),
		}), env);
		const events = await readSse(response);

		expect(events).toContainEqual({ type: "state", status: "won", reveal: expect.objectContaining({ name: "Amber" }) });
		random.mockRestore();
	});

	it("keeps an incorrect Guess active and asks for clarification on multiple identities", async () => {
		const random = vi.spyOn(Math, "random").mockReturnValue(0);
		const { env } = createEnvironment();
		const { body } = await createGame(env);
		const wrong = await worker.fetch(new Request(`https://guesshin.test/api/games/${body.gameId}/messages`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ message: "Are you Diluc?" }),
		}), env);
		const multiple = await worker.fetch(new Request(`https://guesshin.test/api/games/${body.gameId}/messages`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ message: "Are you Amber or Diluc?" }),
		}), env);

		expect((await readSse(wrong)).find((event) => event.type === "state")).toEqual({ type: "state", status: "active" });
		expect((await readSse(multiple)).find((event) => event.type === "message")).toEqual({ type: "message", response: "Please choose one character for your Guess." });
		random.mockRestore();
	});

	it("transitions to Revealed on surrender and rejects later messages", async () => {
		const random = vi.spyOn(Math, "random").mockReturnValue(0);
		const { env } = createEnvironment();
		const { body } = await createGame(env);
		const surrender = await worker.fetch(new Request(`https://guesshin.test/api/games/${body.gameId}/surrender`, { method: "POST" }), env);
		const revealed = (await surrender.json()) as { status: string; reveal: { name: string } };
		const after = await worker.fetch(new Request(`https://guesshin.test/api/games/${body.gameId}/messages`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ message: "One more question" }),
		}), env);

		expect(revealed).toMatchObject({ status: "revealed", reveal: { name: "Amber" } });
		expect(after.status).toBe(409);
		random.mockRestore();
	});
});
