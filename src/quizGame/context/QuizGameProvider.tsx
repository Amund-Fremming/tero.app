import React, { createContext, ReactNode, useContext, useState } from "react";
import { QuizGameScreen, QuizSession } from "../constants/quizTypes";

interface IQuizGameContext {
  clearQuizGameValues: () => void;
  quizSession: QuizSession | undefined;
  setQuizSession: React.Dispatch<React.SetStateAction<QuizSession | undefined>>;
  screen: QuizGameScreen;
  setScreen: React.Dispatch<React.SetStateAction<QuizGameScreen>>;
}

const defaultContextValue: IQuizGameContext = {
  clearQuizGameValues: () => {},
  quizSession: undefined,
  setQuizSession: () => {},
  screen: QuizGameScreen.Create,
  setScreen: () => {},
};

const QuizGameContext = createContext<IQuizGameContext>(defaultContextValue);

export const useQuizGameProvider = () => useContext(QuizGameContext);

interface QuizGameProviderProps {
  children: ReactNode;
}

export const QuizGameProvider = ({ children }: QuizGameProviderProps) => {
  const [quizSession, setQuizSession] = useState<QuizSession | undefined>(undefined);
  const [screen, setScreen] = useState<QuizGameScreen>(QuizGameScreen.Create);

  const clearQuizGameValues = () => {
    setQuizSession(undefined);
  };

  const value = {
    clearQuizGameValues,
    quizSession,
    setQuizSession,
    screen,
    setScreen,
  };

  return <QuizGameContext.Provider value={value}>{children}</QuizGameContext.Provider>;
};

export default QuizGameProvider;
