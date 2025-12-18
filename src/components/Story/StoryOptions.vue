<template>
  <div class="story-options">
    <button
      v-for="option in options"
      :key="option.id"
      class="option-btn"
      @click="handleOptionClick(option)"
    >
      {{ option.text }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStateStore } from '@/stores/gameState';
import { useStoryEngineStore } from '@/stores/storyEngine';
import type { StoryOption } from '@/types/StoryNode';
import type { CharacterState } from '@/types/Character';

const gameState = useGameStateStore();
const storyEngine = useStoryEngineStore();

const options = computed(() => {
  const node = storyEngine.getCurrentNode(gameState.currentNodeId);
  const allOptions = node?.options || [];

  // 过滤掉不满足显示条件的选项
  return allOptions.filter(option => {
    if (!option.visibilityCondition) return true;

    const condition = option.visibilityCondition;
    let currentValue: number;

    if (condition.type === 'favorability') {
      if (!condition.character) return true;
      currentValue = gameState.favorability[condition.character as keyof CharacterState] || 0;
    } else {
      currentValue = gameState.reputation;
    }

    // 检查最小值和最大值
    if (condition.minValue !== undefined && currentValue < condition.minValue) {
      return false;
    }
    if (condition.maxValue !== undefined && currentValue > condition.maxValue) {
      return false;
    }

    return true;
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
    const recordKey = option.record.split('_')[0];
    gameState.recordChoice(recordKey, option.record);
  }

  // 3. 应用效果
  if (option.effect) {
    if (option.effect.ghost) {
      gameState.updateFavorability('ghost', option.effect.ghost);
    }
    if (option.effect.konig) {
      gameState.updateFavorability('konig', option.effect.konig);
    }
    if (option.effect.reputation) {
      gameState.updateReputation(option.effect.reputation);
    }
  }

  // 4. 处理动态跳转
  let nextNodeId = option.nextNode;
  if (option.condition) {
    nextNodeId = resolveConditionalNode(option.condition);
  }

  // 5. 跳转到下一节点
  gameState.setCurrentNode(nextNodeId);
}

function resolveConditionalNode(condition: StoryOption['condition']): string {
  if (!condition) return '';

  const value = condition.type === 'reputation'
    ? gameState.reputation
    : gameState.favorability[condition.character as keyof CharacterState] || 0;

  // 按阈值从高到低匹配
  const sorted = [...condition.thresholds].sort((a, b) => b.value - a.value);
  for (const threshold of sorted) {
    if (value >= threshold.value) {
      return threshold.nextNode;
    }
  }
  return condition.thresholds[condition.thresholds.length - 1].nextNode;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  text-align: left;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.option-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.8);
}

.option-btn:active {
  transform: translateY(0);
}
</style>
