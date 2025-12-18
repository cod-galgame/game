# 战地诊所：从 0 开始的 cod-galgame

基于 Vue 3 + Rspack + TypeScript 的文字冒险游戏。

## 技术栈

- **Vue 3** - 使用 Composition API
- **TypeScript** - 类型安全
- **Pinia** - 状态管理
- **Rspack** - 快速构建工具

## 项目特点

- ✅ 数据与逻辑完全分离 (JSON 数据文件)
- ✅ TypeScript 类型安全
- ✅ 模块化组件架构
- ✅ 响应式 3:4 竖版布局
- ✅ 好感度和声誉系统
- ✅ 本地存档系统

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式 (热更新)
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

## 项目结构

```
src/
├── components/          # Vue 组件
│   ├── Username/       # 用户名输入
│   ├── Story/          # 剧情展示
│   └── StatusBar/      # 状态栏
├── data/               # JSON 数据文件
│   ├── characters.json # 角色配置
│   ├── dialogs.json    # 对话文本
│   └── story-nodes.json # 剧情节点
├── stores/             # Pinia 状态管理
├── types/              # TypeScript 类型定义
├── utils/              # 工具函数
└── views/              # 页面视图
```

## 如何添加新剧情

### 1. 添加对话文本

编辑 `src/data/dialogs.json`:

```json
{
  "ghost": {
    "your_dialog_type": [
      { "min": 0, "max": 4, "text": "低好感度对话" },
      { "min": 5, "max": 100, "text": "高好感度对话，{$username}" }
    ]
  }
}
```

### 2. 添加剧情节点

编辑 `src/data/story-nodes.json`:

```json
{
  "your_node_id": {
    "id": "your_node_id",
    "text": "剧情文本\\n{{ghost.your_dialog_type}}",
    "options": [
      {
        "id": "option1",
        "text": "选项 1",
        "effect": { "ghost": 5, "reputation": 10 },
        "record": "your_node_id_option1",
        "nextNode": "next_node_id"
      }
    ]
  }
}
```

## 数据格式说明

### 占位符

- `{$username}` - 替换为玩家用户名
- `{{ghost.initial}}` - 替换为 Ghost 的 initial 对话 (根据好感度匹配)

### 好感度区间

对话会根据角色的当前好感度自动选择:

- 好感度 0-4: 使用 min=0, max=4 的对话
- 好感度 5-100: 使用 min=5, max=100 的对话

### 效果系统

选项的 `effect` 可以修改:

- `ghost`: Ghost 好感度变化
- `konig`: König 好感度变化
- `reputation`: 诊所声誉变化
- `resetGame`: 重置游戏状态 (用于"重新开始游戏"选项)

### 选项显示条件

可以为选项添加 `visibilityCondition` 来控制显示条件：

```json
{
  "id": "special_option",
  "text": "特殊选项 (需要 Ghost 好感度 ≥ 20)",
  "visibilityCondition": {
    "type": "favorability",
    "character": "ghost",
    "minValue": 20
  },
  "nextNode": "next_node"
}
```

**条件类型:**
- `type: "favorability"` - 根据角色好感度判断 (需指定 `character`)
- `type: "reputation"` - 根据诊所声誉判断

**值范围:**
- `minValue` - 最小值 (可选)
- `maxValue` - 最大值 (可选)

**示例:**
- 只有好感度 ≥ 20 才显示: `{ "type": "favorability", "character": "ghost", "minValue": 20 }`
- 只有声誉 < 50 才显示: `{ "type": "reputation", "maxValue": 49 }`
- 好感度在 10-30 范围才显示: `{ "type": "favorability", "character": "konig", "minValue": 10, "maxValue": 30 }`

## 存档系统

- 自动保存到 LocalStorage
- 存档键名: `battleClinic_v2_{username}`
- 支持导出/导入 Base64 存档

## 浏览器兼容性

支持所有现代浏览器 (Chrome, Firefox, Safari, Edge)。

## License

ISC
