import fs from 'fs';
import path from 'path';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

let logDir = path.join(__dirname, '/../logs');
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new(winston.Logger)({
	transports: [
		new(winston.transports.Console)({
			timestamp: tsFormat,
			colorize: true,
			level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
		}),
		new(winstonDaily)({
			filename: `${logDir}/-results.log`,
			timestamp: tsFormat,
			datePattern: 'yyyy-MM-dd',
			prepend: true,
			level: process.env.NODE_ENV === 'production' ? 'debug' : 'debug'
		})
	]
});
logger.debug('Debugging enabled');

export default logger;
