# Genshin Character Guessing Game

The domain language for a conversational game in which an LLM impersonates a hidden Genshin character and the player identifies them.

## Language

**Game**:
A single play session in which one secret character roleplays with a player until the player guesses correctly or surrenders. A game is `active` until it reaches one of its terminal outcomes: `won` or `revealed`.
_Avoid_: Chat, conversation, round

**Won**:
The terminal outcome of a game reached when the player's single-character guess matches the secret character.
_Avoid_: Completed, solved

**Revealed**:
The terminal outcome of a game reached when the player surrenders and receives the secret character's identity.
_Avoid_: Lost, failed

**Secret character**:
The Genshin character selected as the hidden identity for a game. The secret character is not exposed to the player until the game ends.
_Avoid_: Target, answer, persona

**Guess**:
The single character identity the player explicitly proposes while playing a game, expressed in natural language. A message that proposes multiple identities is not a valid guess and must be clarified before evaluation.
_Avoid_: Attempt, answer

**Clue**:
Information the secret character provides that helps the player identify them without directly revealing the secret character.
_Avoid_: Hint, tip

**Reveal**:
The end-of-game presentation of the secret character after a correct guess or player surrender.
_Avoid_: Solution, answer screen

**Surrender**:
The player's explicit decision to end the game without a correct guess and receive the reveal.
_Avoid_: Quit, give up

**Roleplay profile**:
The curated information used to define how a secret character speaks, what they know, and which clues they may provide during a game.
_Avoid_: Prompt, character data

**In-character response**:
An assistant response that maintains the secret character's voice and perspective while preserving the game's identity rules.
_Avoid_: AI reply, persona response

**Roster**:
The curated set of playable Genshin characters from which a game selects its secret character.
_Avoid_: Character list, database

**Alias**:
An alternate player-facing name that the game treats as identifying the same roster character as its canonical name.
_Avoid_: Nickname, typo
