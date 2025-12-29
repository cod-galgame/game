import { defineStore } from "pinia";
import type { GameState } from "@/types/GameState";
import type { CharacterState } from "@/types/Character";

export const useGameStateStore = defineStore("gameState", {
  state: (): GameState => ({
    username: "",
    favorability: {
      ghost: 0,
      konig: 0,
    },
    reputation: 0,
    currentNodeId: "day1_morning_clinic",
    choiceRecords: {},
  }),

  actions: {
    setUsername(name: string) {
      this.username = name;
    },

    updateFavorability(characterId: keyof CharacterState, delta: number) {
      this.favorability[characterId] += delta;
    },

    updateReputation(delta: number) {
      this.reputation += delta;
    },

    recordChoice(key: string, value: string) {
      this.choiceRecords[key] = value;
    },

    setCurrentNode(nodeId: string) {
      this.currentNodeId = nodeId;
    },

    resetGame() {
      this.username = "";
      this.favorability = { ghost: 0, konig: 0 };
      this.reputation = 0;
      this.currentNodeId = "day1_morning_clinic";
      this.choiceRecords = {};
    },

    loadGameState(state: GameState) {
      this.username = state.username;
      this.favorability = { ...state.favorability };
      this.reputation = state.reputation;
      this.currentNodeId = state.currentNodeId;
      this.choiceRecords = { ...state.choiceRecords };
    },
  },
});
