<template>
  <div class="game-view">
    <UsernameInput v-if="currentPage === 'username'" @submit="handleUsernameSubmit" />
    <StoryArea
      v-else-if="currentPage === 'story'"
      @save="showSaveDialog = true"
      @load="showLoadDialog = true"
    />

    <!-- 存档/读档弹窗 -->
    <SaveLoadDialog
      v-if="showSaveDialog"
      mode="save"
      @close="showSaveDialog = false"
    />
    <SaveLoadDialog
      v-if="showLoadDialog"
      mode="load"
      @close="showLoadDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UsernameInput from '@/components/Username/UsernameInput.vue';
import StoryArea from '@/components/Story/StoryArea.vue';
import SaveLoadDialog from '@/components/SaveLoad/SaveLoadDialog.vue';
import { useGameStateStore } from '@/stores/gameState';

const gameState = useGameStateStore();
const currentPage = ref<'username' | 'story'>('username');
const showSaveDialog = ref(false);
const showLoadDialog = ref(false);

function handleUsernameSubmit(username: string) {
  gameState.resetGame();
  gameState.setUsername(username);
  currentPage.value = 'story';
}
</script>

<style scoped>
.game-view {
  width: 100%;
  height: 100%;
}
</style>
