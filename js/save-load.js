// 编解码核心函数（Base64）
/**
 * 编码函数：将JSON对象转为Base64字符串（解决中文乱码）
 * @param {object} data - 要编码的对象
 * @returns {string} Base64编码字符串
 */
function encodeData(data) {
  try {
    const jsonStr = JSON.stringify(data);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    const base64Str = btoa(String.fromCharCode(...utf8Bytes));
    return base64Str;
  } catch (err) {
    console.error("编码失败：", err);
    return "";
  }
}

/**
 * 解码函数：将Base64字符串转回JSON对象
 * @param {string} base64Str - Base64编码字符串
 * @returns {object|null} 解码后的对象，失败返回null
 */
function decodeData(base64Str) {
  try {
    const utf8Bytes = new Uint8Array(atob(base64Str).split('').map(char => char.charCodeAt(0)));
    const jsonStr = new TextDecoder().decode(utf8Bytes);
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("解码失败：", err);
    return null;
  }
}

// 存档函数
function saveGame() {
  const currentUsername = window.gameGlobal.currentUsername;
  if (!currentUsername) {
    alert("请先输入用户名～");
    return;
  }
  // 更新游戏状态中的用户名
  gameState.username = currentUsername;
  // 存入本地存储
  localStorage.setItem(`battleClinic_${currentUsername}`, JSON.stringify(gameState));
  alert(`存档成功！用户名：${currentUsername}\n（可点击「导出编码」保存字符串）`);
}

// 读档函数
function loadGame(username) {
  const saveData = localStorage.getItem(`battleClinic_${username}`);
  if (!saveData) {
    alert(`未找到${username}的本地存档😭\n可尝试「导入编码」恢复存档`);
    return false;
  }
  // 解析存档数据
  const loadedState = JSON.parse(saveData);
  window.gameGlobal.currentUsername = username;
  window.gameGlobal.gameState = loadedState;
  gameState.favorability = loadedState.favorability;
  gameState.reputation = loadedState.reputation; // 恢复声誉值
  gameState.currentNodeId = loadedState.currentNodeId;
  gameState.choiceRecords = loadedState.choiceRecords;
  // 更新全局用户名
  currentUsername = username;
  // 更新UI状态显示
  updateStatusUI();
  alert(`读档成功！欢迎回来，${username}～`);
  return true;
}

// 导出存档编码
function exportSaveCode() {
  if (!currentUsername) {
    alert("请先输入用户名并存档！");
    return;
  }
  const saveData = localStorage.getItem(`battleClinic_${currentUsername}`);
  if (!saveData) {
    alert("暂无本地存档可导出！请先点击「存档」");
    return;
  }
  const encodedStr = encodeData(JSON.parse(saveData));
  if (!encodedStr) {
    alert("存档编码失败！");
    return;
  }
  // 填充到导出弹窗
  document.getElementById("exportCodeInput").value = encodedStr;
  document.getElementById("exportModal").style.display = 'flex';
  document.getElementById("exportCopyTip").textContent = "";
}

// 导入存档编码
function importSaveCode() {
  const encodedStr = document.getElementById("importCodeInput").value.trim();
  if (!encodedStr) {
    alert("请粘贴存档编码！");
    return;
  }
  const decodedData = decodeData(encodedStr);
  if (!decodedData || !decodedData.username) {
    alert("存档编码无效或格式错误！");
    document.getElementById("importCodeInput").value = "";
    return;
  }
  // 存入本地存储
  currentUsername = decodedData.username;
  localStorage.setItem(`battleClinic_${currentUsername}`, JSON.stringify(decodedData));
  // 加载存档并更新UI
  loadGame(currentUsername);
  updateStory(gameState.currentNodeId);
  bindOptionEvents();
  // 关闭弹窗
  document.getElementById("importModal").style.display = 'none';
  document.getElementById("importCodeInput").value = "";
  alert(`编码导入成功！\n用户名：${decodedData.username}\n当前剧情节点：${decodedData.currentNodeId}`);
}