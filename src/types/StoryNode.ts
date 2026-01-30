import charactersData from "@/data/characters.json";

// 比较操作符
export type CompareOp = "eq" | "ne" | "gt" | "lt" | "gte" | "lte";

// 从 JSON 提取角色 ID 类型
type CharacterList = typeof charactersData.characters;
type CharacterId = CharacterList[number]["id"];

// 可用于条件判断的字段类型 (角色好感度 + reputation)
export type ConditionField = CharacterId | "reputation" | "hasReported";

// 基础条件：单个字段比较
export interface BaseCondition {
  field: ConditionField;
  op: CompareOp;
  value: number;
}

// 组合条件：and/or
export interface CompositeCondition {
  op: "and" | "or";
  conds: Condition[];
}

// 条件类型：基础条件或组合条件
export type Condition = BaseCondition | CompositeCondition;

// 条件分支
export interface ConditionBranch {
  cond?: Condition; // 条件（可选，无条件时为默认分支）
  nextNode: string; // 满足条件时跳转的节点
}

export interface StoryOption {
  id: string; // 选项ID
  text: string; // 选项文本
  effect?: {
    // 属性变化效果
    ghost?: number;
    konig?: number;
    reputation?: number;
    hasReported?: number;
    resetGame?: boolean; // 重置游戏状态
  };
  record?: string; // 选择记录key
  nextNode?: string; // 下一个节点ID (当有branches时可选)
  branches?: ConditionBranch[]; // 条件分支（按顺序匹配，最后一个无cond的为默认）
  visibilityCondition?: BaseCondition; // 选项显示条件
}

export interface StoryNode {
  id: string; // 节点ID
  text: string; // 剧情文本(支持占位符，支持\n换行)
  options: StoryOption[]; // 选项列表
  background?: string; // path to image
  video?: string;      // path to video
}

export interface StoryNodesData {
  [nodeId: string]: StoryNode;
}
