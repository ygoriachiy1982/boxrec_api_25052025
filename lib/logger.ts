export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: any
  error?: any
  userId?: string
  endpoint?: string
  duration?: number
}

export class Logger {
  private static instance: Logger

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private log(level: LogLevel, message: string, context?: any, error?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    }

    // Console logging for development
    if (process.env.NODE_ENV === "development") {
      console[level === LogLevel.ERROR ? "error" : "log"](entry)
    }

    // In production, you might want to send logs to external service
    // like Sentry, LogRocket, or CloudWatch
    if (process.env.NODE_ENV === "production") {
      this.sendToExternalLogger(entry)
    }
  }

  error(message: string, context?: any, error?: any) {
    this.log(LogLevel.ERROR, message, context, error)
  }

  warn(message: string, context?: any) {
    this.log(LogLevel.WARN, message, context)
  }

  info(message: string, context?: any) {
    this.log(LogLevel.INFO, message, context)
  }

  debug(message: string, context?: any) {
    this.log(LogLevel.DEBUG, message, context)
  }

  private async sendToExternalLogger(entry: LogEntry) {
    // Implement external logging service integration here
    // For example, send to Vercel Analytics or another service
    try {
      // Example: await fetch('https://your-logging-service.com/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // })
    } catch (error) {
      console.error("Failed to send log to external service:", error)
    }
  }
}

// Performance monitoring middleware
export function withPerformanceLogging<T extends any[], R>(fn: (...args: T) => Promise<R>, name: string) {
  return async (...args: T): Promise<R> => {
    const start = Date.now()
    const logger = Logger.getInstance()

    try {
      logger.info(`Starting ${name}`)
      const result = await fn(...args)
      const duration = Date.now() - start
      logger.info(`Completed ${name}`, { duration })
      return result
    } catch (error) {
      const duration = Date.now() - start
      logger.error(`Failed ${name}`, { duration }, error)
      throw error
    }
  }
}
