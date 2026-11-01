# Server-authoritative game state

Guesshin keeps each game's secret character, status, and conversation state in a Cloudflare Durable Object rather than trusting the browser. This prevents the client from learning the answer early and gives the game deterministic transitions for guesses, surrender, and reveal; active state expires after one hour because games have no accounts or long-term persistence.

## Considered Options

- Client-held state: simpler, but exposes the secret character and allows the game to be tampered with.
- Stateless encrypted client token: protects the answer better, but complicates mutable conversation state and terminal transitions.
- Per-game Durable Object: isolates server-side state and fits the existing Cloudflare deployment boundary.
