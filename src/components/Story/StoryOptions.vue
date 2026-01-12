<template>
  <div class="story-options">
    <!-- SVG for noise filter -->
    <svg width="0" height="0" style="position: absolute">
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.35"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.15" />
        </feComponentTransfer>
      </filter>
    </svg>

    <button
      v-for="option in options"
      :key="option.id"
      class="option-btn"
      @click="handleOptionClick(option)"
    >
      <span style="text-shadow: 2px 2px 1px black"> {{ option.text }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useGameStateStore } from "@/stores/gameState";
import { useStoryEngineStore } from "@/stores/storyEngine";
import type { StoryOption } from "@/types/StoryNode";
import { evaluateCondition } from "@/utils/conditionEvaluator";

const gameState = useGameStateStore();
const storyEngine = useStoryEngineStore();

const options = computed(() => {
  const node = storyEngine.getCurrentNode(gameState.currentNodeId);
  const allOptions = node?.options || [];

  // 过滤掉不满足显示条件的选项
  return allOptions.filter((option) => {
    if (!option.visibilityCondition) return true;
    return evaluateCondition(option.visibilityCondition, gameState);
  });
});

function handleOptionClick(option: StoryOption) {
  const node = storyEngine.getCurrentNode(gameState.currentNodeId);
  
  if (node?.video) {
    gameState.setVideoToPlay(node.video);
    gameState.setPendingOption(option);
  } else {
    // If there is no video, proceed as normal by setting and resolving the pending option.
    gameState.setPendingOption(option);
    gameState.resolvePendingOption();
  }
}
</script>

<style scoped>
.story-options {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-btn {
  padding: 15px 20px;
  font-size: 16px;
  font-family: "Impact", "Arial Black", sans-serif;
  background-color: #6c757d; /* Dark grey */
  color: #f8f9fa; /* Light grey text */
  border: 2px solid #495057; /* Darker border */
  border-radius: 2px; /* Sharp corners */
  cursor: pointer;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow:
    0 5px 0 #495057,
    /* Hard 3D shadow */ inset 0 1px 1px rgba(255, 255, 255, 0.1),
    /* Inner highlight for wear */ inset 0 -2px 3px rgba(0, 0, 0, 0.2); /* Inner shadow for depth */
  transition:
    transform 0.1s,
    box-shadow 0.1s;
  position: relative;
  overflow: hidden;
}

.option-btn::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: url(#noiseFilter);
  pointer-events: none;
}

.option-btn:hover {
  background-color: #5a6268; /* Slightly darker on hover */
  transform: translateY(2px);
  box-shadow:
    0 3px 0 #495057,
    inset 0 1px 1px rgba(255, 255, 255, 0.1),
    inset 0 -2px 3px rgba(0, 0, 0, 0.2);
}

.option-btn:active {
  transform: translateY(5px);
  box-shadow:
    0 0 0 #495057,
    inset 0 1px 1px rgba(255, 255, 255, 0.05),
    inset 0 -1px 2px rgba(0, 0, 0, 0.2);
}
</style>
