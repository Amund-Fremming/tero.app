# Screen Controller Pattern – Removing Logic from View Components

## The Problem

View components like `HomeScreen` currently mix rendering with async business logic:

```tsx
// HomeScreen.tsx – as it stands today
export const HomeScreen = () => {
  const { ensurePseudoId, setPseudoId } = useAuthProvider();
  const { commonService, userService } = useServiceProvider();
  // ...

  useEffect(() => {
    setSubHeader();
    initializeScreen();   // ← startup orchestration in the view
  }, []);

  const initializeScreen = async () => {
    const success = await ensurePseudoIdReady(); // retry loop here
    if (!success) return;
    await systemHealth();    // health check here
    await getClientPopup();  // popup fetch here
  };

  const ensurePseudoIdReady = async (): Promise<boolean> => {
    // retry loop with exponential backoff
    // displayLoadingModal
    // setPseudoId
    // SecureStore.setItemAsync
    // navigation.navigate(Screen.Problem)
    // ...
  };

  // ... more logic ...

  return <View>...</View>;   // the actual render is at the bottom
};
```

Problems:
- Logic is untestable without rendering the full component tree
- The view knows about retry strategies, loading modals, and failure paths
- `HomeScreen` calls `setPseudoId` and `SecureStore` — those responsibilities belong to `AuthProvider`

---

## The Pattern: Controller Hook

Extract every async/logic call into a custom hook.  
The view component receives only derived values and callback functions.

```
HomeScreen.tsx          ← renders UI only
useHomeScreenController.ts  ← owns startup logic, returns state + callbacks
```

---

## Step 1 – Move Logic to `useHomeScreenController`

```ts
// src/Hub/screens/HomeScreen/useHomeScreenController.ts

import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "expo-router";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import { GameEntryMode } from "@/src/core/constants/Types";
import Screen from "@/src/core/constants/Screen";

const SUB_HEADERS = [
  "klar for en runde?",
  "la spillet begynne",
  "ta en pause og bli med",
  "vi kjører på",
  "få i gang kvelden",
  "rolige vibber, gode valg",
  "klart for neste?",
];

export const useHomeScreenController = () => {
  const navigation: any = useNavigation();
  const { pseudoId, setPseudoId, ensurePseudoId } = useAuthProvider();
  const { setGameEntryMode } = useGlobalSessionProvider();
  const { commonService, userService } = useServiceProvider();
  const { displayInfoModal, displayLoadingModal, closeLoadingModal } = useModalProvider();

  const [subHeader] = useState(
    () => SUB_HEADERS[Math.floor(Math.random() * SUB_HEADERS.length)],
  );
  const [isPseudoReady, setIsPseudoReady] = useState(false);
  const [popupCloseCount, setPopupCloseCount] = useState(0);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const ready = await ensurePseudoIdReady();
    if (!ready) return;
    await checkSystemHealth();
    await fetchGlobalPopup();
  };

  const ensurePseudoIdReady = async (): Promise<boolean> => {
    if (pseudoId !== "") {
      setIsPseudoReady(true);
      return true;
    }

    const MAX = 5;
    displayLoadingModal(() => {
      closeLoadingModal();
      navigation.navigate(Screen.Problem);
    }, "Trying to reconnect.");

    for (let attempt = 0; attempt < MAX; attempt++) {
      const result = await ensurePseudoId();
      if (!result.isError() && result.value !== "") {
        setPseudoId(result.value);
        await SecureStore.setItemAsync("pseudo_id", result.value);
        closeLoadingModal();
        setIsPseudoReady(true);
        return true;
      }
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }

    closeLoadingModal();
    navigation.navigate(Screen.Problem);
    return false;
  };

  const checkSystemHealth = async () => {
    const result = await commonService().healthDetailed();
    if (result.isError()) {
      navigation.navigate(Screen.Error);
    }
  };

  const fetchGlobalPopup = async () => {
    if (popupCloseCount >= 2) return;
    const result = await userService().getGlobalPopup();
    if (result.isError() || !result.value.active) return;
    const { paragraph, heading } = result.value;
    displayInfoModal(paragraph, heading, () =>
      setPopupCloseCount((c) => c + 1),
    );
  };

  const handleNavigate = (mode: GameEntryMode, destination: Screen) => {
    if (!isPseudoReady) return;
    setGameEntryMode(mode);
    navigation.navigate(destination);
  };

  return { subHeader, isPseudoReady, handleNavigate };
};
```

