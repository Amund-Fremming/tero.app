import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { GameEntryMode, GameType } from "../../core/constants/Types";
import { registerCrashResetCallback } from "../../core/utils/navigationRef";

interface IGameSessionStore {
  gameKey: string;
  hubName: string;
  gameId: string;
}

interface IGlobalSessionContext {
  gameEntryMode: GameEntryMode;
  setGameEntryMode: React.Dispatch<React.SetStateAction<GameEntryMode>>;
  gameType: GameType;
  setGameType: React.Dispatch<React.SetStateAction<GameType>>;
  gameSession: IGameSessionStore;
  setGameSession: React.Dispatch<React.SetStateAction<IGameSessionStore>>;
  setGameSessionValues: (gameKey: string, hubName: string, gameId: string) => void;
  isHost: boolean;
  setIsHost: React.Dispatch<React.SetStateAction<boolean>>;
  clearGlobalSessionValues: () => void;
  isDraft: boolean;
  setIsDraft: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultContextValue: IGlobalSessionContext = {
  gameEntryMode: GameEntryMode.Creator,
  setGameEntryMode: () => {},
  gameType: GameType.Quiz,
  setGameType: () => {},
  gameSession: {
    gameKey: "",
    hubName: "",
    gameId: "",
  },
  setGameSession: () => {},
  setGameSessionValues: () => {},
  isHost: false,
  setIsHost: () => {},
  isDraft: false,
  setIsDraft: () => {},
  clearGlobalSessionValues: () => {},
};

const GlobalSessionContext = createContext<IGlobalSessionContext>(defaultContextValue);

export const useGlobalSessionProvider = () => useContext(GlobalSessionContext);

interface GlobalSessionProviderProps {
  children: ReactNode;
}

export const GlobalGameProvider = ({ children }: GlobalSessionProviderProps) => {
  const [gameEntryMode, setGameEntryMode] = useState<GameEntryMode>(GameEntryMode.Host);
  const [gameType, setGameType] = useState<GameType>(GameType.Quiz);
  const [gameSession, setGameSession] = useState<IGameSessionStore>({ gameKey: "", hubName: "", gameId: "" });
  const [isHost, setIsHost] = useState<boolean>(false);
  const [isDraft, setIsDraft] = useState<boolean>(false);

  useEffect(() => {}, [isHost]);

  useEffect(() => {
    return registerCrashResetCallback(clearGlobalSessionValues);
  }, []);

  const clearGlobalSessionValues = () => {
    setGameEntryMode(GameEntryMode.Creator);
    setGameSession({ gameKey: "", hubName: "", gameId: "" });
    setIsHost(false);
    setIsDraft(false);
  };

  const setGameSessionValues = (gameKey: string, hubName: string, gameId: string) => {
    setGameSession({ gameKey, hubName, gameId });
  };

  const value = {
    clearGlobalSessionValues,
    gameEntryMode,
    setGameEntryMode,
    gameType,
    setGameType,
    gameSession,
    setGameSession,
    setGameSessionValues,
    isHost,
    setIsHost,
    isDraft,
    setIsDraft,
  };

  return <GlobalSessionContext.Provider value={value}>{children}</GlobalSessionContext.Provider>;
};

export default GlobalGameProvider;
