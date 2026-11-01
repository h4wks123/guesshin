import { describe, expect, it } from "vitest";
import { CHARACTER_ROSTER, getCharacterProfile } from "./characters";
import { evaluateGuess, isSurrenderMessage, normalizeText } from "./guessing";

describe("Guess recognition", () => {
  it("normalizes case, accents, and punctuation", () => {
    expect(normalizeText("  Kamisato-Ayaka! ")).toBe("kamisato ayaka");
  });

  it("recognizes an explicit correct Guess", () => {
    const amber = getCharacterProfile("amber");
    expect(
      evaluateGuess("Are you Amber?", amber, CHARACTER_ROSTER),
    ).toMatchObject({ kind: "correct" });
  });

  it("does not treat an incidental name mention as a Guess", () => {
    const amber = getCharacterProfile("amber");
    expect(
      evaluateGuess("Tell me about Diluc.", amber, CHARACTER_ROSTER),
    ).toEqual({ kind: "not-guess" });
    expect(
      evaluateGuess("Could you tell me about Diluc?", amber, CHARACTER_ROSTER),
    ).toEqual({ kind: "not-guess" });
    expect(
      evaluateGuess("Why are you asking about Diluc?", amber, CHARACTER_ROSTER),
    ).toEqual({ kind: "not-guess" });
    expect(
      evaluateGuess("Are you asking about Diluc?", amber, CHARACTER_ROSTER),
    ).toEqual({ kind: "not-guess" });
  });

  it("keeps a direct identity question separate from Surrender", () => {
    expect(isSurrenderMessage("Who are you?")).toBe(false);
    expect(isSurrenderMessage("I give up")).toBe(true);
  });

  it("requires one identity when multiple names are proposed", () => {
    const amber = getCharacterProfile("amber");
    const result = evaluateGuess(
      "Are you Amber or Diluc?",
      amber,
      CHARACTER_ROSTER,
    );
    expect(result.kind).toBe("multiple");
    if (result.kind === "multiple")
      expect(result.matches.map((character) => character.name)).toEqual([
        "Amber",
        "Diluc",
      ]);
  });
});
