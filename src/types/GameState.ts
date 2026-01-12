import type { CharacterState } from "./Character";
import type { StoryOption } from "./StoryNode";

export interface GameState {
  username: string;
  favorability: CharacterState;
  reputation: number;
  currentNodeId: string;
  choiceRecords: Record<string, string>;
  videoToPlay?: string | null;
  pendingOption?: StoryOption | null;
}