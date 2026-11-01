import { describe, expect, it } from "vitest";
import { CHARACTER_ROSTER, getCharacterProfile } from "./characters";
import { evaluateGuess, normalizeText } from "./guessing";

describe("Guess recognition", () => {
	it("normalizes case, accents, and punctuation", () => {
		expect(normalizeText("  Kamisato-Ayaka! ")).toBe("kamisato ayaka");
	});

	it("recognizes an explicit correct Guess", () => {
		const amber = getCharacterProfile("amber");
		expect(evaluateGuess("Are you Amber?", amber, CHARACTER_ROSTER)).toMatchObject({ kind: "correct" });
	});

	it("does not treat an incidental name mention as a Guess", () => {
		const amber = getCharacterProfile("amber");
		expect(evaluateGuess("Tell me about Diluc.", amber, CHARACTER_ROSTER)).toEqual({ kind: "not-guess" });
	});

	it("requires one identity when multiple names are proposed", () => {
		const amber = getCharacterProfile("amber");
		const result = evaluateGuess("Are you Amber or Diluc?", amber, CHARACTER_ROSTER);
		expect(result.kind).toBe("multiple");
		if (result.kind === "multiple") expect(result.matches.map((character) => character.name)).toEqual(["Amber", "Diluc"]);
	});
});
