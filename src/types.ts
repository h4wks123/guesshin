export type GameStatus = "active" | "won" | "revealed";

export type ChatMessage = {
	role: "system" | "user" | "assistant";
	content: string;
};

export type CharacterReveal = {
	name: string;
	element: string;
	nation: string;
	weapon: string;
	role: string;
	summary: string;
};

export type PublicGameState = {
	status: GameStatus;
	messages: ChatMessage[];
	reveal?: CharacterReveal;
};

export interface Env {
	AI: Ai;
	ASSETS: Fetcher;
	GAME_STATE: DurableObjectNamespace;
}
