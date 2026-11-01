import { CharacterProfile } from "./characters";

export type GuessOutcome =
  | { kind: "not-guess" }
  | { kind: "multiple"; matches: CharacterProfile[] }
  | { kind: "incorrect"; matches: CharacterProfile[] }
  | { kind: "correct"; match: CharacterProfile };

const explicitGuessPrefixes = [
  "are you",
  "is it",
  "could you be",
  "might you be",
  "would you be",
  "i think you are",
  "i think youre",
  "i guess you are",
  "i guess youre",
  "my guess is",
];

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function includesPhrase(text: string, phrase: string): boolean {
  const normalizedPhrase = normalizeText(phrase);
  return new RegExp(`(?:^| )${escapeRegExp(normalizedPhrase)}(?: |$)`).test(
    text,
  );
}

function matchesInRoster(
  message: string,
  roster: readonly CharacterProfile[],
): CharacterProfile[] {
  const normalized = normalizeText(message);
  return roster.filter((character) =>
    [character.name, ...character.aliases].some((alias) =>
      includesPhrase(normalized, alias),
    ),
  );
}

function hasExplicitGuessIntent(
  message: string,
  matches: CharacterProfile[],
): boolean {
  const normalized = normalizeText(message);
  if (
    matches.some((character) =>
      [character.name, ...character.aliases].some(
        (alias) => normalizeText(alias) === normalized,
      ),
    )
  ) {
    return true;
  }

  if (normalized.startsWith("guess ")) return matches.length > 0;
  const prefix = explicitGuessPrefixes.find((candidate) =>
    normalized.startsWith(`${candidate} `),
  );
  if (!prefix) return false;

  const remainder = normalized.slice(prefix.length).trim().replace(/^the /, "");
  return matches.some((character) =>
    [character.name, ...character.aliases].some((alias) => {
      const normalizedAlias = normalizeText(alias);
      return (
        remainder === normalizedAlias ||
        remainder.startsWith(`${normalizedAlias} `) ||
        remainder.includes(` or ${normalizedAlias}`)
      );
    }),
  );
}

export function evaluateGuess(
  message: string,
  secretCharacter: CharacterProfile,
  roster: readonly CharacterProfile[],
): GuessOutcome {
  const matches = matchesInRoster(message, roster);
  const isExplicit = hasExplicitGuessIntent(message, matches);

  if (!isExplicit || matches.length === 0) return { kind: "not-guess" };
  if (matches.length > 1) return { kind: "multiple", matches };
  return matches[0].id === secretCharacter.id
    ? { kind: "correct", match: matches[0] }
    : { kind: "incorrect", matches };
}

export function isSurrenderMessage(message: string): boolean {
  const normalized = normalizeText(message);
  return [
    "i give up",
    "give up",
    "i surrender",
    "surrender",
    "reveal",
    "reveal character",
  ].includes(normalized);
}