---

## Step 2 – Slim Down the View

```tsx
// src/Hub/screens/HomeScreen/HomeScreen.tsx  (after refactoring)

import { View, Text, Pressable, Image } from "react-native";
import { useNavigation } from "expo-router";
import { useHomeScreenController } from "./useHomeScreenController";
import DiagonalSplit from "../../../core/components/Shapes/DiagonalSplit";
import ArcWithCircles from "../../../core/components/Shapes/ArcWithCircles";
import ScatteredCircles from "../../../core/components/Shapes/ScatteredCircles";
import { GameEntryMode } from "@/src/core/constants/Types";
import Screen from "@/src/core/constants/Screen";
import redFigure from "../../../core/assets/images/red-figure.png";
import styles from "./homeScreenStyles";

export const HomeScreen = () => {
  const navigation: any = useNavigation();
  const { subHeader, isPseudoReady, handleNavigate } = useHomeScreenController();

  return (
    <View style={styles.container}>
      <View style={styles.leadContainer}>
        <Text style={styles.header}>tero</Text>
        <Text style={styles.subHeader}>{subHeader}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={{ ...styles.buttonBase, ...styles.topLeft }}
          disabled={!isPseudoReady}
          onPress={() => handleNavigate(GameEntryMode.Creator, Screen.GameTypeList)}
        >
          <Image style={styles.image} source={redFigure} />
          <View style={styles.buttonTextWrapper}>
            <Text style={{ ...styles.textBase, ...styles.textTopLeft }}>LAG</Text>
            <Text style={{ ...styles.textBase, ...styles.textTopLeft }}>SPILL</Text>
          </View>
        </Pressable>
        {/* … other buttons … */}
      </View>
    </View>
  );
};
```

The view now has zero async calls, zero navigation decisions, and zero state management — it just calls the controller and renders what it receives.

---

## Prop Injection for Services

When the same pattern is applied to a game screen, services can be injected as props instead of pulled from context.  
This makes the screen usable in tests without a full provider tree.

### Defining the service interface

```ts
// src/play/games/quizGame/QuizGameService.ts

export interface IQuizGameService {
  initiateGame(pseudoId: string, gameId: string): Promise<Result<QuizSession>>;
}
```

### Passing the service from the parent

```tsx
// The parent (e.g. GameTypeListScreen) builds the service and passes it down
import { GameService } from "@/src/play/services/gameService";

const gameService = useServiceProvider().gameService();

// ...
<QuizGame
  service={{
    initiateGame: (pseudoId, gameId) =>
      gameService.initiateStaticGame("Quiz", gameId, pseudoId),
  }}
/>
```

### The game component receives only what it needs

```tsx
// QuizGame.tsx
export interface QuizGameProps {
  service: IQuizGameService;
}

export const QuizGame = ({ service }: QuizGameProps) => {
  // no useServiceProvider() — dependency is injected
};
```

---

## Summary of Changes Per File

| File | What to do |
|---|---|
| `HomeScreen.tsx` | Remove all async logic; call `useHomeScreenController()` |
| `useHomeScreenController.ts` | **Create**: startup, health, popup, pseudoId retry |
| `GameListScreen.tsx` | Remove `handleGamePressed`; use `GameLaunchService` (see `game-launch-refactoring.md`) |
| `SavedGamesScreen.tsx` | Same as above |
| `JoinScreen.tsx` | Extract join + navigate to `useJoinScreenController` |
| `ImposterGame.tsx` | Move hub setup to `useImposterController` |
| `SpinGame.tsx` | Move hub setup to `useSpinController` |
| Game screen components | Accept `service` as a prop instead of calling `useServiceProvider()` |
