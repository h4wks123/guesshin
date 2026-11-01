import { useEffect, useRef, useState } from "react";
import { useGameSession } from "./game/use-game-session";
import Dialogue from "./ui/Dialogue";
import ErrorBanner from "./ui/ErrorBanner";
import GameHeader from "./ui/GameHeader";
import GameToolbar from "./ui/GameToolbar";
import MessageComposer from "./ui/MessageComposer";
import RevealCard from "./ui/RevealCard";
import Tutorial from "./ui/Tutorial";
import "./styles.css";

function App() {
  const { state, newGame, sendMessage, retryMessage, surrender } =
    useGameSession();
  const [showTutorial, setShowTutorial] = useState(true);
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
    state.isStarting ||
    state.isProcessing ||
    isTerminal ||
    !state.gameId;

  return (
    <div className="app-shell">
      <GameHeader status={state.status} />

      {showTutorial && <Tutorial onDismiss={() => setShowTutorial(false)} />}

      <main className="game-card">
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
          isProcessing={state.isProcessing}
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
