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

    // NPC对话不依赖好感度，使用默认值0；
    // 当 charId 为 `reputation` 时，优先使用 gameState.reputation 作为好感度来源；
    // 其他角色则使用 favorability 表中的值
    let favorability = 0;
    if (charId === "npc") {
      favorability = 0;
    } else if (charId === "reputation") {
      favorability = gameState.reputation;
    } else {
      favorability = gameState.favorability[charId as keyof CharacterState] ?? 0;
    }

    const dialogText = matchDialog(dialogs, favorability);

    // 递归处理对话文本中可能包含的 {$username}
    return dialogText.replace(/\{\$username\}/g, gameState.username);
  });

  // 2. 替换用户名占位符 {$username} (处理剩余的)
  rendered = rendered.replace(/\{\$username\}/g, gameState.username);

  // 3. 替换常用数值占位符 {$ghost}、{$konig}、{$reputation}
  rendered = rendered.replace(/\{\$ghost\}/g, String(gameState.favorability.ghost ?? 0));
  rendered = rendered.replace(/\{\$konig\}/g, String(gameState.favorability.konig ?? 0));
  rendered = rendered.replace(/\{\$reputation\}/g, String(gameState.reputation ?? 0));

  return rendered;
}
