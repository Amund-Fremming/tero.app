# Architecture – Ownership and Clean Separation

## The Problem

Right now business logic is spread across every layer.  
A view component like `HomeScreen` handles retry-loops, health-checks, popup fetching, and navigation.  
`GameListScreen` and `SavedGamesScreen` each contain an almost identical `handleGamePressed` switch-statement.  
Any screen can reach into `GlobalSessionProvider` and mutate shared state directly — there is no single owner.

---

## Ownership Model

Give every piece of behaviour one clear owner.

| Concern | Current owner | Proposed owner |
|---|---|---|
| pseudoId lifecycle (create / retry / persist) | `HomeScreen` + `AuthProvider` | `AuthProvider` only |
| App startup (health check, global popup) | `HomeScreen` | `useHomeScreenController` hook |
| Initiating / joining a game | `GameListScreen`, `SavedGamesScreen`, `JoinScreen` (all three, duplicated) | `GameLaunchService` |
| Persisting game session keys after launch | scattered across screens | `GameLaunchService` writes to `GlobalSessionProvider` once |
| Hub connection lifecycle | `ImposterGame`, `SpinGame` | dedicated `useHubSession` hook inside each game |
| Game-specific screen state (current screen, iterations, …) | game providers (OK) + screens that call `setScreen` directly | game providers only |
| UI rendering | everywhere (OK) + business logic mixed in | view components only |

---

## Layer Overview

```
src/
├── core/
│   ├── services/          ← pure data / API logic, no navigation
│   └── context/           ← global state providers (AuthProvider, ModalProvider, ServiceProvider)
├── play/
│   ├── services/
│   │   └── gameService.ts          ← existing: API calls
│   │   └── gameLaunchService.ts    ← NEW: orchestrates initiate + session write + navigation
│   ├── context/
│   │   └── GlobalSessionProvider.tsx   ← keep, but only written to by services / game controllers
│   └── games/
│       └── <game>/
│           ├── <Game>.tsx              ← thin orchestrator (picks which screen to show)
│           ├── screens/               ← pure render, call controller hooks
│           ├── context/               ← game-scoped state
│           └── controller/            ← NEW per-game hooks (useImposterController, etc.)
└── Hub/
    └── screens/
        └── HomeScreen/
            ├── HomeScreen.tsx         ← render only
            └── useHomeScreenController.ts  ← NEW: startup logic
```

---

## Guiding Principles

1. **View components render, controllers act.**  
   A screen component reads state and fires events. All async work, validation, and navigation decisions live in a controller hook or service.

2. **One writer per piece of state.**  
   `GlobalSessionProvider` exposes setters, but only `GameLaunchService` (and the join flow) should call them. Screens never set `gameKey`, `hubAddress`, or `isHost` directly.

3. **Services have no UI dependencies.**  
   A service receives plain arguments (pseudoId, gameId, etc.) and returns a `Result<T>`. It never calls `navigation`, `displayErrorModal`, or reads from a React context.

4. **Inject services as props from the entry point.**  
   When a screen or game component needs a service, receive it as a prop (or from a typed controller hook). This makes the dependency explicit and the component independently testable.

---

## See Also

- [`game-launch-refactoring.md`](./game-launch-refactoring.md) – extract the duplicated game-launch switch-statement
- [`screen-controller-pattern.md`](./screen-controller-pattern.md) – the controller-hook pattern with prop-injected services, applied to `HomeScreen`
