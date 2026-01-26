import React, { createContext, ReactNode, useContext, useState } from "react";
import { SpinSessionScreen } from "../constants/SpinTypes";
import Color from "@/src/common/constants/Color";
import { GameType } from "@/src/common/constants/Types";

interface ISpinSessionContext {
  clearSpinSessionValues: () => void;
  screen: SpinSessionScreen;
  setScreen: React.Dispatch<React.SetStateAction<SpinSessionScreen>>;
  themeColor: string;
  secondaryThemeColor: string;
  featherIcon: "refresh-cw" | "rotate-cw";
  setThemeColors: (gameType: GameType) => void;
}

const defaultContextValue: ISpinSessionContext = {
  clearSpinSessionValues: () => {},
  screen: SpinSessionScreen.Create,
  setScreen: () => {},
  themeColor: Color.BeigeLight,
  secondaryThemeColor: Color.Beige,
  featherIcon: "refresh-cw",
  setThemeColors: () => {},
};

const SpinSessionContext = createContext<ISpinSessionContext>(defaultContextValue);

export const useSpinSessionProvider = () => useContext(SpinSessionContext);

interface SpinSessionProviderProps {
  children: ReactNode;
}

export const SpinSessionProvider = ({ children }: SpinSessionProviderProps) => {
  const [screen, setScreen] = useState<SpinSessionScreen>(SpinSessionScreen.Create);
  const [themeColor, setThemeColor] = useState<string>(Color.BeigeLight);
  const [secondaryThemeColor, setSecondaryThemeColor] = useState<string>(Color.Beige);
  const [featherIcon, setFeatherIcon] = useState<"refresh-cw" | "rotate-cw">("refresh-cw");

  const setThemeColors = (gameType: GameType) => {
    switch (gameType) {
      case GameType.Duel:
        setSecondaryThemeColor(Color.BeigeLight);
        setThemeColor(Color.Beige);
        setFeatherIcon("refresh-cw");
        break;
      case GameType.Roulette:
        setSecondaryThemeColor(Color.SkyBlueLight);
        setThemeColor(Color.SkyBlue);
        setFeatherIcon("rotate-cw");
        break;
    }
  };

  const clearSpinSessionValues = () => {
    setScreen(SpinSessionScreen.Create);
  };

  const value = {
    clearSpinSessionValues,
    screen,
    setScreen,
    themeColor,
    secondaryThemeColor,
    featherIcon,
    setThemeColors,
  };

  return <SpinSessionContext.Provider value={value}>{children}</SpinSessionContext.Provider>;
};

export default SpinSessionProvider;
