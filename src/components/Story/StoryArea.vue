<template>
  <div class="story-area">
    <div class="top-bar">
      <StatusBar />
      <div class="save-buttons">
        <button class="save-btn" @click="$emit('save')">
          存档
          <i class="iconfont icon-baocun1" />
        </button>
        <button class="save-btn" @click="$emit('load')">
          读档
          <i style="font-size: 0.95em" class="iconfont icon-duqu" />
        </button>
      </div>
    </div>
    <div class="story-content">
      <StoryText />
      <StoryOptions />
    </div>
  </div>
</template>

<script setup lang="ts">
import StatusBar from "@/components/StatusBar/StatusBar.vue";
import StoryText from "./StoryText.vue";
import StoryOptions from "./StoryOptions.vue";

defineEmits(["save", "load"]);
</script>

<style scoped>
.story-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: url("/assets/pic/default.jpg") center/cover no-repeat;
}

.top-bar {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.save-buttons {
  display: flex;
  gap: 10px;
  padding: 10px 15px;
  background: rgba(0, 0, 0, 0.3);
}

.save-btn {
  flex: 1;
  padding: 8px;
  font-size: 14px;
  background: rgba(180, 131, 182, 0.8);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.save-btn:hover {
  background: rgb(218, 153, 223);
}

.story-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
}
</style>
