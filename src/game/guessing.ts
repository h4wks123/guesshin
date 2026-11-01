import { CharacterProfile } from "./characters";

export type GuessOutcome =
	| { kind: "not-guess" }
	| { kind: "multiple"; matches: CharacterProfile[] }
	| { kind: "incorrect"; matches: CharacterProfile[] }
	| { kind: "correct"; match: CharacterProfile };

const explicitGuessPatterns = [
	/\b(?:are|is|could|might|would)\s+(?:you|this|it)\b/i,
	/\b(?:i\s+think|i\s+guess|my\s+guess\s+is|you\s+are|you're|youre)\b/i,
	/^\s*guess\s*:/i,
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
	return new RegExp(`(?:^| )${escapeRegExp(normalizedPhrase)}(?: |$)`).test(text);
}

function matchesInRoster(message: string, roster: readonly CharacterProfile[]): CharacterProfile[] {
	const normalized = normalizeText(message);
	return roster.filter((character) =>
		[character.name, ...character.aliases].some((alias) => includesPhrase(normalized, alias)),
	);
}

export function evaluateGuess(
	message: string,
	secretCharacter: CharacterProfile,
	roster: readonly CharacterProfile[],
): GuessOutcome {
	const normalized = normalizeText(message);
	const matches = matchesInRoster(message, roster);
	const isExactIdentity = matches.some((character) =>
		[character.name, ...character.aliases].some((alias) => normalizeText(alias) === normalized),
	);
	const isExplicit = isExactIdentity || explicitGuessPatterns.some((pattern) => pattern.test(message));

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
		"tell me who you are",
		"who are you",
	].includes(normalized);
}
