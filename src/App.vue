<template>
  <div class="app-container">
    <div class="game-content">
      <GameView />
    </div>
    <MessageContainer ref="messageContainerRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import GameView from '@/views/GameView.vue';
import MessageContainer from '@/components/Message/MessageContainer.vue';
import { setMessageContainer } from '@/utils/message';

const messageContainerRef = ref();

onMounted(() => {
  if (messageContainerRef.value) {
    setMessageContainer(messageContainerRef.value);
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  width: 100%;
  height: 100%;
}
</style>

<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.game-content {
  width: 100%;
  max-width: 600px;
  aspect-ratio: 3 / 4;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

@media (max-width: 600px) {
  .game-content {
    width: 100%;
    height: 100%;
    border-radius: 0;
    aspect-ratio: unset;
  }
}
</style>
