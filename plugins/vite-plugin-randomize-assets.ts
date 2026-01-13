/**
 * Vite plugin to randomize asset filenames in public directory at build time
 * Updates references in story-nodes.json automatically
 */

import type { Plugin } from 'vite';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

function generateRandomName(length = 16): string {
  return crypto.randomBytes(length).toString('hex');
}

export function randomizeAssetsPlugin(): Plugin {
  const assetDirs = ['pic', 'video'];
  const excludeFiles = ['default.jpg']; // Files referenced outside story-nodes.json
  const renameMap: Record<string, string> = {};
  let originalStoryContent: string = '';
  const storyNodesPath = path.resolve(process.cwd(), 'src/data/story-nodes.json');

  return {
    name: 'vite-plugin-randomize-assets',
    enforce: 'pre',
    apply: 'build',

    buildStart() {
      const publicDir = path.resolve(process.cwd(), 'public/assets');

      // Build rename map for all assets
      for (const dir of assetDirs) {
        const dirPath = path.join(publicDir, dir);
        if (!fs.existsSync(dirPath)) continue;

        const files = fs.readdirSync(dirPath);
        for (const file of files) {
          if (excludeFiles.includes(file)) continue;

          const ext = path.extname(file);
          const newName = `${generateRandomName()}${ext}`;
          const oldRelative = `/assets/${dir}/${file}`;
          const newRelative = `/assets/${dir}/${newName}`;

          renameMap[oldRelative] = newRelative;

          // Rename file in public directory
          const oldPath = path.join(dirPath, file);
          const newPath = path.join(dirPath, newName);
          fs.renameSync(oldPath, newPath);
        }
      }

      // Backup and update story-nodes.json
      originalStoryContent = fs.readFileSync(storyNodesPath, 'utf-8');
      let updatedContent = originalStoryContent;
      for (const [oldPath, newPath] of Object.entries(renameMap)) {
        updatedContent = updatedContent.replaceAll(oldPath, newPath);
      }
      fs.writeFileSync(storyNodesPath, updatedContent);

      console.log(`[randomize-assets] Renamed ${Object.keys(renameMap).length} files`);
    },

    // Restore original filenames and story-nodes.json after build
    closeBundle() {
      const publicDir = path.resolve(process.cwd(), 'public/assets');

      // Restore asset filenames
      for (const [oldPath, newPath] of Object.entries(renameMap)) {
        const dir = oldPath.includes('/pic/') ? 'pic' : 'video';
        const oldName = path.basename(oldPath);
        const newName = path.basename(newPath);

        const currentPath = path.join(publicDir, dir, newName);
        const originalPath = path.join(publicDir, dir, oldName);

        if (fs.existsSync(currentPath)) {
          fs.renameSync(currentPath, originalPath);
        }
      }

      // Restore story-nodes.json
      if (originalStoryContent) {
        fs.writeFileSync(storyNodesPath, originalStoryContent);
      }

      console.log(`[randomize-assets] Restored original files`);
    }
  };
}
