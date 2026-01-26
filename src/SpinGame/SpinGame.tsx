import React, { useEffect } from "react";
import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";
import { GameEntryMode } from "../common/constants/Types";
import CreateScreen from "./screens/CreateScreen/CreateScreen";
import { GameScreen } from "./screens/GameScreen/GameScreen";
import LobbyScreen from "./screens/LobbyScreen/LobbyScreen";
import { SpinSessionScreen } from "./constants/SpinTypes";
import { useSpinSessionProvider } from "./context/SpinGameProvider";

export const SpinGame = () => {
  const { gameEntryMode } = useGlobalSessionProvider();
  const { screen, setScreen } = useSpinSessionProvider();

  useEffect(() => {
    const initScreen = getInitialScreen();
    setScreen(initScreen);
  }, []);

  const getInitialScreen = (): SpinSessionScreen => {
    switch (gameEntryMode) {
      case GameEntryMode.Creator:
        return SpinSessionScreen.Create;
      case GameEntryMode.Host:
        return SpinSessionScreen.Game;
      case GameEntryMode.Participant || GameEntryMode.Member:
        return SpinSessionScreen.Lobby;
      default:
        return SpinSessionScreen.Lobby;
    }
  };

  switch (screen) {
    case SpinSessionScreen.Create:
      return <CreateScreen />;
    case SpinSessionScreen.Game:
      return <GameScreen />;
    case SpinSessionScreen.Lobby:
      return <LobbyScreen />;
    default:
      return <LobbyScreen />;
  }
};

export default SpinGame;
