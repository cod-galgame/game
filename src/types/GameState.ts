import type { CharacterState } from "./Character";

export interface GameState {
  username: string; // 玩家用户名
  favorability: CharacterState; // 角色好感度
  reputation: number; // 诊所声誉
  currentNodeId: string; // 当前剧情节点
  choiceRecords: Record<string, string>; // 选择记录
}
