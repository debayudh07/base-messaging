export interface BasenameConfig {
  customName?: string;
  useStoredName?: boolean;
}

export class BasenameManager {
  private static generateBasename(address: string): string {
    const adjectives = ['Swift', 'Brave', 'Wise', 'Bold', 'Quick', 'Sharp', 'Bright', 'Noble', 'Steel', 'Cyber'];
    const nouns = ['Warrior', 'Mage', 'Scout', 'Guardian', 'Hunter', 'Sage', 'Knight', 'Ranger', 'Pioneer', 'Builder'];
    
    const hash = parseInt(address.slice(2, 10), 16);
    const adjIndex = hash % adjectives.length;
    const nounIndex = Math.floor(hash / adjectives.length) % nouns.length;
    
    return `${adjectives[adjIndex]} ${nouns[nounIndex]}`;
  }
  
  static getBasename(address: string, config?: BasenameConfig): string {
    const storageKey = `xmtp_basename_${address}`;
    
    // If custom name is provided, use it and store it
    if (config?.customName) {
      localStorage.setItem(storageKey, config.customName);
      return config.customName;
    }
    
    // If using stored name and one exists, return it
    if (config?.useStoredName) {
      const stored = localStorage.getItem(storageKey);
      if (stored) return stored;
    }
    
    // Generate new basename and store it
    const basename = this.generateBasename(address);
    localStorage.setItem(storageKey, basename);
    return basename;
  }
  
  static updateBasename(address: string, newBasename: string): void {
    const storageKey = `xmtp_basename_${address}`;
    localStorage.setItem(storageKey, newBasename);
  }
  
  static getStoredBasename(address: string): string | null {
    const storageKey = `xmtp_basename_${address}`;
    return localStorage.getItem(storageKey);
  }
}
