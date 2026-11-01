import { useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";

type MessageComposerProps = {
  disabled: boolean;
  isTerminal: boolean;
  onSend: (message: string) => void;
};

function MessageComposer({
  disabled,
  isTerminal,
  onSend,
}: MessageComposerProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function handleInputChange(nextValue: string) {
    setValue(nextValue);
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  function clearInput() {
    setValue("");
    if (inputRef.current) inputRef.current.style.height = "auto";
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const message = value.trim();
    if (!message || disabled) return;
    clearInput();
    onSend(message);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <>
      <form className="message-input" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="message">
          Message the mystery character
        </label>
        <textarea
          id="message"
          ref={inputRef}
          value={value}
          onChange={(event) => handleInputChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isTerminal
              ? "This game is complete"
              : "Ask a question or make a guess…"
          }
          rows={1}
          disabled={disabled}
          aria-describedby="composer-help"
        />
        <button
          type="submit"
          className="send-button"
          disabled={disabled || !value.trim()}
        >
          Send
        </button>
      </form>
      <p id="composer-help" className="composer-help">
        Press Enter to send · Shift+Enter for a new line
      </p>
    </>
  );
}

export default MessageComposer;
