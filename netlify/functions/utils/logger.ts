type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private log(level: LogLevel, message: string, meta?: object) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...meta
    };
    
    switch (level) {
      case 'error':
        console.error(JSON.stringify(logData));
        break;
      case 'warn':
        console.warn(JSON.stringify(logData));
        break;
      case 'info':
        console.log(JSON.stringify(logData));
        break;
      case 'debug':
        console.debug(JSON.stringify(logData));
        break;
    }
  }

  debug(message: string, meta?: object) {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: object) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: object) {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: object) {
    this.log('error', message, meta);
  }
}

export const logger = new Logger();