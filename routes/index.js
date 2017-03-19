require('../libs/base.js');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const log = require('log4js').getLogger();
const privateRouters = require('./privateRouters');
const publicRouters = require('./publicRouters');
const port = process.env.PORT || 3000;
const server = express();

server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use('', publicRouters);
server.use('', privateRouters);
server.get('/health', (req, res) => {
  return res.json({ status: 'ok' });
});
server.listen(port, () => {
  log.info(`Activity Tracking Listening at ${port}`);
});
