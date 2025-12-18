export interface Character {
  id: string;              // 角色ID: 'ghost' | 'konig'
  name: string;            // 角色名称
  initialFavorability: number;  // 初始好感度
}

export interface CharacterState {
  ghost: number;           // Ghost 好感度
  konig: number;           // König 好感度
}
