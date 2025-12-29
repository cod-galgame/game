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
import type { StoryOption, Condition, CompareOp } from "@/types/StoryNode";

const gameState = useGameStateStore();
const storyEngine = useStoryEngineStore();

// 获取字段值
function getFieldValue(field: string): number {
  if (field === "reputation") {
    return gameState.reputation;
  }
  // 其他字段视为角色好感度
  return (
    gameState.favorability[field as keyof typeof gameState.favorability] || 0
  );
}

// 比较操作
function compare(left: number, op: CompareOp, right: number): boolean {
  switch (op) {
    case "eq":
      return left === right;
    case "ne":
      return left !== right;
    case "gt":
      return left > right;
    case "lt":
      return left < right;
    case "gte":
      return left >= right;
    case "lte":
      return left <= right;
    default:
      return false;
  }
}

// 评估条件
function evaluateCondition(cond: Condition): boolean {
  if ("field" in cond) {
    // 基础条件
    const value = getFieldValue(cond.field);
    return compare(value, cond.op, cond.value);
  } else {
    // 组合条件
    if (cond.op === "and") {
      return cond.conds.every((c) => evaluateCondition(c));
    } else {
      return cond.conds.some((c) => evaluateCondition(c));
    }
  }
}

const options = computed(() => {
  const node = storyEngine.getCurrentNode(gameState.currentNodeId);
  const allOptions = node?.options || [];

  // 过滤掉不满足显示条件的选项
  return allOptions.filter((option) => {
    if (!option.visibilityCondition) return true;
    return evaluateCondition(option.visibilityCondition);
  });
});

function handleOptionClick(option: StoryOption) {
  // 1. 检查是否需要重置游戏
  if (option.effect?.resetGame) {
    const currentUsername = gameState.username;
    gameState.resetGame();
    gameState.setUsername(currentUsername);
    return;
  }

  // 2. 记录选择
  if (option.record) {
    const recordKey = option.record.split("_")[0];
    gameState.recordChoice(recordKey, option.record);
  }

  // 3. 应用效果
  if (option.effect) {
    if (option.effect.ghost) {
      gameState.updateFavorability("ghost", option.effect.ghost);
    }
    if (option.effect.konig) {
      gameState.updateFavorability("konig", option.effect.konig);
    }
    if (option.effect.reputation) {
      gameState.updateReputation(option.effect.reputation);
    }
  }

  // 4. 处理动态跳转
  let nextNodeId = option.nextNode;
  if (option.branches) {
    nextNodeId = resolveBranches(option.branches);
  }

  // 5. 跳转到下一节点
  if (nextNodeId) {
    gameState.setCurrentNode(nextNodeId);
  }
}

function resolveBranches(
  branches: StoryOption["branches"],
): string | undefined {
  if (!branches) return undefined;

  for (const branch of branches) {
    // 无条件分支为默认分支
    if (!branch.cond) {
      return branch.nextNode;
    }
    // 评估条件
    if (evaluateCondition(branch.cond)) {
      return branch.nextNode;
    }
  }
  return undefined;
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
