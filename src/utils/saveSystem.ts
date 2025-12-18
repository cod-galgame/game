import type { GameState } from '@/types/GameState';

const STORAGE_PREFIX = 'battleClinic_v2_slot_';

export interface SaveSlotData {
  gameState: GameState;
  savedAt: number;        // 保存时间戳
  previewText: string;    // 预览文本（最近的一行剧情）
}

/**
 * 保存游戏到指定槽位
 */
export function saveToSlot(slotIndex: number, state: GameState, previewText: string): void {
  const slotData: SaveSlotData = {
    gameState: state,
    savedAt: Date.now(),
    previewText
  };
  const key = STORAGE_PREFIX + slotIndex;
  localStorage.setItem(key, JSON.stringify(slotData));
}

/**
 * 从指定槽位加载游戏
 */
export function loadFromSlot(slotIndex: number): SaveSlotData | null {
  const key = STORAGE_PREFIX + slotIndex;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

/**
 * 获取所有槽位的存档信息
 */
export function getAllSlots(): (SaveSlotData | null)[] {
  const slots: (SaveSlotData | null)[] = [];
  for (let i = 1; i <= 9; i++) {
    slots.push(loadFromSlot(i));
  }
  return slots;
}

/**
 * 删除指定槽位的存档
 */
export function deleteSlot(slotIndex: number): void {
  const key = STORAGE_PREFIX + slotIndex;
  localStorage.removeItem(key);
}

/**
 * 导出存档为 Base64
 */
export function exportSave(state: GameState): string {
  const json = JSON.stringify(state);
  return btoa(encodeURIComponent(json));
}

/**
 * 从 Base64 导入存档
 */
export function importSave(base64: string): GameState {
  const json = decodeURIComponent(atob(base64));
  return JSON.parse(json);
}

/**
 * 获取所有存档列表
 */
export function getAllSaves(): string[] {
  const saves: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX)) {
      saves.push(key.replace(STORAGE_PREFIX, ''));
    }
  }
  return saves;
}
