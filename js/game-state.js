// 全局游戏状态（含新增的声誉值）
const gameState = {
  username: "",
  favorability: { // 好感度
    ghost: 0,
    konig: 0
  },
  reputation: 0,  // 新增：诊所声誉值
  currentNodeId: "ghost_0_start", // 当前剧情节点ID
  choiceRecords: {} // 选择记录
};

// 全局用户名变量
let currentUsername = "";

// 状态更新工具函数（更新UI显示）
function updateStatusUI() {
  document.getElementById("ghostFavor").textContent = gameState.favorability.ghost;
  document.getElementById("konigFavor").textContent = gameState.favorability.konig;
  document.getElementById("clinicRep").textContent = gameState.reputation;
}