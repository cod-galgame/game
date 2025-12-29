<template>
  <div class="username-container">
    <div class="username-card">
      <h2 class="username-title">欢迎来到战地诊所，医生</h2>
      <input
        v-model="username"
        type="text"
        class="username-input"
        placeholder="请输入你的用户名"
        maxlength="20"
        @keyup.enter="submitUsername"
      />
      <p v-if="error" class="error-message">{{ error }}</p>
      <button class="submit-btn" @click="submitUsername">开始游戏</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  submit: [username: string];
}>();

const username = ref("");
const error = ref("");

function submitUsername() {
  const trimmed = username.value.trim();

  if (!trimmed) {
    error.value = "请输入用户名";
    return;
  }

  if (trimmed.length < 2) {
    error.value = "用户名至少2个字符";
    return;
  }

  error.value = "";
  emit("submit", trimmed);
}
</script>

<style scoped>
.username-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: url("/assets/pic/default.jpg") center/cover;
  position: relative;
}

.username-container::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.username-card {
  position: relative;
  z-index: 1;
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.username-title {
  font-size: 24px;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #d790c4, #dbb8d2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.username-input {
  width: 100%;
  padding: 15px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  margin-bottom: 10px;
  transition: border-color 0.3s;
}

.username-input:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  color: #f44336;
  font-size: 14px;
  margin-bottom: 10px;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  font-size: 18px;
  background: linear-gradient(135deg, #cd9bc3 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s;
}

.submit-btn:hover {
  transform: translateY(-2px);
}

.submit-btn:active {
  transform: translateY(0);
}
</style>
