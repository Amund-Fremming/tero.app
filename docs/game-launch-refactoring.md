# GameLaunchService – Extracting Duplicated Game-Launch Logic

## The Problem

The same `switch(gameType)` block that initiates a game and navigates to it exists in **three places**:

| File | Function |
|---|---|
| `src/play/screens/GameListScreen/GameListScreen.tsx` | `handleGamePressed` |
| `src/Hub/screens/SavedGamesScreen/SavedGamesScreen.tsx` | `handleGamePressed` |
| `src/Hub/screens/JoinScreen/JoinScreen.tsx` | `handleJoinGame` |

Any time a new game type is added, or the launch flow changes, all three files must be updated.  
The logic also reaches into `GlobalSessionProvider` directly, so there are multiple writers of shared state.

---

## What to Move

Everything inside the `switch(gameType)` blocks belongs in a single `GameLaunchService`:

- Call `initiateStaticGame` or `initiateSessionGame` on `GameService`
- Write the result (`gameKey`, `hubAddress`, `isDraft`, `isHost`, `gameEntryMode`) to `GlobalSessionProvider`
- Set the game-specific session (e.g. `setQuizSession`, `setImposterSession`)
- Navigate to the correct screen

The screens keep only the UI — they call `launchGame(gameId, gameType)` and handle loading/error state.

---

## Proposed `GameLaunchService`

> **Note:** A service must not import React hooks or navigation.  
> Pass `navigation`, session setters, and game-specific session setters as constructor arguments or as a plain options object.

```ts
// src/play/services/gameLaunchService.ts

import { GameService } from "./gameService";
import {
  GameBase,
  GameEntryMode,
  GameType,
  InteractiveGameResponse,
} from "../../core/constants/Types";
import { Result, err, ok } from "../../core/utils/result";
import Screen from "../../core/constants/Screen";
import { QuizSession } from "../games/quizGame/constants/quizTypes";
import { ImposterSession } from "../games/imposter/constants/imposterTypes";

export interface GameSessionSetters {
  setGameKey: (key: string) => void;
  setHubAddress: (address: string) => void;
  setGameEntryMode: (mode: GameEntryMode) => void;
  setIsHost: (isHost: boolean) => void;
  setIsDraft: (isDraft: boolean) => void;
  setQuizSession: (session: QuizSession) => void;
  setImposterSession: (session: ImposterSession) => void;
  navigate: (screen: Screen | string) => void;
}

export class GameLaunchService {
  constructor(
    private gameService: GameService,
    private pseudoId: string,
    private session: GameSessionSetters,
  ) {}

  async launchAsHost(gameId: string, gameType: GameType): Promise<Result<void>> {
    this.session.setIsHost(true);
    this.session.setGameEntryMode(GameEntryMode.Host);

    switch (gameType) {
      case GameType.Quiz:
        return this.launchQuiz(gameId);
      case GameType.Roulette:
      case GameType.Duel:
        return this.launchSessionGame(gameId, gameType);
      case GameType.Imposter:
        return this.launchImposter(gameId);
      default:
        return err(`Unsupported game type: ${gameType}`);
    }
  }

  private async launchQuiz(gameId: string): Promise<Result<void>> {
    const result = await this.gameService.initiateStaticGame<QuizSession>(
      GameType.Quiz,
      gameId,
      this.pseudoId,
    );
    if (result.isError()) return err(result.error);

    this.session.setQuizSession(result.value);
    this.session.navigate(Screen.Quiz);
    return ok();
  }

  private async launchImposter(gameId: string): Promise<Result<void>> {
    const result = await this.gameService.initiateStaticGame<ImposterSession>(
      GameType.Imposter,
      gameId,
      this.pseudoId,
    );
    if (result.isError()) return err(result.error);

    this.session.setImposterSession(result.value);
    this.session.navigate(Screen.Imposter);
    return ok();
  }

  private async launchSessionGame(
    gameId: string,
    gameType: GameType,
  ): Promise<Result<void>> {
    const result = await this.gameService.initiateSessionGame(
      this.pseudoId,
      gameType,
      gameId,
    );
    if (result.isError()) return err(result.error);

    const { key, hub_address, is_draft } = result.value;
    this.session.setGameKey(key);
    this.session.setHubAddress(hub_address);
    this.session.setIsDraft(is_draft);
    this.session.navigate(Screen.Spin);
    return ok();
  }
}
```

---

## How Screens Use It

Instead of the full switch-statement, a screen only needs:

```tsx
// GameListScreen.tsx  (after refactoring)

const handleGamePressed = async (gameId: string, gameType: GameType) => {
  setIsLaunching(true);
  const launcher = new GameLaunchService(gameService(), pseudoId, {
    setGameKey,
    setHubAddress,
    setGameEntryMode,
    setIsHost,
    setIsDraft,
    setQuizSession,
    setImposterSession,
    navigate: (screen) => navigation.navigate(screen),
  });

  const result = await launcher.launchAsHost(gameId, gameType);
  if (result.isError()) {
    displayErrorModal("Kunne ikke hente spill.");
  }
  setIsLaunching(false);
};
```

The exact same three lines replace the switch-block in `SavedGamesScreen` and a similar pattern in `JoinScreen`.

---

## Prop Injection Alternative

If you want `GameLaunchService` to be testable without constructing it inline every time, inject it as a prop from the screen's parent:

```tsx
// GameListScreen receives the launcher already configured by its parent
export interface GameListScreenProps {
  gameLauncher: GameLaunchService;
}

export const GameListScreen = ({ gameLauncher }: GameListScreenProps) => {
  const handleGamePressed = async (gameId: string, gameType: GameType) => {
    const result = await gameLauncher.launchAsHost(gameId, gameType);
    if (result.isError()) displayErrorModal("Kunne ikke hente spill.");
  };
  // ...
};
```

The parent (`GameTypeListScreen` or a navigator) constructs the launcher once with the correct pseudoId and session setters and passes it down.  
This makes every child component testable in isolation with a mock launcher.

---

## Files to Touch (When Implementing)

| File | Change |
|---|---|
| `src/play/services/gameLaunchService.ts` | **Create** |
| `src/play/screens/GameListScreen/GameListScreen.tsx` | Replace `handleGamePressed` with `gameLauncher.launchAsHost` |
| `src/Hub/screens/SavedGamesScreen/SavedGamesScreen.tsx` | Same |
| `src/Hub/screens/JoinScreen/JoinScreen.tsx` | Adapt join flow to use `GameLaunchService` |
