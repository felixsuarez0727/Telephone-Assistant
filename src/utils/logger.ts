import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const LOG_LEVEL = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug');

const LOG_LEVELS = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5
};

const shouldLog = (level: keyof typeof LOG_LEVELS) => {
  return LOG_LEVELS[level] >= LOG_LEVELS[LOG_LEVEL as keyof typeof LOG_LEVELS];
};

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

export const logger = {
  debug: (message: string) => {
    if (shouldLog('debug')) {
      console.log(`${colors.blue}[DEBUG]${colors.reset} ${message}`);
    }
  },
  info: (message: string) => {
    if (shouldLog('info')) {
      console.log(`${colors.green}[INFO]${colors.reset} ${message}`);
    }
  },
  warn: (message: string) => {
    if (shouldLog('warn')) {
      console.log(`${colors.yellow}[WARN]${colors.reset} ${message}`);
    }
  },
  error: (message: string) => {
    if (shouldLog('error')) {
      console.error(`${colors.red}[ERROR]${colors.reset} ${message}`);
    }
  },
  fatal: (message: string) => {
    if (shouldLog('fatal')) {
      console.error(`${colors.magenta}[FATAL]${colors.reset} ${message}`);
    }
  }
};