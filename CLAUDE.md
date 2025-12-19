# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A visual novel/text adventure game (Galgame) set in a battlefield clinic theme. Built with Vue 3 + Rspack + TypeScript, featuring a data-driven architecture where story content is completely separated from game logic.

## Build & Development Commands

```bash
# Development with hot-reload (opens browser at localhost:3000)
pnpm dev

# Production build (outputs to dist/)
pnpm build

# Preview production build
pnpm preview
```

Package manager: **pnpm only** (not npm or yarn)

## Core Architecture

### State Management Pattern

The game uses **two separate Pinia stores** that must work in tandem:

1. **`gameState` store** (`src/stores/gameState.ts`) - Runtime game state
   - Player username
   - Character favorability values (ghost, konig)
   - Clinic reputation score
   - Current story node ID
   - Player choice history

2. **`storyEngine` store** (`src/stores/storyEngine.ts`) - Static story data
   - Story node definitions (loaded from JSON)
   - Character dialog templates (loaded from JSON)
   - Provides `getCurrentNode()` getter for node lookup

**Critical**: These stores are tightly coupled. The template renderer (`src/utils/templateRenderer.ts`) requires both stores to be initialized before rendering.

### Template Rendering System

The game uses a custom template system with two placeholder types:

1. **`{$username}`** - Direct replacement with player's username
2. **`{{character.dialogType}}`** - Dynamic dialog lookup based on favorability

Example story text:
```
"{{ghost.initial}}" // Resolves to different dialog based on ghost's favorability
"Welcome, {$username}" // Replaced with player name
```

**Rendering pipeline**:
1. `StoryText.vue` triggers render via computed property
2. `templateRenderer.ts` processes placeholders:
   - Looks up character dialog from `storyEngine.dialogs`
   - Calls `dialogMatcher.ts` to find matching dialog based on favorability range
   - Replaces `{$username}` with `gameState.username`
3. Returns plain text (never HTML - security requirement)

### Favorability-Based Dialog System

Dialog selection uses **range-based matching** (`src/utils/dialogMatcher.ts`):

```json
{
  "ghost": {
    "initial": [
      { "min": 0, "max": 4, "text": "Cold greeting" },
      { "min": 5, "max": 100, "text": "Warm greeting" }
    ]
  }
}
```

The system finds the first dialog where `favorability >= min && favorability <= max`. **Order matters** - dialogs should be sorted by range.

### Story Node Flow

Story progression is handled in `StoryOptions.vue`:

1. Player clicks option button
2. **Execute effects** (modify favorability/reputation via `gameState` actions)
3. **Record choice** (stored in `choiceRecords` for branching logic)
4. **Resolve next node**:
   - If option has `condition`, evaluate thresholds (e.g., reputation >= 70)
   - Otherwise use `nextNode` directly
5. **Update current node** via `gameState.setCurrentNode()`

**Important**: Effects are applied BEFORE node transition. This ensures favorability changes affect the next node's dialog rendering.

### Data File Structure

All story content lives in `src/data/*.json`:

- **`characters.json`** - Character metadata (id, name, initial favorability)
- **`dialogs.json`** - Dialog templates organized by character and type
- **`story-nodes.json`** - Story nodes with text, options, effects, branching

### Story Node Types

The game supports two types of story nodes:

1. **Pure Text Nodes** (auto-advance):
   ```json
   {
     "id": "node_1",
     "text": "Single line of story text.",
     "nextNode": "node_2"
   }
   ```
   - Single line of text only
   - Player clicks to continue to `nextNode`
   - Shows "点击继续..." indicator
   - No `options` field

2. **Choice Nodes** (player decision):
   ```json
   {
     "id": "node_2",
     "text": "Question or situation text.",
     "options": [
       {
         "id": "optionA",
         "text": "A: First choice",
         "effect": { "ghost": 5 },
         "record": "node_2_A",
         "nextNode": "node_3"
       }
     ]
   }
   ```
   - Has `options` array
   - Player must select an option
   - No `nextNode` at root level

When adding new story content:
1. Add dialog templates to `dialogs.json` first
2. Reference them in `story-nodes.json` using `{{character.dialogType}}` syntax
3. Break multi-line text into separate nodes connected via `nextNode`
4. Use `effect` object for stat changes: `{ "ghost": 5, "reputation": 10 }`
5. Use `condition` object for branching: `{ "type": "reputation", "thresholds": [...] }`

### Save System

Saves use LocalStorage with key pattern: `battleClinic_v2_{username}`

**Critical functions** in `src/utils/saveSystem.ts`:
- `saveGame()` - Serializes entire `gameState` store
- `loadGame()` - Deserializes and returns GameState object
- `exportSave()` / `importSave()` - Base64 encoding for cross-device transfer

**Note**: The `v2_` prefix indicates save format version. Incompatible with old version saves.

## TypeScript Path Alias

`@/` resolves to `src/` (configured in both `tsconfig.json` and `rspack.config.js`).

Always use `@/` imports for consistency:
```typescript
import { useGameStateStore } from '@/stores/gameState';
import type { StoryNode } from '@/types/StoryNode';
```

## Component Architecture

```
GameView.vue (root orchestrator)
├── UsernameInput.vue (shown first)
└── StoryArea.vue (main game view)
    ├── StatusBar.vue (favorability/reputation display)
    ├── StoryText.vue (renders templated text)
    └── StoryOptions.vue (handles choice logic)
```

**Data flow**:
- Components read from Pinia stores via `computed` properties
- User actions trigger store actions (never direct state mutation)
- Store changes automatically trigger component re-renders

## Styling Approach

- **No UI framework** - custom CSS only
- **Scoped styles** in all `.vue` components
- **3:4 aspect ratio** layout (mobile-first design)
- **Gradient theme**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

Layout container in `App.vue` centers game content with max-width 600px on desktop, full-screen on mobile.

## Known Limitations

1. **Incomplete story data**: Only Day 1 content is converted to JSON. Full story content exists in `old_version/js/story-templates.js` (1034 lines) and needs manual migration.

2. **No save validation**: Loading corrupted saves will crash. Should add try-catch in `GameView.vue` load handler.

3. **No back button**: Players cannot undo choices. One-way story progression only.

## Migration Context

This codebase was migrated from vanilla JS. Old files are in `old_version/`:
- Original used global state via `window.gameGlobal`
- Original mixed data and logic in `story-templates.js`
- Original used inline `<br>` tags (now use `\n` for paragraphs)

When adding features, maintain the data/logic separation principle established in the migration.
