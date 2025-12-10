/**
 * Rate Limiting Utility
 * Prevents abuse of AI and auth endpoints
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

/**
 * Check if request is within rate limit
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param options - Rate limit configuration
 * @returns true if request is allowed, false if rate limited
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 10, windowMs: 60000 }
): boolean {
  const now = Date.now();
  const record = store[identifier];

  // No record or expired window - allow and create new record
  if (!record || now > record.resetAt) {
    store[identifier] = {
      count: 1,
      resetAt: now + options.windowMs,
    };
    return true;
  }

  // Within window - check if limit exceeded
  if (record.count >= options.limit) {
    return false;
  }

  // Increment count
  record.count++;
  return true;
}

/**
 * Get remaining requests in current window
 */
export function getRemainingRequests(
  identifier: string,
  limit: number
): number {
  const record = store[identifier];
  if (!record || Date.now() > record.resetAt) {
    return limit;
  }
  return Math.max(0, limit - record.count);
}

/**
 * Get time until rate limit resets (in seconds)
 */
export function getResetTime(identifier: string): number {
  const record = store[identifier];
  if (!record || Date.now() > record.resetAt) {
    return 0;
  }
  return Math.ceil((record.resetAt - Date.now()) / 1000);
}

/**
 * Predefined rate limit configurations
 */
export const RateLimits = {
  // Auth endpoints - 5 requests per minute
  auth: { limit: 5, windowMs: 60000 },
  
  // AI chat - 10 requests per minute
  aiChat: { limit: 10, windowMs: 60000 },
  
  // AI image generation - 3 requests per minute (expensive)
  aiImage: { limit: 3, windowMs: 60000 },
  
  // Standard API - 60 requests per minute
  api: { limit: 60, windowMs: 60000 },
  
  // Search - 20 requests per minute
  search: { limit: 20, windowMs: 60000 },
};

/**
 * Clean up expired records (run periodically)
 */
export function cleanupExpiredRecords(): void {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (now > store[key].resetAt) {
      delete store[key];
    }
  });
}

// Clean up every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredRecords, 5 * 60 * 1000);
}
