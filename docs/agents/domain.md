# Domain Docs

How the engineering skills should consume this repo's domain documentation.

## Before exploring, read these

- **`GLOSSARY.md`** at the repo root.
- **`docs/adr/`** for decisions that touch the area being explored.

If either does not exist, proceed silently. The domain-modeling skills create them lazily when terms or decisions are resolved.

## File structure

This is a single-context repo:

```text
/
├── GLOSSARY.md
├── docs/adr/
└── src/
```

## Use the glossary's vocabulary

When output names a domain concept, use the term as defined in `GLOSSARY.md`. Do not drift to synonyms listed under `_Avoid_`.

If a needed concept is not in the glossary, treat that as a signal to sharpen the language through domain modeling.

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly rather than silently overriding it.
