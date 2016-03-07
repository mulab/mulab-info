import { nodeEnv } from '../config';
const bunyan = require('bunyan');

const logLevel = (nodeEnv === 'development') ? 'debug' : 'info';
export default bunyan.createLogger({ name: 'app', level: logLevel });
