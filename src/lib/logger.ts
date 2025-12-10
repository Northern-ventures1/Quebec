/**
 * Structured Logging Utility
 * Use this instead of console.log for production-ready logging
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, message: string, meta?: Record<string, any>): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    };

    // In development, use pretty printing
    if (this.isDevelopment) {
      const color = this.getColor(level);
      console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
        `${color}[${level.toUpperCase()}]${this.colors.reset} ${message}`,
        meta ? meta : ''
      );
    } else {
      // In production, use JSON for structured logging
      console.log(JSON.stringify(entry));
    }
  }

  private colors = {
    reset: '\x1b[0m',
    info: '\x1b[36m',    // Cyan
    warn: '\x1b[33m',    // Yellow
    error: '\x1b[31m',   // Red
    debug: '\x1b[35m',   // Magenta
  };

  private getColor(level: LogLevel): string {
    return this.colors[level] || this.colors.reset;
  }

  info(message: string, meta?: Record<string, any>): void {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: Record<string, any>): void {
    this.log('warn', message, meta);
  }

  error(message: string, error?: unknown, meta?: Record<string, any>): void {
    const errorMeta = {
      ...meta,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    };
    this.log('error', message, errorMeta);
  }

  debug(message: string, meta?: Record<string, any>): void {
    if (this.isDevelopment) {
      this.log('debug', message, meta);
    }
  }

  // API-specific logging helpers
  apiRequest(method: string, path: string, userId?: string): void {
    this.info('API Request', { method, path, userId });
  }

  apiResponse(method: string, path: string, statusCode: number, duration: number): void {
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    this.log(level, 'API Response', { method, path, statusCode, duration });
  }

  dbQuery(query: string, duration: number): void {
    this.debug('Database Query', { query, duration });
  }

  aiRequest(type: string, model: string, userId?: string): void {
    this.info('AI Request', { type, model, userId });
  }
}

export const logger = new Logger();
