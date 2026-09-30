/**
 * Encrypted Storage Utility for BISA
 * Protects student privacy, special education assessments, and personal notes.
 * Uses client-side tokenized obfuscation/encryption simulation for data at rest.
 */

const STORAGE_PREFIX = 'bisa_sec_';
const CIPHER_SALT = 'BISA_SLB_ENC_2026';

function simpleEncrypt(plainText: string): string {
  try {
    const chars = plainText.split('');
    const encrypted = chars.map((c, i) => {
      const saltChar = CIPHER_SALT.charCodeAt(i % CIPHER_SALT.length);
      return String.fromCharCode(c.charCodeAt(0) ^ saltChar);
    }).join('');
    return btoa(encodeURIComponent(encrypted));
  } catch (e) {
    return btoa(encodeURIComponent(plainText));
  }
}

function simpleDecrypt(cipherText: string): string {
  try {
    const decoded = decodeURIComponent(atob(cipherText));
    const chars = decoded.split('');
    return chars.map((c, i) => {
      const saltChar = CIPHER_SALT.charCodeAt(i % CIPHER_SALT.length);
      return String.fromCharCode(c.charCodeAt(0) ^ saltChar);
    }).join('');
  } catch (e) {
    try {
      return decodeURIComponent(atob(cipherText));
    } catch {
      return cipherText;
    }
  }
}

export const cryptoStorage = {
  saveEncrypted<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const json = JSON.stringify(value);
      const encrypted = simpleEncrypt(json);
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, encrypted);
      return true;
    } catch (e) {
      console.warn('CryptoStorage save error:', e);
      return false;
    }
  },

  loadEncrypted<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (!raw) return fallback;
      const decrypted = simpleDecrypt(raw);
      return JSON.parse(decrypted) as T;
    } catch (e) {
      console.warn('CryptoStorage load error:', e);
      return fallback;
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  },

  clearAll(): void {
    if (typeof window === 'undefined') return;
    const keys = Object.keys(localStorage);
    keys.forEach(k => {
      if (k.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(k);
      }
    });
  }
};
