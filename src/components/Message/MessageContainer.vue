<template>
  <Teleport to="body">
    <div class="message-container">
      <Message
        v-for="msg in messages"
        :key="msg.id"
        :content="msg.content"
        :type="msg.type"
        :duration="msg.duration"
        @close="removeMessage(msg.id)"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Message, { type MessageProps } from "./Message.vue";

interface MessageItem extends MessageProps {
  id: number;
}

const messages = ref<MessageItem[]>([]);
let messageId = 0;

function addMessage(options: MessageProps) {
  const id = messageId++;
  messages.value.push({ ...options, id });
}

function removeMessage(id: number) {
  const index = messages.value.findIndex((msg) => msg.id === id);
  if (index > -1) {
    messages.value.splice(index, 1);
  }
}

defineExpose({
  addMessage,
});
</script>

<style scoped>
.message-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}
</style>
