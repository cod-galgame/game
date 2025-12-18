<template>
  <div class="save-load-overlay" @click="$emit('close')">
    <div class="save-load-dialog" @click.stop>
      <h2 class="dialog-title">{{ mode === 'save' ? '保存游戏' : '读取存档' }}</h2>

      <div class="slots-container">
        <div
          v-for="(slot, index) in slots"
          :key="index"
          class="slot-item"
          :class="{ empty: !slot, disabled: mode === 'load' && !slot }"
        >
          <div class="slot-header">
            <span class="slot-number">槽位 {{ index + 1 }}</span>
            <span v-if="slot" class="slot-time">{{ formatTime(slot.savedAt) }}</span>
          </div>

          <div class="slot-content">
            <div class="slot-preview">
              {{ slot ? slot.previewText : '空槽位' }}
            </div>

            <div class="slot-actions">
              <button
                v-if="mode === 'save'"
                class="action-btn save-btn"
                @click="handleSave(index + 1)"
              >
                保存
              </button>
              <button
                v-else-if="slot"
                class="action-btn load-btn"
                @click="handleLoad(index + 1)"
              >
                读取
              </button>
              <button
                v-if="slot"
                class="action-btn delete-btn"
                @click="handleDelete(index + 1)"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>

      <button class="close-btn" @click="$emit('close')">关闭</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useGameStateStore } from '@/stores/gameState';
import { useStoryEngineStore } from '@/stores/storyEngine';
import { getAllSlots, saveToSlot, loadFromSlot, deleteSlot, type SaveSlotData } from '@/utils/saveSystem';
import { renderStoryText } from '@/utils/templateRenderer';
import { Message } from '@/utils/message';

const props = defineProps<{
  mode: 'save' | 'load'
}>();

const emit = defineEmits<{
  close: []
  load: [slotIndex: number]
}>();

const gameState = useGameStateStore();
const storyEngine = useStoryEngineStore();
const slots = ref<(SaveSlotData | null)[]>([]);

onMounted(() => {
  loadSlots();
});

function loadSlots() {
  slots.value = getAllSlots();
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function getPreviewText(): string {
  const node = storyEngine.getCurrentNode(gameState.currentNodeId);
  if (!node) return '未知位置';

  const rendered = renderStoryText(node.text);
  const lines = rendered.split('\n').filter(p => p.trim());
  // 取最后一行作为预览
  return lines[lines.length - 1] || '未知位置';
}

function handleSave(slotIndex: number) {
  const previewText = getPreviewText();
  saveToSlot(slotIndex, gameState.$state, previewText);
  loadSlots();
  Message.success(`已保存到槽位 ${slotIndex}`);
}

function handleLoad(slotIndex: number) {
  const slotData = loadFromSlot(slotIndex);
  if (slotData) {
    gameState.loadGameState(slotData.gameState);
    emit('close');
    Message.success(`已读取槽位 ${slotIndex}`);
  }
}

function handleDelete(slotIndex: number) {
  if (confirm(`确定要删除槽位 ${slotIndex} 的存档吗？`)) {
    deleteSlot(slotIndex);
    loadSlots();
    Message.info(`已删除槽位 ${slotIndex} 的存档`);
  }
}
</script>

<style scoped>
.save-load-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.save-load-dialog {
  background: white;
  border-radius: 15px;
  width: 100%;
  max-width: 600px;
  height: 80vh;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dialog-title {
  font-size: 24px;
  font-weight: bold;
  padding: 20px;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.slots-container {
  flex: 1;
  overflow-y: auto;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.slot-item {
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 12px 15px;
  background: white;
  transition: all 0.2s;
}

.slot-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.slot-item.empty {
  background: #f5f5f5;
  border-style: dashed;
}

.slot-item.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.slot-item.disabled:hover {
  border-color: #e0e0e0;
  box-shadow: none;
}

.slot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.slot-number {
  font-weight: bold;
  color: #667eea;
  font-size: 16px;
}

.slot-time {
  font-size: 12px;
  color: #666;
}

.slot-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}

.slot-preview {
  flex: 1;
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.slot-item.empty .slot-preview {
  color: #999;
  font-style: italic;
}

.slot-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  white-space: nowrap;
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.load-btn {
  background: #4caf50;
  color: white;
}

.load-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.delete-btn {
  background: #f44336;
  color: white;
}

.delete-btn:hover {
  background: #da190b;
}

.close-btn {
  margin: 15px 20px;
  padding: 10px 24px;
  background: #999;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #777;
}

@media (max-width: 600px) {
  .save-load-dialog {
    max-width: 100%;
    border-radius: 0;
  }
}
</style>
