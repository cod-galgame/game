import { useGameStateStore } from "@/stores/gameState";
import { useStoryEngineStore } from "@/stores/storyEngine";
import { matchDialog } from "./dialogMatcher";
import type { CharacterState } from "@/types/Character";

/**
 * 渲染剧情文本模板
 */
export function renderStoryText(template: string): string {
  const gameState = useGameStateStore();
  const storyEngine = useStoryEngineStore();

  let rendered = template;

  // 1. 替换对话变量 {{character.dialogType}} (先处理双括号，避免干扰)
  rendered = rendered.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const [charId, dialogType] = key.split(".");
    const dialogs = storyEngine.dialogs[charId]?.[dialogType];
    if (!dialogs) return match;

    // NPC对话不依赖好感度，使用默认值0；角色对话使用实际好感度
    const favorability =
      charId === "npc"
        ? 0
        : (gameState.favorability[charId as keyof CharacterState] ?? 0);
    const dialogText = matchDialog(dialogs, favorability);

    // 递归处理对话文本中可能包含的 {$username}
    return dialogText.replace(/\{\$username\}/g, gameState.username);
  });

  // 2. 替换用户名占位符 {$username} (处理剩余的)
  rendered = rendered.replace(/\{\$username\}/g, gameState.username);

  return rendered;
}
