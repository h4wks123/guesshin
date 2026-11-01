import { describe, expect, it, vi } from "vitest";
import { getCharacterProfile } from "./characters";
import { buildRoleplaySystemPrompt, FALLBACK_RESPONSE, generateValidatedResponse, leaksIdentity } from "./roleplay";

const amber = getCharacterProfile("amber");

describe("roleplay contract", () => {
	it("gives the model the attributes it may use as Clues and the identity boundary", () => {
		const prompt = buildRoleplaySystemPrompt(amber);

		expect(prompt).toContain("Element: Pyro");
		expect(prompt).toContain("Nation: Mondstadt");
		expect(prompt).toContain("Weapon type: Bow");
		expect(prompt).toContain("Role: Outrider");
		expect(prompt).toContain("If asked directly for your name, identity");
	});

	it("retries a leaking response before returning it", async () => {
		const ai = {
			run: vi.fn()
				.mockResolvedValueOnce({ response: "My name is Amber." })
				.mockResolvedValueOnce({ response: "The wind carries news from the hills." }),
		};

		const response = await generateValidatedResponse(ai, amber, [], "Who are you?");

		expect(response).toBe("The wind carries news from the hills.");
		expect(ai.run).toHaveBeenCalledTimes(2);
		expect(leaksIdentity(response, amber)).toBe(false);
	});

	it("uses a neutral fallback when both attempts leak the identity", async () => {
		const ai = {
			run: vi.fn().mockResolvedValue({ response: "My name is Amber." }),
		};

		expect(await generateValidatedResponse(ai, amber, [], "Who are you?")).toBe(FALLBACK_RESPONSE);
	});
});
