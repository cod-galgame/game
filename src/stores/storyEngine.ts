import { defineStore } from "pinia";
import storyNodesData from "@/data/story-nodes.json";
import dialogsData from "@/data/dialogs.json";
import type { StoryNode } from "@/types/StoryNode";
import type { CharacterDialogs } from "@/types/Dialog";

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
});
