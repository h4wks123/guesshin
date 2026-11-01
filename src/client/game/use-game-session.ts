import { useCallback, useEffect, useState } from "react";
import type {
  CharacterReveal,
  GameMessage,
  GameStatus,
} from "../../types";
import { gameClient } from "./game-client";
import type { GameClient } from "./game-client";

type ProcessingAction = "message" | "surrender";

export type FailedTurn = {
  message: string;
  turnId: string;
};

export type GameSessionState = {
  gameId?: string;
  status: GameStatus;
  messages: GameMessage[];
  reveal?: CharacterReveal;
  isProcessing: boolean;
  processingAction?: ProcessingAction;
  isStarting: boolean;
  error?: string;
  failedTurn?: FailedTurn;
};

const initialMessage: GameMessage = {
  role: "assistant",
  content:
    "The secret character is ready. Ask a question, look for a clue, or make a guess.",
};

const initialState: GameSessionState = {
  status: "active",
  messages: [initialMessage],
  isProcessing: false,
  isStarting: true,
};

export function useGameSession(client: GameClient = gameClient) {
  const [state, setState] = useState<GameSessionState>(initialState);

  const newGame = useCallback(async () => {
    setState({
      ...initialState,
      messages: [initialMessage],
      isStarting: true,
    });

    try {
      const game = await client.startGame();
      setState((current) => ({
        ...current,
        gameId: game.gameId,
        status: game.status,
        messages: game.messages.length > 0 ? game.messages : [initialMessage],
        reveal: game.reveal,
        isStarting: false,
        error: undefined,
        failedTurn: undefined,
      }));
    } catch (cause) {
      console.error(cause);
      setState((current) => ({
        ...current,
        isStarting: false,
        error: "The game could not start. Please try again.",
      }));
    }
  }, [client]);

  useEffect(() => {
    void newGame();
  }, [newGame]);

  const sendMessage = useCallback(
    async (message: string, turnId: string = crypto.randomUUID()) => {
      if (
        !message.trim() ||
        !state.gameId ||
        state.isProcessing ||
        state.status !== "active"
      ) {
        return;
      }

      const previousMessages = state.messages;
      const nextHistory = [
        ...previousMessages,
        { role: "user" as const, content: message },
      ];
      setState((current) => ({
        ...current,
        isProcessing: true,
        processingAction: "message",
        error: undefined,
        failedTurn: undefined,
        messages: nextHistory,
      }));

      try {
        let assistantText = "";
        for await (const event of client.streamMessage({
          gameId: state.gameId,
          message,
          turnId,
        })) {
          if (event.type === "state" && event.status) {
            setState((current) => ({
              ...current,
              status: event.status!,
              reveal: event.reveal ?? current.reveal,
            }));
          }
          if (event.type === "message" && event.response) {
            assistantText += event.response;
            setState((current) => ({
              ...current,
              messages: [
                ...nextHistory,
                { role: "assistant", content: assistantText },
              ],
            }));
          }
        }
      } catch (cause) {
        console.error(cause);
        setState((current) => ({
          ...current,
          messages: previousMessages,
          failedTurn: { message, turnId },
          error: "The character could not answer. Your game is safe—try again.",
        }));
      } finally {
        setState((current) => ({
          ...current,
          isProcessing: false,
          processingAction: undefined,
        }));
      }
    },
    [client, state],
  );

  const retryMessage = useCallback(() => {
    if (!state.failedTurn) return;
    void sendMessage(state.failedTurn.message, state.failedTurn.turnId);
  }, [sendMessage, state.failedTurn]);

  const surrender = useCallback(async () => {
    if (!state.gameId || state.isProcessing || state.status !== "active") {
      return;
    }

    setState((current) => ({
      ...current,
      isProcessing: true,
      processingAction: "surrender",
      error: undefined,
    }));
    try {
      const game = await client.surrender(state.gameId);
      setState((current) => ({
        ...current,
        status: game.status,
        reveal: game.reveal,
        messages: game.messages,
      }));
    } catch (cause) {
      console.error(cause);
      setState((current) => ({
        ...current,
        error: "The character could not be revealed. Please try again.",
      }));
    } finally {
      setState((current) => ({
        ...current,
        isProcessing: false,
        processingAction: undefined,
      }));
    }
  }, [client, state]);

  return { state, newGame, sendMessage, retryMessage, surrender };
}
