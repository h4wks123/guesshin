import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

type Role = "user" | "assistant";

type ChatMessage = {
	role: Role;
	content: string;
};

const welcomeMessage =
	"Hello! I'm an LLM chat app powered by Cloudflare Workers AI. How can I help you today?";

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

function getEventContent(data: string) {
	try {
		const jsonData = JSON.parse(data) as {
			response?: unknown;
			choices?: Array<{ delta?: { content?: unknown } }>;
		};

		if (typeof jsonData.response === "string") return jsonData.response;
		const content = jsonData.choices?.[0]?.delta?.content;
		return typeof content === "string" ? content : "";
	} catch (error) {
		console.error("Error parsing SSE data as JSON:", error, data);
		return "";
	}
}

function App() {
	const [messages, setMessages] = useState<ChatMessage[]>([
		{ role: "assistant", content: welcomeMessage },
	]);
	const [input, setInput] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const messagesRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		const container = messagesRef.current;
		if (container) container.scrollTop = container.scrollHeight;
	}, [messages]);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

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

	async function sendMessage(event?: FormEvent) {
		event?.preventDefault();
		const message = input.trim();
		if (!message || isProcessing) return;

		const nextHistory = [...messages, { role: "user" as const, content: message }];
		setIsProcessing(true);
		setInput("");
		if (inputRef.current) inputRef.current.style.height = "auto";
		setMessages([...nextHistory, { role: "assistant", content: "" }]);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: nextHistory }),
			});

			if (!response.ok || !response.body) throw new Error("Failed to get response");

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let buffer = "";
			let responseText = "";
			let sawDone = false;

			const appendEvents = (events: string[]) => {
				for (const data of events) {
					if (data === "[DONE]") {
						sawDone = true;
						break;
					}
					responseText += getEventContent(data);
				}
				setMessages([...nextHistory, { role: "assistant", content: responseText }]);
			};

			while (!sawDone) {
				const { done, value } = await reader.read();
				if (done) {
					appendEvents(consumeSseEvents(`${buffer}\n\n`).events);
					break;
				}

				buffer += decoder.decode(value, { stream: true });
				const parsed = consumeSseEvents(buffer);
				buffer = parsed.buffer;
				appendEvents(parsed.events);
			}

			if (!responseText) {
				setMessages([
					...nextHistory,
					{ role: "assistant", content: "The AI returned an empty response." },
				]);
			}
		} catch (error) {
			console.error("Error:", error);
			setMessages([
				...nextHistory,
				{ role: "assistant", content: "Sorry, there was an error processing your request." },
			]);
		} finally {
			setIsProcessing(false);
			inputRef.current?.focus();
		}
	}

	return (
		<div className="app-shell">
			<header>
				<h1>Cloudflare AI Chat</h1>
				<p>Powered by Cloudflare Workers AI</p>
			</header>

			<main className="chat-container">
				<div className="chat-messages" ref={messagesRef} aria-live="polite">
					{messages.map((message, index) => (
						<div className={`message ${message.role}-message`} key={`${index}-${message.role}`}>
							<p>{message.content}</p>
						</div>
					))}
					{isProcessing && <div className="typing-indicator">AI is thinking...</div>}
				</div>

				<form className="message-input" onSubmit={sendMessage}>
					<textarea
						ref={inputRef}
						value={input}
						onChange={(event) => handleInputChange(event.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Type your message here..."
						rows={1}
						disabled={isProcessing}
						aria-label="Message"
					/>
					<button type="submit" disabled={isProcessing || !input.trim()}>
						Send
					</button>
				</form>
			</main>

			<footer>
				<p>Cloudflare Workers AI Chat Template &copy; 2025</p>
			</footer>
		</div>
	);
}

export default App;
