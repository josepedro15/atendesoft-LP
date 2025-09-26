/**
 * Sistema de logging estruturado
 * Centraliza logs da aplicação com diferentes níveis
 */

import { config } from './config';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = config.isDevelopment;
  }

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context, error, userId, sessionId } = entry;
    
    let logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (userId) logMessage += ` | User: ${userId}`;
    if (sessionId) logMessage += ` | Session: ${sessionId}`;
    if (context && Object.keys(context).length > 0) {
      logMessage += ` | Context: ${JSON.stringify(context)}`;
    }
    if (error) {
      logMessage += ` | Error: ${error.message}`;
      if (this.isDevelopment && error.stack) {
        logMessage += ` | Stack: ${error.stack}`;
      }
    }
    
    return logMessage;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    const formattedMessage = this.formatLog(entry);

    // Log no console com cores diferentes
    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(`🐛 ${formattedMessage}`);
        }
        break;
      case 'info':
        console.info(`ℹ️ ${formattedMessage}`);
        break;
      case 'warn':
        console.warn(`⚠️ ${formattedMessage}`);
        break;
      case 'error':
        console.error(`❌ ${formattedMessage}`);
        break;
    }

    // Em produção, você pode enviar para um serviço de logging
    if (config.isProduction && level === 'error') {
      this.sendToExternalService(entry);
    }
  }

  private async sendToExternalService(entry: LogEntry) {
    try {
      // Aqui você pode integrar com serviços como Sentry, LogRocket, etc.
      // Por enquanto, apenas logamos
      console.log('Sending error to external service:', entry);
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, context, error);
  }

  // Métodos específicos para diferentes contextos
  apiRequest(method: string, endpoint: string, status?: number, duration?: number) {
    this.info('API Request', {
      method,
      endpoint,
      status,
      duration: duration ? `${duration}ms` : undefined,
    });
  }

  apiError(method: string, endpoint: string, error: Error, status?: number) {
    this.error('API Error', error, {
      method,
      endpoint,
      status,
    });
  }

  userAction(action: string, userId?: string, context?: Record<string, any>) {
    this.info('User Action', {
      action,
      userId,
      ...context,
    });
  }

  authEvent(event: string, userId?: string, context?: Record<string, any>) {
    this.info('Auth Event', {
      event,
      userId,
      ...context,
    });
  }

  businessEvent(event: string, context?: Record<string, any>) {
    this.info('Business Event', {
      event,
      ...context,
    });
  }

  performance(operation: string, duration: number, context?: Record<string, any>) {
    this.info('Performance', {
      operation,
      duration: `${duration}ms`,
      ...context,
    });
  }
}

// Instância singleton
export const logger = new Logger();

// Função helper para logging de performance
export function logPerformance<T>(
  operation: string,
  fn: () => Promise<T>,
  context?: Record<string, any>
): Promise<T> {
  const start = Date.now();
  
  return fn()
    .then((result) => {
      const duration = Date.now() - start;
      logger.performance(operation, duration, context);
      return result;
    })
    .catch((error) => {
      const duration = Date.now() - start;
      logger.error(`Performance error in ${operation}`, error, {
        duration: `${duration}ms`,
        ...context,
      });
      throw error;
    });
}
