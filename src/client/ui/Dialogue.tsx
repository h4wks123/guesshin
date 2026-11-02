import type { RefObject } from "react";
import type { GameMessage } from "../../types";
import Loader from "./Loader";

type DialogueProps = {
  messages: GameMessage[];
  isStarting?: boolean;
  isProcessing: boolean;
  messagesRef: RefObject<HTMLDivElement | null>;
};

function Dialogue({ messages, isStarting = false, isProcessing, messagesRef }: DialogueProps) {
  if (isStarting) {
    return (
      <div className="dialogue dialogue--loading" aria-label="Game dialogue">
        <Loader label="Starting a new Game…" />
      </div>
    );
  }

  return (
    <div
      className="dialogue"
      ref={messagesRef}
      aria-live="polite"
      aria-label="Game dialogue"
    >
      {messages.map((message, index) => (
        <div
          className={message.role === "user" ? "message message--user" : "message"}
          key={`${index}-${message.role}`}
        >
          <span className="message__label">
            {message.role === "assistant" ? "Mystery character" : "You"}
          </span>
          <p className="message__content">{message.content}</p>
        </div>
      ))}
      {isProcessing && (
        <Loader label="The character is thinking…" />
      )}
    </div>
  );
}

export default Dialogue;
