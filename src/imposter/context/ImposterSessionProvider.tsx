import React, { createContext, ReactNode, useContext, useState } from "react";
import { ImposterSessionScreen } from "../constants/imposterTypes";

interface IImposterSessionContext {
  clearImposterSessionValues: () => void;
  screen: ImposterSessionScreen;
  setScreen: React.Dispatch<React.SetStateAction<ImposterSessionScreen>>;
}

const defaultContextValue: IImposterSessionContext = {
  clearImposterSessionValues: () => {},
  screen: ImposterSessionScreen.Create,
  setScreen: () => {},
};

const ImposterSessionContext = createContext<IImposterSessionContext>(defaultContextValue);

export const useImposterSessionProvider = () => useContext(ImposterSessionContext);

interface SpinGameProviderProps {
  children: ReactNode;
}

export const ImposterSessionProvider = ({ children }: SpinGameProviderProps) => {
  const [screen, setScreen] = useState<ImposterSessionScreen>(ImposterSessionScreen.Create);

  const clearImposterSessionValues = () => {
    setScreen(ImposterSessionScreen.Create);
  };

  const value = {
    clearImposterSessionValues,
    screen,
    setScreen,
  };

  return <ImposterSessionContext.Provider value={value}>{children}</ImposterSessionContext.Provider>;
};

export default ImposterSessionProvider;
