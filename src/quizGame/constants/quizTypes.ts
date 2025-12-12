import { GameCategory } from "@/src/Common/constants/Types";

export enum QuizGameScreen {
  Create,
  Game,
  Lobby,
  Started,
}

export interface QuizSession {
  base_id: string;
  quiz_id: string;
  name: string;
  description?: string | null;
  category: GameCategory;
  iterations: number;
  current_iteration: number;
  questions: string[];
  times_played: number;
}
