import { useEffect, useRef } from "react";
import { useGameSession } from "./game/use-game-session";
import Dialogue from "./ui/Dialogue";
import ErrorBanner from "./ui/ErrorBanner";
import GameHeader from "./ui/GameHeader";
import GameToolbar from "./ui/GameToolbar";
import MessageComposer from "./ui/MessageComposer";
import RevealCard from "./ui/RevealCard";
import "./styles.css";

function App() {
  const { state, newGame, sendMessage, retryMessage, surrender } =
    useGameSession();
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [state.messages, state.isProcessing]);

  useEffect(() => {
    if (!state.isStarting && !state.isProcessing)
      document.getElementById("message")?.focus();
  }, [state.isStarting, state.isProcessing]);

  const isTerminal = state.status !== "active";
  const isComposerDisabled =
    state.isStarting || state.isProcessing || isTerminal || !state.gameId;

  return (
    <div className="game">
      <GameHeader />
      <main className="game__chat">
        <GameToolbar
          status={state.status}
          isStarting={state.isStarting}
          isProcessing={state.isProcessing}
          processingAction={state.processingAction}
          onNewGame={() => void newGame()}
          onSurrender={() => void surrender()}
        />
        <ErrorBanner
          error={state.error}
          canRetry={Boolean(state.failedTurn)}
          onRetry={retryMessage}
        />
        <Dialogue
          messages={state.messages}
          isStarting={state.isStarting}
          isProcessing={state.processingAction === "message"}
          messagesRef={messagesRef}
        />
        <RevealCard reveal={state.reveal} />
        <MessageComposer
          disabled={isComposerDisabled}
          isStarting={state.isStarting}
          isTerminal={isTerminal}
          onSend={(message) => void sendMessage(message)}
        />
      </main>
    </div>
  );
}

export default App;
