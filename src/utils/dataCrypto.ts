/**
 * Simple obfuscation for story data
 * Uses XOR cipher with a key + Base64 encoding
 * This is NOT cryptographically secure, just makes casual inspection harder
 */

// Key for XOR - can be changed but must match between encrypt and decrypt
const OBFUSCATION_KEY = 'P1XY_G4M3_2024_K3Y';

function xorCipher(input: string, key: string): string {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    result += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

/**
 * Encode string to obfuscated format
 * Used at build time by vite plugin
 */
export function encodeData(jsonString: string): string {
  // XOR cipher
  const xored = xorCipher(jsonString, OBFUSCATION_KEY);
  // Convert to Base64
  const base64 = btoa(unescape(encodeURIComponent(xored)));
  // Reverse the string for additional obfuscation
  return base64.split('').reverse().join('');
}

/**
 * Decode obfuscated string back to original JSON
 * Used at runtime
 */
export function decodeData<T>(encoded: string): T {
  // Reverse the string
  const base64 = encoded.split('').reverse().join('');
  // Decode Base64
  const xored = decodeURIComponent(escape(atob(base64)));
  // XOR cipher to get original
  const original = xorCipher(xored, OBFUSCATION_KEY);
  return JSON.parse(original);
}
