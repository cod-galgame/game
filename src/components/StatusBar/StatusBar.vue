<template>
  <div class="status-bar">
    <div class="status-item">
      <span class="status-label"
        ><i class="iconfont icon-yiyuan" />请开始你的救治之旅，{{
          gameState.username
        }}医生</span
      >
    </div>
    <!-- <div class="status-item">
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
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useGameStateStore } from "@/stores/gameState";

const gameState = useGameStateStore();
</script>

<style scoped>
.status-bar {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background: linear-gradient(to right, #d790c4, #a24b8b);
  color: white;
  font-size: 14px;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.status-label {
  font-size: 1rem;
  opacity: 1;
  margin-bottom: 2px;
  text-shadow:
    0 0 4px rgba(255, 230, 153, 0.7),
    /* Pale Gold Inner */ 0 0 8px rgba(255, 215, 0, 0.5),
    /* Gold Mid */ 0 0 14px rgba(255, 215, 0, 0.3); /* Gold Outer */
  animation: heartbeat-glow 1.5s infinite ease-in-out;
}

.status-value {
  font-size: 16px;
  font-weight: bold;
}

@keyframes heartbeat-glow {
  0%,
  100% {
    text-shadow:
      0 0 4px rgba(255, 230, 153, 0.7),
      0 0 8px rgba(255, 215, 0, 0.5),
      0 0 14px rgba(255, 215, 0, 0.3);
  }
  50% {
    text-shadow:
      0 0 8px rgba(255, 230, 153, 0.9),
      0 0 16px rgba(255, 215, 0, 0.7),
      0 0 24px rgba(255, 215, 0, 0.5);
  }
}
</style>
