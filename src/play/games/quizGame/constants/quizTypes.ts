export enum QuizGameScreen {
  Tutorial = "Tutorial",
  Game = "Game",
  Lobby = "Lobby",
  Started = "Started",
  Patch = "Patch",
}

export interface QuizSession {
  game_id: string;
  current_iteration: number;
  rounds: string[];
}
