<template>
  <div class="story-text">
    <p v-for="(paragraph, index) in paragraphs" :key="index">
      {{ paragraph }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStateStore } from '@/stores/gameState';
import { useStoryEngineStore } from '@/stores/storyEngine';
import { renderStoryText } from '@/utils/templateRenderer';

const gameState = useGameStateStore();
const storyEngine = useStoryEngineStore();

const paragraphs = computed(() => {
  const node = storyEngine.getCurrentNode(gameState.currentNodeId);
  if (!node) return [];

  const rendered = renderStoryText(node.text);
  // 按换行符分割成段落数组
  return rendered.split('\n').filter(p => p.trim());
});
</script>

<style scoped>
.story-text {
  padding: 20px;
  line-height: 1.8;
  font-size: 16px;
  color: #1a1a1a;
  background: rgba(255, 255, 255, 0.85);
  text-align: left;
  margin: auto 20px;
  border-radius: 10px;
}

.story-text p {
  margin-bottom: 1em;
}

.story-text p:last-child {
  margin-bottom: 0;
}
</style>
