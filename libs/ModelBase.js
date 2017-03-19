const pg = require('pg');
let log = require('log4js').getLogger();

class ModelBase {
  constructor(dbConfig) {
    this.connectionString = 'postgres://';
    if(dbConfig.username) {
      this.connectionString += dbConfig.username;
      if(dbConfig.password) {
        this.connectionString += ':' + dbConfig.password;
      }
      this.connectionString += '@';
    }
    this.connectionString += dbConfig.host + '/' + dbConfig.name;
  }

  connect() {
    return new Promise((resolve, reject) => {
      pg.connect(this.connectionString, (err, client, done) => {
        if(err) {
          log.error(`error fetching client from pool ${this.connectionString}`, err);
          return reject(err);
        } else {
          log.debug('Got connection from pool');
          return resolve({ client, done });
        }
      });
    });
  }

  queryOne(query_str, args = []) {
    return this.connect()
      .then(({client, done}) => {
        return new Promise((resolve, reject) => {
          client.query(query_str, args, (err, result) => {
            log.debug('result from query', result);
            done();
            if(err) {
              log.error(`error running query ${query_str} ${args}`, err);
              return reject(err);
            } else {
              return resolve(result.rows[0]);
            }
          });
        });
      })
      .catch((err) => {
        log.trace(err);
        return Promise.reject(err);
      });
  }

  doAction(query_str, args = []) {
    return this.connect()
      .then(({client, done}) => {
        return new Promise((resolve, reject) => {
          client.query(query_str, args, (err, result) => {
            log.debug('result from query', result);
            done();
            if(err) {
              log.error(`error running query ${query_str} ${args}`, err);
              return reject(err);
            } else {
              return resolve(result.rowCount);
            }
          });
        });
      })
      .catch((err) => {
        log.trace(err);
        return Promise.reject(err);
      });
  }

  queryMulti(queryStr, args = []) {
    log.debug(`QueryMulti ${queryStr}`, args);
    return this.connect()
      .then(({client, done}) => {
        return new Promise((resolve, reject) => {
          client.query(queryStr, args, (err, result) => {
            log.debug('result from query', result);
            done();
            if (err) {
              log.error(`error running query ${queryStr} ${args}`, err);
              return reject(err.message);
            } else {
              return resolve(result.rows);
            }
          });
        });
      })
      .catch((err) => {
        log.trace(err);
        return Promise.reject(err);
      });
  }
}
module.exports = ModelBase;
