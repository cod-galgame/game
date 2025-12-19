/**
 * Vite plugin to encrypt JSON data at build time
 * Replaces JSON imports with encrypted versions that are decrypted at runtime
 */

import type { Plugin } from 'vite';
import * as fs from 'fs';
import * as path from 'path';

const OBFUSCATION_KEY = 'P1XY_G4M3_2024_K3Y';

function xorCipher(input: string, key: string): string {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    result += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

function encodeData(jsonString: string): string {
  const xored = xorCipher(jsonString, OBFUSCATION_KEY);
  const base64 = Buffer.from(xored, 'utf-8').toString('base64');
  return base64.split('').reverse().join('');
}

export function encryptJsonPlugin(): Plugin {
  const targetFiles = [
    '/src/data/characters.json',
    '/src/data/dialogs.json',
    '/src/data/story-nodes.json'
  ];

  // Use .enc extension to avoid vite:json plugin
  const VIRTUAL_PREFIX = '\0encrypted:';
  const VIRTUAL_SUFFIX = '.enc';

  return {
    name: 'vite-plugin-encrypt-json',
    enforce: 'pre',

    // Redirect target JSON files to virtual modules
    resolveId(source, importer) {
      if (!importer) return null;

      // Check if this is an import of our target files
      const normalizedSource = source.replace(/\\/g, '/');

      for (const target of targetFiles) {
        if (normalizedSource.endsWith(target) || normalizedSource.includes(target)) {
          // Resolve the actual file path
          const resolvedPath = path.resolve(path.dirname(importer), source);
          const normalizedResolved = resolvedPath.replace(/\\/g, '/');

          if (targetFiles.some(f => normalizedResolved.endsWith(f))) {
            // Use .enc suffix to avoid json plugin
            return VIRTUAL_PREFIX + normalizedResolved + VIRTUAL_SUFFIX;
          }
        }
      }

      return null;
    },

    // Load the virtual module with encrypted content
    load(id) {
      if (!id.startsWith(VIRTUAL_PREFIX) || !id.endsWith(VIRTUAL_SUFFIX)) {
        return null;
      }

      // Remove prefix and suffix to get actual path
      const actualPath = id.slice(VIRTUAL_PREFIX.length, -VIRTUAL_SUFFIX.length);

      // Read the JSON file
      const jsonContent = fs.readFileSync(actualPath, 'utf-8');
      const encrypted = encodeData(jsonContent);

      // Return code that decrypts at runtime
      const transformedCode = `
const OBFUSCATION_KEY = 'P1XY_G4M3_2024_K3Y';

function xorCipher(input, key) {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    result += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

function decodeData(encoded) {
  const base64 = encoded.split('').reverse().join('');
  const xored = decodeURIComponent(escape(atob(base64)));
  return JSON.parse(xorCipher(xored, OBFUSCATION_KEY));
}

const encryptedData = "${encrypted}";
export default decodeData(encryptedData);
`;

      return {
        code: transformedCode,
        map: null
      };
    }
  };
}
