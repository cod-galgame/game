import { defineStore } from "pinia";
import storyNodesData from "@/data/story-nodes.json";
import dialogsData from "@/data/dialogs.json";
import type { StoryNode, StoryOption } from "@/types/StoryNode";
import type { CharacterDialogs } from "@/types/Dialog";
import { evaluateCondition } from "@/utils/conditionEvaluator";
import type { GameState } from "@/types/GameState";

// 新增 reputation 配置的类型定义
export type ReputationConfig = {
  [key: string]: Array<{
    min: number;
    max: number;
    text: string;
  }>;
};

export const useStoryEngineStore = defineStore("storyEngine", {
  state: () => ({
    storyNodes: storyNodesData as Record<string, StoryNode>,
    dialogs: dialogsData as CharacterDialogs,
    reputation: {} as ReputationConfig,
  }),

  getters: {
    getCurrentNode:
      (state) =>
      (nodeId: string): StoryNode | undefined => {
        return state.storyNodes[nodeId];
      },
      // 3. 新增：获取 reputation 对应的文本（可选，方便模板渲染调用）
    getReputationText: (state) => (key: string, currentRep: number) => {
      const config = state.reputation[key];
      if (!config) return "";
      // 匹配区间并返回对应文本
      const matchItem = config.find(item => currentRep >= item.min && currentRep <= item.max);
      return matchItem?.text || "";
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