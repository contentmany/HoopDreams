// Simple cache for rendered avatar data URLs to improve performance
interface CacheEntry {
  dataURL: string;
  timestamp: number;
}

class AvatarCache {
  private cache = new Map<string, CacheEntry>();
  private maxAge = 5 * 60 * 1000; // 5 minutes
  private maxSize = 200; // Maximum cache entries
  
  private getCacheKey(seed: number, size: number): string {
    return `${seed}-${size}`;
  }
  
  get(seed: number, size: number): string | null {
    const key = this.getCacheKey(seed, size);
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if entry is expired
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.dataURL;
  }
  
  set(seed: number, size: number, dataURL: string): void {
    // If cache is at max size, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    const key = this.getCacheKey(seed, size);
    this.cache.set(key, {
      dataURL,
      timestamp: Date.now()
    });
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    }
  }
}

export const avatarCache = new AvatarCache();

// Auto-cleanup every 5 minutes
setInterval(() => {
  avatarCache.cleanup();
}, 5 * 60 * 1000);