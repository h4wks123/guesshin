import type { RefObject } from "react";
import type { GameMessage } from "../../types";
import Loader from "./Loader";

type DialogueProps = {
  messages: GameMessage[];
  isProcessing: boolean;
  messagesRef: RefObject<HTMLDivElement | null>;
};

function Dialogue({ messages, isProcessing, messagesRef }: DialogueProps) {
  return (
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
        <Loader label="The character is thinking…" />
      )}
    </div>
  );
}

export default Dialogue;
