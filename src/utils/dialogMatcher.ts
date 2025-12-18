import type { DialogCondition } from '@/types/Dialog';

/**
 * 根据好感度匹配对话文本
 */
export function matchDialog(
  dialogs: DialogCondition[],
  favorability: number
): string {
  const matched = dialogs.find(
    d => favorability >= d.min && favorability <= d.max
  );
  return matched?.text || '';
}
