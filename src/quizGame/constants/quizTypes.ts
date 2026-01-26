import { GameCategory } from "@/src/common/constants/Types";

export enum QuizGameScreen {
  Create,
  Game,
  Lobby,
  Started,
}

export interface QuizSession {
  game_id: string;
  current_iteration: number;
  questions: string[];
}
