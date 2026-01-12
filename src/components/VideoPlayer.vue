<template>
  <div class="video-player-overlay" @click.self="close">
    <div class="video-container">
      <video ref="video" :src="src" controls autoplay @ended="close"></video>
      <button class="close-button" @click="close">&times;</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  src: string;
}>();

const emit = defineEmits(['closed']);

const video = ref<HTMLVideoElement | null>(null);

onMounted(() => {
  video.value?.focus();
});

function close() {
  emit('closed');
}
</script>

<style scoped>
.video-player-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.video-container {
  position: relative;
  width: 90%;
  max-width: 800px;
}

video {
  width: 100%;
}

.close-button {
  position: absolute;
  top: -30px;
  right: -30px;
  background: none;
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
}
</style>
