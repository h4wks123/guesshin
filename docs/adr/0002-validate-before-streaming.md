# Validate model responses before streaming

The Worker generates the complete roleplay response, checks it for the secret character's canonical name, aliases, and forbidden profile phrases, and only then streams the clean response to the browser. This adds a small latency cost but makes leakage recovery possible; a leaked response can be retried before any hidden identity reaches the player.

## Considered Options

- Stream immediately: preserves the lowest latency, but an identity leak cannot be retracted.
- Generate and send only after validation: allows one corrective retry and a neutral fallback while retaining the existing streaming presentation after validation.
