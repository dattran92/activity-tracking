const redis = require('redis');
const log = require('log4js').getLogger();

const definedFunctions = [
  'hgetall', 'hexists', 'hmset', 'hmget', 'hkeys', 'hvals', 'hget', 'hset', 'hdel',
  'mget', 'mset', 'get', 'set', 'del', 'exists', 'lpush', 'lrange', 'zrange', 'zrem', 'zadd',
  'expire', 'incrby'
];

function Redis(redisConfig) {
  const client = redis.createClient(redisConfig);
  client.on('error', (err) => {
    log.error('Redis Error', err);
  });
  client.on('connect', () => {
    log.info(`Redis Client ${redisConfig.host}:${redisConfig.port} Connected`);
  });
  client.on('reconnecting', () => {
    log.info('Redis Client Reconnecting');
  });
  this.client = client;
}

Redis.prototype.multi = function() {
  return this.client.multi();
};

Redis.prototype.batch = function() {
  return this.client.batch();
};

Redis.prototype.quit = function() {
  log.debug('Redis disconnected!');
  this.client.quit();
};

for (let i in definedFunctions) {
  const funcName = definedFunctions[i];
  Redis.prototype[funcName] = function(args) {
    const self = this;
    return new Promise((resolve, reject) => {
      return self.client[funcName](args, (err, result) => {
        log.debug(funcName, args);
        if (err) {
          const obj = JSON.stringify(args);
          log.error(`Redis FUNC [${funcName}] KEY [${obj}] Error `, err);
          if (process.env.NODE_ENV === 'local') {
            return reject(err);
          } else {
            return resolve(null);
          }
        } else {
          return resolve(result);
        }
      });
    });
  };
}

module.exports = Redis;
