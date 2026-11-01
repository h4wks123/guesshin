export type GameStatus = "active" | "won" | "revealed";

export type GameMessage = {
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
	messages: GameMessage[];
	reveal?: CharacterReveal;
};

export type GameResponse = PublicGameState & {
	gameId?: string;
	assistant?: string;
};

export type GameStreamEvent = {
	type: "state" | "message";
	status?: GameStatus;
	response?: string;
	reveal?: CharacterReveal;
};

export interface Env {
	AI: Ai;
	ASSETS: Fetcher;
	GAME_STATE: DurableObjectNamespace;
}
