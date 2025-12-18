<template>
  <div class="status-bar">
    <div class="status-item">
      <span class="status-label">Ghost好感度:</span>
      <span class="status-value">{{ gameState.favorability.ghost }}</span>
    </div>
    <div class="status-item">
      <span class="status-label">König好感度:</span>
      <span class="status-value">{{ gameState.favorability.konig }}</span>
    </div>
    <div class="status-item">
      <span class="status-label">诊所声誉:</span>
      <span class="status-value">{{ gameState.reputation }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStateStore } from '@/stores/gameState';

const gameState = useGameStateStore();
</script>

<style scoped>
.status-bar {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
  font-size: 14px;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.status-label {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 2px;
}

.status-value {
  font-size: 16px;
  font-weight: bold;
}
</style>
