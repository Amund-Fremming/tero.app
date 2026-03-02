# Game Screen Store

Persists which screen each game is currently on across re-mounts (e.g. app backgrounded).

## How it works

`useGameScreenStore` holds a `screens` record keyed by a resolved string per game:

| GameType            | Resolved key |
| ------------------- | ------------ |
| `GameType.Quiz`     | `"Quiz"`     |
| `GameType.Imposter` | `"Imposter"` |
| `GameType.Duel`     | `"spin"`     |
| `GameType.Roulette` | `"spin"`     |

Duel and Roulette share the `"spin"` key because they share the same navigator (`SpinGame`).

The `resolveKey(gameType)` helper (exported from `gameScreenStore.ts`) handles this mapping. It is called internally by `setScreen` and `clearScreen`, so callers always pass a `GameType`.

## Usage

```ts
// Set current screen
useGameScreenStore.getState().setScreen(GameType.Quiz, QuizGameScreen.Lobby);

// Read current screen (in a provider/component)
const screen = useGameScreenStore((s) => s.screens[GameType.Quiz]);

// Clear on session end
useGameScreenStore.getState().clearScreen(GameType.Quiz);
```

## Where screens are initialized

Each game's root component (`QuizGame.tsx`, `SpinGame.tsx`, `ImposterGame.tsx`) sets the initial screen in a `useEffect` on mount — only if no persisted screen exists yet.

Each game's session provider reads the persisted screen and exposes `setScreen` / `clearScreen` to the rest of the game.
