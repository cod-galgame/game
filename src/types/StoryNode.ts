export interface StoryOption {
  id: string;                    // 选项ID
  text: string;                  // 选项文本
  effect?: {                     // 属性变化效果
    ghost?: number;
    konig?: number;
    reputation?: number;
    resetGame?: boolean;         // 重置游戏状态
  };
  record?: string;               // 选择记录key
  nextNode: string;              // 下一个节点ID
  condition?: {                  // 条件判断(用于动态跳转)
    type: 'reputation' | 'favorability';
    character?: string;
    thresholds: {
      value: number;
      nextNode: string;
    }[];
  };
  visibilityCondition?: {        // 选项显示条件
    type: 'favorability' | 'reputation';
    character?: string;          // 当type为favorability时必须指定
    minValue?: number;           // 最小值
    maxValue?: number;           // 最大值
  };
}

export interface StoryNode {
  id: string;                    // 节点ID
  text: string;                  // 剧情文本(支持占位符，支持\n换行)
  options: StoryOption[];        // 选项列表
}

export interface StoryNodesData {
  [nodeId: string]: StoryNode;
}
