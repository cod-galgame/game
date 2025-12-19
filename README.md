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

# TypeScript 类型检查
pnpm exec tsc --noEmit
```

## CI/CD 流水线

项目使用 GitLab CI/CD 进行自动化构建和检查：

### 流水线阶段

1. **install** - 安装依赖
   - 使用 pnpm 安装所有依赖
   - 缓存 node_modules 提高后续构建速度

2. **check** - 代码检查
   - TypeScript 类型检查 (`tsc --noEmit`)

3. **build** - 构建检查
   - 构建生产版本
   - 验证构建产物

### 触发条件

流水线会在以下情况自动运行：
- 推送到 `main` 分支
- 创建 Merge Request
- 创建标签 (Tags)

配置文件: `.gitlab-ci.yml`

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

## 剧情编写 SOP

### 快速开始

添加一段新剧情只需 3 步：

1. **添加对话模板** → `src/data/dialogs.json`
2. **创建剧情节点** → `src/data/story-nodes.json`
3. **运行类型检查** → `pnpm check`

---

### Step 1: 添加对话模板

编辑 `src/data/dialogs.json`，为角色添加根据好感度变化的对话：

```json
{
  "ghost": {
    "morningGreeting": [
      { "min": 0, "max": 19, "text": "Ghost 冷淡地点了点头。" },
      { "min": 20, "max": 49, "text": "\"早，{$username}。\"Ghost 递过一杯咖啡。" },
      { "min": 50, "max": 100, "text": "\"你来了。\"Ghost 嘴角微微上扬，\"给你留了早餐。\"" }
    ]
  }
}
```

**要点：**
- `min`/`max` 定义好感度区间，系统匹配第一个符合的区间
- 区间建议按从低到高排序
- 可使用 `{$username}` 插入玩家名

---

### Step 2: 创建剧情节点

编辑 `src/data/story-nodes.json`：

#### 纯文本节点（点击继续）

```json
{
  "day2_morning_intro": {
    "id": "day2_morning_intro",
    "text": "第二天清晨，阳光透过诊所的窗户洒进来。\n{{ghost.morningGreeting}}",
    "options": [
      {
        "id": "continue",
        "text": "点击继续",
        "nextNode": "day2_morning_clinic"
      }
    ]
  }
}
```

#### 选择节点（玩家决策）

```json
{
  "day2_morning_clinic": {
    "id": "day2_morning_clinic",
    "text": "Ghost 看着你，似乎有话要说。\n\"关于昨晚的事...\"",
    "options": [
      {
        "id": "A",
        "text": "A：\"发生什么了？\"（关心地询问）",
        "effect": { "ghost": 5 },
        "record": "day2_morning_clinic_A",
        "nextNode": "day2_ghost_opens_up"
      },
      {
        "id": "B",
        "text": "B：\"先处理病人吧\"（暂时回避）",
        "effect": { "reputation": 5 },
        "record": "day2_morning_clinic_B",
        "nextNode": "day2_treat_patient"
      }
    ]
  }
}
```

---

### Step 3: 条件分支（高级）

使用 `branches` 实现根据游戏状态的动态跳转：

#### 单条件分支

```json
{
  "id": "surgery",
  "text": "立即准备手术",
  "effect": {},
  "branches": [
    { "cond": { "field": "reputation", "op": "gte", "value": 70 }, "nextNode": "surgery_success" },
    { "cond": { "field": "reputation", "op": "gte", "value": 50 }, "nextNode": "surgery_partial" },
    { "nextNode": "surgery_fail" }
  ]
}
```

#### 多条件组合（AND/OR）

```json
{
  "id": "view_ending",
  "text": "查看结局",
  "branches": [
    {
      "cond": {
        "op": "and",
        "conds": [
          { "field": "ghost", "op": "gte", "value": 40 },
          { "field": "konig", "op": "gte", "value": 25 }
        ]
      },
      "nextNode": "perfect_ending"
    },
    { "cond": { "field": "ghost", "op": "gte", "value": 30 }, "nextNode": "ghost_ending" },
    { "cond": { "field": "konig", "op": "gte", "value": 20 }, "nextNode": "konig_ending" },
    { "nextNode": "normal_ending" }
  ]
}
```

#### 条件操作符

| 操作符 | 含义 | 示例 |
|--------|------|------|
| `eq` | 等于 | `{ "field": "ghost", "op": "eq", "value": 50 }` |
| `ne` | 不等于 | `{ "field": "reputation", "op": "ne", "value": 0 }` |
| `gt` | 大于 | `{ "field": "ghost", "op": "gt", "value": 30 }` |
| `lt` | 小于 | `{ "field": "reputation", "op": "lt", "value": 50 }` |
| `gte` | 大于等于 | `{ "field": "konig", "op": "gte", "value": 20 }` |
| `lte` | 小于等于 | `{ "field": "ghost", "op": "lte", "value": 10 }` |

#### 可用字段

- `ghost` - Ghost 好感度
- `konig` - König 好感度
- `reputation` - 诊所声誉

> 字段类型从 `characters.json` 自动派生，添加新角色后自动可用。

---

### Step 4: 选项显示条件（可选）

使用 `visibilityCondition` 控制选项是否显示：

```json
{
  "id": "secret_option",
  "text": "（需要高声誉）请求支援",
  "visibilityCondition": { "field": "reputation", "op": "gte", "value": 80 },
  "nextNode": "call_backup"
}
```

---

### 命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 节点 ID | `day{N}_{时段}_{场景}_{描述}` | `day3_morning_clinic_ghost_visit` |
| 选项记录 | `{节点ID}_{选项ID}` | `day3_morning_clinic_ghost_visit_A` |
| 对话类型 | `camelCase` 动词/形容词 | `morningGreeting`, `criticalInjury` |

---

### 检查清单

添加新剧情后，确认以下事项：

- [ ] `dialogs.json` 中的对话模板好感度区间覆盖 0-100
- [ ] `story-nodes.json` 中节点 ID 与 `id` 字段一致
- [ ] 所有 `nextNode` 指向存在的节点
- [ ] `branches` 最后一项为无条件默认分支
- [ ] 运行 `pnpm check` 通过类型检查

---

## 数据格式参考

### 占位符

| 占位符 | 说明 | 示例 |
|--------|------|------|
| `{$username}` | 玩家用户名 | `"欢迎回来，{$username}"` |
| `{{character.dialogType}}` | 动态对话 | `"{{ghost.morningGreeting}}"` |

### 效果系统

选项的 `effect` 字段：

```json
{
  "ghost": 5,        // Ghost 好感度 +5
  "konig": -3,       // König 好感度 -3
  "reputation": 10,  // 诊所声誉 +10
  "resetGame": true  // 重置游戏（用于"重新开始"）
}

## 存档系统

- 自动保存到 LocalStorage
- 存档键名: `battleClinic_v2_{username}`
- 支持导出/导入 Base64 存档

## 浏览器兼容性

支持所有现代浏览器 (Chrome, Firefox, Safari, Edge)。

## License

ISC
