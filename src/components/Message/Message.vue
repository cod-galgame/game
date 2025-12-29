<template>
  <Transition name="message-fade">
    <div v-if="visible" class="message" :class="`message-${type}`">
      <span class="message-icon">{{ icon }}</span>
      <span class="message-content">{{ content }}</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { MessageProps } from "@/types/Message";

const props = withDefaults(defineProps<MessageProps>(), {
  type: "info",
  duration: 3000,
});

const emit = defineEmits<{
  close: [];
}>();

const visible = ref(false);

const iconMap = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
};

const icon = iconMap[props.type];

onMounted(() => {
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
    setTimeout(() => {
      emit("close");
    }, 300); // 等待动画完成
  }, props.duration);
});
</script>

<style scoped>
.message {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  margin-bottom: 12px;
}

.message-success {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
}

.message-error {
  background: #fff2f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
}

.message-info {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #1890ff;
}

.message-warning {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  color: #faad14;
}

.message-icon {
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.message-content {
  color: #333;
}

.message-fade-enter-active,
.message-fade-leave-active {
  transition: all 0.3s ease;
}

.message-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.message-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
