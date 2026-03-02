import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GameType } from "@/src/core/constants/Types";

export const resolveKey = (gameType: GameType): string => {
  if (gameType === GameType.Duel || gameType === GameType.Roulette) return "spin";
  return gameType;
};

interface GameScreenState {
  screens: Record<string, string>;
  setScreen: (gameType: GameType, screen: string) => void;
  clearScreen: (gameType: GameType) => void;
  clearAllScreens: () => void;
}

export const useGameScreenStore = create<GameScreenState>()(
  persist(
    (set) => ({
      screens: {},
      setScreen: (gameType, screen) =>
        set((state) => ({ screens: { ...state.screens, [resolveKey(gameType)]: screen } })),
      clearScreen: (gameType) =>
        set((state) => {
          const { [resolveKey(gameType)]: _, ...rest } = state.screens;
          return { screens: rest };
        }),
      clearAllScreens: () => set({ screens: {} }),
    }),
    {
      name: "game-screen-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
