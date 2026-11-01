import { chooseRandomCharacter } from "./game/characters";
import { GameState, GameTurnResult } from "./game/durable-object";
import { Env } from "./types";

export { GameState };

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);

		if (url.pathname === "/api/games" && request.method === "POST") {
			return createGame(env);
		}

		const gameMatch = url.pathname.match(/^\/api\/games\/([^/]+)(?:\/(messages|surrender))?$/);
		if (gameMatch) {
			const [, gameId, action] = gameMatch;
			if (request.method === "GET" && !action) return proxyGameRequest(env, gameId, "/snapshot", request);
			if (request.method === "POST" && action === "messages") return streamGameMessage(env, gameId, request);
			if (request.method === "POST" && action === "surrender") return jsonGameAction(env, gameId, "/surrender", request);
		}

		if (url.pathname === "/api/chat" && request.method === "POST") {
			return streamGameMessage(env, "", request);
		}

		return new Response("Not found", { status: 404 });
	},
} satisfies ExportedHandler<Env>;

async function createGame(env: Env): Promise<Response> {
	const id = env.GAME_STATE.newUniqueId();
	const profile = chooseRandomCharacter();
	const result = await env.GAME_STATE.get(id).fetch(
		new Request("https://guesshin.game/init", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ characterId: profile.id }),
		}),
	);
	if (!result.ok) return result;

	const snapshot = (await result.json()) as GameTurnResult;
	return json({ gameId: id.toString(), ...snapshot });
}

async function streamGameMessage(env: Env, pathGameId: string, request: Request): Promise<Response> {
	const body = (await request.json()) as { gameId?: string; message?: string; messages?: Array<{ role: string; content: string }> };
	const gameId = pathGameId || body.gameId;
	const message = body.message ?? body.messages?.[body.messages.length - 1]?.content;
	if (!gameId || !message) return json({ error: "gameId and message are required" }, 400);

	const result = await proxyGameRequest(env, gameId, "/message", new Request(request, {
		method: "POST",
		body: JSON.stringify({ message }),
		headers: { "content-type": "application/json" },
	}));
	if (!result.ok) return result;

	const turn = (await result.json()) as GameTurnResult;
	return sse(turn);
}

async function jsonGameAction(env: Env, gameId: string, path: string, request: Request): Promise<Response> {
	const result = await proxyGameRequest(env, gameId, path, request);
	if (!result.ok) return result;
	return result;
}

async function proxyGameRequest(env: Env, gameId: string, path: string, request: Request): Promise<Response> {
	try {
		const id = env.GAME_STATE.idFromString(gameId);
		return env.GAME_STATE.get(id).fetch(new Request(`https://guesshin.game${path}`, request));
	} catch {
		return json({ error: "Invalid game" }, 400);
	}
}

function sse(turn: GameTurnResult): Response {
	const events = [
		`data: ${JSON.stringify({ type: "state", status: turn.status, reveal: turn.reveal })}\n\n`,
		...(turn.assistant ? [`data: ${JSON.stringify({ type: "message", response: turn.assistant })}\n\n`] : []),
		"data: [DONE]\n\n",
	];
	return new Response(
		new ReadableStream({
			start(controller) {
				for (const event of events) controller.enqueue(new TextEncoder().encode(event));
				controller.close();
			},
		}),
		{
			headers: {
				"content-type": "text/event-stream; charset=utf-8",
				"cache-control": "no-cache",
				connection: "keep-alive",
			},
		},
	);
}

function json(value: unknown, status = 200): Response {
	return new Response(JSON.stringify(value), {
		status,
		headers: { "content-type": "application/json; charset=utf-8" },
	});
}
