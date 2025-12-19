/**
 * Build-time script to encrypt JSON data files
 * Run this before build to generate encrypted versions
 */

import * as fs from 'fs';
import * as path from 'path';

// XOR key - must match dataCrypto.ts
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

const dataDir = path.resolve(__dirname, '../src/data');
const encryptedDir = path.resolve(__dirname, '../src/data/encrypted');

// Create encrypted directory if not exists
if (!fs.existsSync(encryptedDir)) {
  fs.mkdirSync(encryptedDir, { recursive: true });
}

const files = ['characters.json', 'dialogs.json', 'story-nodes.json'];

files.forEach(file => {
  const inputPath = path.join(dataDir, file);
  const outputPath = path.join(encryptedDir, file.replace('.json', '.enc.ts'));

  const content = fs.readFileSync(inputPath, 'utf-8');
  const encrypted = encodeData(content);

  // Generate TypeScript file with encrypted data
  const tsContent = `// Auto-generated encrypted data - DO NOT EDIT
export const encryptedData = "${encrypted}";
`;

  fs.writeFileSync(outputPath, tsContent);
  console.log(`Encrypted: ${file} -> ${path.basename(outputPath)}`);
});

console.log('Done!');
