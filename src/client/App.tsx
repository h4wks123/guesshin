import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  CharacterReveal,
  GameMessage,
  GameResponse,
  GameStatus,
  GameStreamEvent,
} from "../types";
import "./styles.css";

const initialMessage: GameMessage = {
  role: "assistant",
  content:
    "The secret character is ready. Ask a question, look for a clue, or make a guess.",
};

function consumeSseEvents(buffer: string) {
  let normalized = buffer.replace(/\r/g, "");
  const events: string[] = [];

  let eventEndIndex: number;
  while ((eventEndIndex = normalized.indexOf("\n\n")) !== -1) {
    const rawEvent = normalized.slice(0, eventEndIndex);
    normalized = normalized.slice(eventEndIndex + 2);
    const dataLines = rawEvent
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice("data:".length).trimStart());
    if (dataLines.length > 0) events.push(dataLines.join("\n"));
  }

  return { events, buffer: normalized };
}

function App() {
  const [gameId, setGameId] = useState<string>();
  const [status, setStatus] = useState<GameStatus>("active");
  const [messages, setMessages] = useState<GameMessage[]>([initialMessage]);
  const [reveal, setReveal] = useState<CharacterReveal>();
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStarting, setIsStarting] = useState(true);
  const [error, setError] = useState<string>();
  const [failedTurn, setFailedTurn] = useState<{
    message: string;
    turnId: string;
  }>();
  const [showTutorial, setShowTutorial] = useState(true);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const container = messagesRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages, isProcessing]);

  useEffect(() => {
    void startGame();
  }, []);

  useEffect(() => {
    if (!isStarting) inputRef.current?.focus();
  }, [isStarting]);

  async function startGame() {
    setIsStarting(true);
    setError(undefined);
    setFailedTurn(undefined);
    setReveal(undefined);
    setStatus("active");
    setMessages([initialMessage]);

    try {
      const response = await fetch("/api/games", { method: "POST" });
      if (!response.ok) throw new Error("Unable to start a new game");
      const game = (await response.json()) as GameResponse;
      setGameId(game.gameId);
      setStatus(game.status);
      setMessages(game.messages.length > 0 ? game.messages : [initialMessage]);
    } catch (cause) {
      console.error(cause);
      setError("The game could not start. Please try again.");
    } finally {
      setIsStarting(false);
    }
  }

  function handleInputChange(value: string) {
    setInput(value);
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  async function sendMessage(
    event?: FormEvent,
    messageOverride?: string,
    turnIdOverride?: string,
  ) {
    event?.preventDefault();
    const message = (messageOverride ?? input).trim();
    if (!message || !gameId || isProcessing || status !== "active") return;

    const previousMessages = messages;
    const nextHistory = [
      ...previousMessages,
      { role: "user" as const, content: message },
    ];
    const turnId = turnIdOverride ?? crypto.randomUUID();
    setIsProcessing(true);
    setError(undefined);
    setFailedTurn(undefined);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    setMessages(nextHistory);

    try {
      const response = await fetch(
        `/api/games/${encodeURIComponent(gameId)}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, turnId }),
        },
      );
      if (!response.ok || !response.body)
        throw new Error("Failed to get response");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";
      let sawDone = false;

      const applyEvents = (events: string[]) => {
        for (const data of events) {
          if (data === "[DONE]") {
            sawDone = true;
            continue;
          }
          const event = JSON.parse(data) as GameStreamEvent;
          if (event.type === "state" && event.status) {
            setStatus(event.status);
            if (event.reveal) setReveal(event.reveal);
          }
          if (event.type === "message" && event.response)
            assistantText += event.response;
        }
        setMessages([
          ...nextHistory,
          ...(assistantText
            ? [{ role: "assistant" as const, content: assistantText }]
            : []),
        ]);
      };

      while (!sawDone) {
        const { done, value } = await reader.read();
        if (done) {
          applyEvents(consumeSseEvents(`${buffer}\n\n`).events);
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const parsed = consumeSseEvents(buffer);
        buffer = parsed.buffer;
        applyEvents(parsed.events);
      }
    } catch (cause) {
      console.error(cause);
      setMessages(previousMessages);
      setFailedTurn({ message, turnId });
      setError("The character could not answer. Your game is safe—try again.");
    } finally {
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  }

  async function surrender() {
    if (!gameId || isProcessing || status !== "active") return;
    setIsProcessing(true);
    setError(undefined);
    try {
      const response = await fetch(
        `/api/games/${encodeURIComponent(gameId)}/surrender`,
        { method: "POST" },
      );
      if (!response.ok) throw new Error("Unable to reveal the character");
      const game = (await response.json()) as GameResponse;
      setStatus(game.status);
      setReveal(game.reveal);
      setMessages(game.messages);
    } catch (cause) {
      console.error(cause);
      setError("The character could not be revealed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  const isTerminal = status !== "active";

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">A character deduction game</p>
          <h1>Guesshin</h1>
          <p className="tagline">
            Someone from Teyvat is speaking. Can you discover who?
          </p>
        </div>
        <div
          className={`status-badge status-${status}`}
          aria-label={`Game status: ${status}`}
        >
          <span aria-hidden="true" />
          {status === "active"
            ? "Mystery active"
            : status === "won"
              ? "You solved it"
              : "Mystery revealed"}
        </div>
      </header>

      {showTutorial && (
        <section className="tutorial" aria-labelledby="tutorial-title">
          <div>
            <p className="eyebrow">How to play</p>
            <h2 id="tutorial-title">Ask. Notice. Guess.</h2>
            <p>
              Ask the hidden character about their life, world, or abilities.
              They may offer clues, but they will not tell you their identity.
            </p>
            <p>
              When you are ready, ask one clear question such as{" "}
              <em>“Are you Amber?”</em> You can reveal the character whenever
              you want.
            </p>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={() => setShowTutorial(false)}
            aria-label="Dismiss tutorial"
          >
            ×
          </button>
        </section>
      )}

      <main className="game-card">
        <div className="game-toolbar">
          <div>
            <span className="toolbar-label">Current game</span>
            <strong>
              {isStarting
                ? "Preparing a mystery…"
                : isTerminal
                  ? "The Game is complete"
                  : "The character is listening"}
            </strong>
          </div>
          <div className="toolbar-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => void startGame()}
              disabled={isStarting || isProcessing}
            >
              New game
            </button>
            <button
              type="button"
              className="reveal-button"
              onClick={() => void surrender()}
              disabled={isStarting || isProcessing || isTerminal}
            >
              Reveal character
            </button>
          </div>
        </div>

        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            {failedTurn && (
              <button
                type="button"
                onClick={() =>
                  void sendMessage(
                    undefined,
                    failedTurn.message,
                    failedTurn.turnId,
                  )
                }
              >
                Retry
              </button>
            )}
          </div>
        )}

        <div
          className="game-messages"
          ref={messagesRef}
          aria-live="polite"
          aria-label="Game dialogue"
        >
          {messages.map((message, index) => (
            <div
              className={`message ${message.role}-message`}
              key={`${index}-${message.role}`}
            >
              <span className="message-label">
                {message.role === "assistant" ? "Mystery character" : "You"}
              </span>
              <p>{message.content}</p>
            </div>
          ))}
          {isProcessing && (
            <div className="typing-indicator" role="status">
              The character is thinking…
            </div>
          )}
        </div>

        {reveal && (
          <section className="reveal-card" aria-labelledby="reveal-title">
            <p className="eyebrow">The secret character was</p>
            <h2 id="reveal-title">{reveal.name}</h2>
            <div className="reveal-facts">
              <span>{reveal.element}</span>
              <span>{reveal.nation}</span>
              <span>{reveal.weapon}</span>
              <span>{reveal.role}</span>
            </div>
            <p>{reveal.summary}</p>
          </section>
        )}

        <form className="message-input" onSubmit={sendMessage}>
          <label className="sr-only" htmlFor="message">
            Message the mystery character
          </label>
          <textarea
            id="message"
            ref={inputRef}
            value={input}
            onChange={(event) => handleInputChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isTerminal
                ? "This game is complete"
                : "Ask a question or make a guess…"
            }
            rows={1}
            disabled={isStarting || isProcessing || isTerminal}
            aria-describedby="composer-help"
          />
          <button
            type="submit"
            className="send-button"
            disabled={isStarting || isProcessing || isTerminal || !input.trim()}
          >
            Send
          </button>
        </form>
        <p id="composer-help" className="composer-help">
          Press Enter to send · Shift+Enter for a new line
        </p>
      </main>

      <footer>
        <p>Made for curious travelers · No account required</p>
      </footer>
    </div>
  );
}

export default App;
