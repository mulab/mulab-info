import 'babel-polyfill';
import './lib/ldap';
import { createServer } from 'http';
import { promisify } from 'bluebird';
import { route } from './route';

const Application = require('koa');
const session = require('koa-session');
const convert = require('koa-convert');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');

let app = new Application();
app.keys = [''];
app.use(logger());
app.use(convert(session(app)));
app.use(bodyParser());
app.use(route.routes());

app.listen(3000);
