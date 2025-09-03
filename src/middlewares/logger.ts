import * as fs from 'fs';
import * as path from 'path';
import * as expressWinston from 'express-winston';
import { format, transports } from 'winston';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

export const requestLogger = expressWinston.logger({
  transports: [
    new transports.File({ filename: path.join(logsDir, 'request.log') }),
  ],
  format: format.combine(format.timestamp(), format.json()),
  meta: true,
  msg: '{{req.method}} {{req.url}}',
  expressFormat: false,
  colorize: false,
  headerBlacklist: ['authorization', 'cookie'],
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    new transports.File({ filename: path.join(logsDir, 'error.log') }),
  ],
  format: format.combine(format.timestamp(), format.json()),
});
