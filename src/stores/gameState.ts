import { ref } from "vue";
import { defineStore } from "pinia";
import type { GameState } from "@/types/GameState";
import type { CharacterState } from "@/types/Character";
import type { StoryOption } from "@/types/StoryNode";
import { useStoryEngineStore } from "./storyEngine";

export const useGameStateStore = defineStore("gameState", () => {
  // STATE
  const username = ref("");
  const favorability = ref<CharacterState>({ ghost: 0, konig: 0 });
  const reputation = ref(0);
  const hasReported = ref(0);
  const currentNodeId = ref("day1_morning_clinic");
  const choiceRecords = ref<Record<string, string>>({});
  const videoToPlay = ref<string | null>(null);
  const pendingOption = ref<StoryOption | null>(null);

  // ACTIONS
  function setUsername(name: string) {
    username.value = name;
  }

  function updateFavorability(characterId: keyof CharacterState, delta: number) {
    favorability.value[characterId] += delta;
  }

  function updateReputation(delta: number) {
    reputation.value += delta;
  }

  function updateHasReported(delta: number) {
    hasReported.value += delta;
  }
  function recordChoice(key: string, value: string) {
    choiceRecords.value[key] = value;
  }

  function setCurrentNode(nodeId: string) {
    currentNodeId.value = nodeId;
  }

  function setVideoToPlay(src: string | null) {
    videoToPlay.value = src;
  }

  function setPendingOption(option: StoryOption | null) {
    pendingOption.value = option;
  }

  function resetGame() {
    username.value = "";
    favorability.value = { ghost: 0, konig: 0 };
    reputation.value = 0;
    hasReported.value = 0;
    currentNodeId.value = "day1_morning_clinic";
    choiceRecords.value = {};
    videoToPlay.value = null;
    pendingOption.value = null;
  }

  function loadGameState(state: GameState) {
    username.value = state.username;
    favorability.value = { ...state.favorability };
    reputation.value = state.reputation;
    hasReported.value = state.hasReported;
    currentNodeId.value = state.currentNodeId;
    choiceRecords.value = { ...state.choiceRecords };
    videoToPlay.value = null;
    pendingOption.value = null;
  }

  function resolvePendingOption() {
    if (!pendingOption.value) return;

    const option = pendingOption.value;

    if (option.effect?.resetGame) {
      const currentUsername = username.value;
      resetGame();
      setUsername(currentUsername);
      setPendingOption(null);
      return;
    }

    if (option.record) {
      const recordKey = option.record.split("_")[0];
      recordChoice(recordKey, option.record);
    }

    if (option.effect) {
      if (option.effect.ghost) {
        updateFavorability("ghost", option.effect.ghost);
      }
      if (option.effect.konig) {
        updateFavorability("konig", option.effect.konig);
      }
      if (option.effect.reputation) {
        updateReputation(option.effect.reputation);
      }
      if (option.effect.hasReported) {
        updateHasReported(option.effect.hasReported);
      }
    }
    
    const storyEngine = useStoryEngineStore();

    let nextNodeId = option.nextNode;
    if (option.branches) {
      const currentState: GameState = {
        username: username.value,
        favorability: favorability.value,
        reputation: reputation.value,
        hasReported: hasReported.value,
        currentNodeId: currentNodeId.value,
        choiceRecords: choiceRecords.value,
      };
      const resolvedId = storyEngine.resolveBranches(option.branches, currentState);
      if (resolvedId) {
        nextNodeId = resolvedId;
      }
    }

    if (nextNodeId) {
      setCurrentNode(nextNodeId);
    }
    
    setPendingOption(null);
  }

  return {
    username,
    favorability,
    reputation,
    hasReported,
    currentNodeId,
    choiceRecords,
    videoToPlay,
    pendingOption,
    setUsername,
    updateFavorability,
    updateReputation,
    updateHasReported,
    recordChoice,
    setCurrentNode,
    setVideoToPlay,
    setPendingOption,
    resetGame,
    loadGameState,
    resolvePendingOption,
  };
});
