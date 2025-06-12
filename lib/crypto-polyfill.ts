// Crypto polyfill specifically for XMTP
import { Buffer } from 'buffer';

// Ensure crypto is available globally for XMTP
if (typeof window !== 'undefined') {
  // Define nodeCrypto for libraries that might reference it
  const setupCrypto = () => {
    try {
      // Use browser's native crypto if available
      if (window.crypto && window.crypto.subtle) {
        // Create a comprehensive nodeCrypto-like interface
        const nodeCrypto = {
          randomBytes: (size: number) => {
            const array = new Uint8Array(size);
            window.crypto.getRandomValues(array);
            return Buffer.from(array);
          },
          createHash: (algorithm: string) => {
            let data = Buffer.alloc(0);
            return {
              update: (chunk: any) => {
                if (typeof chunk === 'string') {
                  data = Buffer.concat([data, Buffer.from(chunk, 'utf8')]);
                } else if (chunk instanceof Uint8Array) {
                  data = Buffer.concat([data, Buffer.from(chunk)]);
                } else {
                  data = Buffer.concat([data, Buffer.from(chunk)]);
                }
                return this;
              },
              digest: async (encoding?: string) => {
                const hashBuffer = await window.crypto.subtle.digest(
                  algorithm.toUpperCase() === 'SHA256' ? 'SHA-256' : algorithm,
                  data
                );
                const result = Buffer.from(hashBuffer);
                return encoding === 'hex' ? result.toString('hex') : result;
              }
            };
          },
          createHmac: (algorithm: string, key: any) => {
            let data = Buffer.alloc(0);
            return {
              update: (chunk: any) => {
                if (typeof chunk === 'string') {
                  data = Buffer.concat([data, Buffer.from(chunk, 'utf8')]);
                } else if (chunk instanceof Uint8Array) {
                  data = Buffer.concat([data, Buffer.from(chunk)]);
                } else {
                  data = Buffer.concat([data, Buffer.from(chunk)]);
                }
                return this;
              },
              digest: async (encoding?: string) => {
                try {
                  const keyBuffer = typeof key === 'string' ? Buffer.from(key, 'utf8') : Buffer.from(key);
                  const cryptoKey = await window.crypto.subtle.importKey(
                    'raw',
                    keyBuffer,
                    { name: 'HMAC', hash: algorithm.toUpperCase() === 'SHA256' ? 'SHA-256' : algorithm },
                    false,
                    ['sign']
                  );
                  const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, data);
                  const result = Buffer.from(signature);
                  return encoding === 'hex' ? result.toString('hex') : result;
                } catch (error) {
                  console.warn('HMAC digest failed, using fallback:', error);
                  return Buffer.from('fallback-hmac');
                }
              }
            };
          },
          constants: {
            RSA_PKCS1_PADDING: 1,
            RSA_SSLV23_PADDING: 2,
            RSA_NO_PADDING: 3,
            RSA_PKCS1_OAEP_PADDING: 4
          }
        };

        // Make nodeCrypto available globally in multiple ways
        (globalThis as any).nodeCrypto = nodeCrypto;
        (window as any).nodeCrypto = nodeCrypto;
        
        // Also set up for require-style access
        if (!(globalThis as any).require) {
          (globalThis as any).require = (module: string) => {
            if (module === 'crypto') {
              return nodeCrypto;
            }
            throw new Error(`Module ${module} not found`);
          };
        }
        
        return true;
      }
    } catch (error) {
      console.warn('Failed to setup crypto polyfill:', error);
    }
    return false;
  };

  // Set up crypto immediately
  setupCrypto();
  
  // Also ensure it's available after DOM loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCrypto);
  }
}

export {};
