process.env.TZ = 'Asia/Ho_Chi_Minh';
const config = require('jkonfig')();
const log4js = require('log4js');
const log = log4js.getLogger();
log4js.configure({
  appenders: [
    config.log
  ]
});
log.setLevel(config.log_level);
