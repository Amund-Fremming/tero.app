import { useEffect, useRef, useState } from "react";
import { useGlobalSessionProvider } from "../common/context/GlobalSessionProvider";
import { ImposterGameState, ImposterSessionScreen } from "./constants/imposterTypes";
import { GameEntryMode } from "../common/constants/Types";
import { useImposterSessionProvider } from "./context/ImposterSessionProvider";
import CreateScreen from "./screens/CreateScreen/CreateScreen";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import ActiveLobbyScreen from "./screens/ActiveLobbyScreen/ActiveLobbyScreen";
import { useModalProvider } from "../common/context/ModalProvider";
import { resetToHomeScreen } from "../common/utils/navigation";
import { useHubConnectionProvider } from "../common/context/HubConnectionProvider";
import { useNavigation } from "expo-router";
import { useAuthProvider } from "../common/context/AuthProvider";
import { HubChannel } from "../common/constants/HubChannel";
import StartedScreen from "./screens/StartedScreen/StartedScreen";

export const ImposterGame = () => {
  const navigation: any = useNavigation();
  const {
    screen,
    setScreen,
    clearImposterSessionValues,
    setGameState,
    setImposterUserId,
    setRoundWord,
    setIterations,
  } = useImposterSessionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameEntryMode, hubAddress, gameKey, setIsHost, clearGlobalSessionValues, isHost, isDraft, gameType } =
    useGlobalSessionProvider();
  const { connect, setListener, disconnect, invokeFunction } = useHubConnectionProvider();
  const { pseudoId } = useAuthProvider();

  const isHandlingErrorRef = useRef(false);

  useEffect(() => {
    const initScreen = getInitialScreen();
    setScreen(initScreen);

    if (initScreen === ImposterSessionScreen.Create) {
      return;
    }

    initializeHub(hubAddress, gameKey, initScreen);

    return () => {
      disconnect();
    };
  }, []);

  const initializeHub = async (address: string, key: string, initialScreen: ImposterSessionScreen) => {
    const result = await connect(address);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Koblingsfeil. Bli med på nytt.");
      return;
    }

    setupListeners();

    const groupResult = await invokeFunction("ConnectToGroup", key, pseudoId);
    if (groupResult.isError()) {
      console.error(groupResult.error);
      displayErrorModal("Kunne ikke koble til.");
      return;
    }

    setScreen(initialScreen);
  };

  const setupListeners = async () => {
    setListener("host", (hostId: string) => {
      setIsHost(pseudoId === hostId);
    });

    setListener("signal_start", async (_value: boolean) => {
      if (!isHost) {
        await disconnect();
        return;
      }
      setScreen(ImposterSessionScreen.Game);
    });

    setListener(HubChannel.State, (state: ImposterGameState) => {
      setGameState(state);
    });

    setListener("imposter", (batch: string[]) => {
      console.log(batch);
      if (batch.includes(pseudoId)) {
        setImposterUserId(pseudoId);
      }
    });

    setListener("round_word", (roundText: string) => {
      setRoundWord(roundText);
    });

    setListener(HubChannel.Error, (message: string) => {
      if (isHandlingErrorRef.current) return;
      isHandlingErrorRef.current = true;

      displayErrorModal(message, async () => {
        await resetSessionAndNavigateHome();
      });
    });

    setListener(HubChannel.Iterations, (count: number) => {
      setIterations(count);
    });
  };

  const resetSessionAndNavigateHome = async () => {
    await disconnect();
    clearImposterSessionValues();
    clearGlobalSessionValues();
    resetToHomeScreen(navigation);
  };

  const getInitialScreen = (): ImposterSessionScreen => {
    switch (gameEntryMode) {
      case GameEntryMode.Creator:
        return ImposterSessionScreen.Create;
      case GameEntryMode.Host:
        return ImposterSessionScreen.Game;
      case GameEntryMode.Participant || GameEntryMode.Member:
        return ImposterSessionScreen.Lobby;
      default:
        return ImposterSessionScreen.Lobby;
    }
  };

  switch (screen) {
    case ImposterSessionScreen.Create:
      return (
        <CreateScreen onGameCreated={(address, key) => initializeHub(address, key, ImposterSessionScreen.Lobby)} />
      );
    case ImposterSessionScreen.Game:
      return <GameScreen />;
    case ImposterSessionScreen.Lobby:
      return <ActiveLobbyScreen />;
    case ImposterSessionScreen.Started:
      return <StartedScreen />;
    default:
      return <ActiveLobbyScreen />;
  }
};

export default ImposterGame;
