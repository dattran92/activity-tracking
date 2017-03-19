const Redis = require('./Redis');
const config = require('jkonfig')();
module.exports = new Redis(config.redisConfig);
