import { defineStore } from "pinia";
import storyNodesData from "@/data/story-nodes.json";
import dialogsData from "@/data/dialogs.json";
import type { StoryNode, StoryOption } from "@/types/StoryNode";
import type { CharacterDialogs } from "@/types/Dialog";
import { evaluateCondition } from "@/utils/conditionEvaluator";
import type { GameState } from "@/types/GameState";

export const useStoryEngineStore = defineStore("storyEngine", {
  state: () => ({
    storyNodes: storyNodesData as Record<string, StoryNode>,
    dialogs: dialogsData as CharacterDialogs,
  }),

  getters: {
    getCurrentNode:
      (state) =>
      (nodeId: string): StoryNode | undefined => {
        return state.storyNodes[nodeId];
      },
  },
  
  actions: {
    resolveBranches(
      branches: StoryOption["branches"],
      gameState: GameState
    ): string | undefined {
      if (!branches) return undefined;

      for (const branch of branches) {
        if (!branch.cond) {
          return branch.nextNode;
        }
        if (evaluateCondition(branch.cond, gameState)) {
          return branch.nextNode;
        }
      }
      return undefined;
    }
  }
});