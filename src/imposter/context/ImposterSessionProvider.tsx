import React, { createContext, ReactNode, useContext, useState } from "react";
import { ImposterGameState, ImposterSessionScreen } from "../constants/imposterTypes";

interface IImposterSessionContext {
  clearImposterSessionValues: () => void;
  screen: ImposterSessionScreen;
  setScreen: React.Dispatch<React.SetStateAction<ImposterSessionScreen>>;
  gameState: ImposterGameState | undefined;
  setGameState: React.Dispatch<React.SetStateAction<ImposterGameState | undefined>>;
  imposterUserId: string | undefined;
  setImposterUserId: React.Dispatch<React.SetStateAction<string | undefined>>;
  roundWord: string;
  setRoundWord: React.Dispatch<React.SetStateAction<string>>;
  iterations: number;
  setIterations: React.Dispatch<React.SetStateAction<number>>;
}

const defaultContextValue: IImposterSessionContext = {
  clearImposterSessionValues: () => {},
  screen: ImposterSessionScreen.Create,
  setScreen: () => {},
  gameState: undefined,
  setGameState: () => {},
  imposterUserId: undefined,
  setImposterUserId: () => {},
  roundWord: "",
  setRoundWord: () => {},
  iterations: 0,
  setIterations: () => {},
};

const ImposterSessionContext = createContext<IImposterSessionContext>(defaultContextValue);

export const useImposterSessionProvider = () => useContext(ImposterSessionContext);

interface SpinGameProviderProps {
  children: ReactNode;
}

export const ImposterSessionProvider = ({ children }: SpinGameProviderProps) => {
  const [screen, setScreen] = useState<ImposterSessionScreen>(ImposterSessionScreen.Create);
  const [gameState, setGameState] = useState<ImposterGameState | undefined>(undefined);
  const [imposterUserId, setImposterUserId] = useState<string | undefined>(undefined);
  const [roundWord, setRoundWord] = useState<string>("");
  const [players, setPlayers] = useState<number>(0);
  const [iterations, setIterations] = useState<number>(0);

  const clearImposterSessionValues = () => {
    setScreen(ImposterSessionScreen.Create);
    setGameState(undefined);
    setImposterUserId(undefined);
    setRoundWord("");
    setPlayers(0);
    setIterations(0);
  };

  const value = {
    clearImposterSessionValues,
    screen,
    setScreen,
    gameState,
    setGameState,
    imposterUserId,
    setImposterUserId,
    roundWord,
    setRoundWord,
    iterations,
    setIterations,
  };

  return <ImposterSessionContext.Provider value={value}>{children}</ImposterSessionContext.Provider>;
};

export default ImposterSessionProvider;
