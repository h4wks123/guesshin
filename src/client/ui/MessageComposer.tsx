import { useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";

type MessageComposerProps = {
  disabled: boolean;
  isStarting: boolean;
  isTerminal: boolean;
  onSend: (message: string) => void;
};

function MessageComposer({
  disabled,
  isStarting,
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
      <form
        className="message-input"
        onSubmit={handleSubmit}
        aria-busy={isStarting}
      >
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
            isStarting
              ? "Loading…"
              : isTerminal
                ? "This game is complete"
                : "Ask or guess…"
          }
          rows={1}
          disabled={disabled}
        />
        <button
          type="submit"
          className="send-button"
          disabled={disabled || !value.trim()}
        >
          Send
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m4 10 12-6-4 12-2-5-6-1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            <path d="m10 11 6-7" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </button>
      </form>
    </>
  );
}

export default MessageComposer;
