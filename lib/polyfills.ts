// Polyfills for Node.js modules in the browser
import { Buffer } from 'buffer';
import process from 'process/browser';

// Add indexedDB polyfill for SSR
if (typeof indexedDB === 'undefined') {
  const FDBFactory = require('fake-indexeddb/lib/FDBFactory');
  const FDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');
  
  (global as any).indexedDB = new FDBFactory();
  (global as any).IDBKeyRange = FDBKeyRange;
}

if (typeof window !== 'undefined') {
  // Make Buffer available globally
  window.Buffer = Buffer;
  
  // Add process polyfill
  window.process = window.process || process;
  window.process.env = window.process.env || {};
  window.process.nextTick = window.process.nextTick || ((fn: Function) => setTimeout(fn, 0));
  
  // Global is sometimes needed
  window.global = window.global || window;

  // Ensure crypto is available
  if (!window.crypto) {
    try {
      const crypto = require('crypto-browserify');
      window.crypto = crypto.webcrypto || crypto;
    } catch (e) {
      console.warn('Crypto polyfill failed to load:', e);
    }
  }

  // Ensure indexedDB is available in browser too
  if (!window.indexedDB) {
    try {
      const FDBFactory = require('fake-indexeddb/lib/FDBFactory');
      const FDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');
      
      window.indexedDB = new FDBFactory();
      window.IDBKeyRange = FDBKeyRange;
    } catch (e) {
      console.warn('IndexedDB polyfill failed to load:', e);
    }
  }
}
