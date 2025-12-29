export interface DialogCondition {
  min: number; // 最小好感度
  max: number; // 最大好感度
  text: string; // 对话文本
}

export interface CharacterDialogs {
  [characterId: string]: {
    [dialogType: string]: DialogCondition[];
  };
}
