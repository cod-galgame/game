// src/utils/conditionEvaluator.ts
import type { GameState } from "@/types/GameState";
import type { Condition, CompareOp } from "@/types/StoryNode";

// 获取字段值
function getFieldValue(field: string, gameState: GameState): number {
  if (field === "reputation") {
    return gameState.reputation;
  }
  // 其他字段视为角色好感度
  return (
    gameState.favorability[field as keyof typeof gameState.favorability] || 0
  );
}

// 比较操作
function compare(left: number, op: CompareOp, right: number): boolean {
  switch (op) {
    case "eq":
      return left === right;
    case "ne":
      return left !== right;
    case "gt":
      return left > right;
    case "lt":
      return left < right;
    case "gte":
      return left >= right;
    case "lte":
      return left <= right;
    default:
      return false;
  }
}

// 评估条件
export function evaluateCondition(cond: Condition, gameState: GameState): boolean {
  if ("field" in cond) {
    // 基础条件
    const value = getFieldValue(cond.field, gameState);
    return compare(value, cond.op, cond.value);
  } else {
    // 组合条件
    if (cond.op === "and") {
      return cond.conds.every((c) => evaluateCondition(c, gameState));
    } else {
      return cond.conds.some((c) => evaluateCondition(c, gameState));
    }
  }
}
