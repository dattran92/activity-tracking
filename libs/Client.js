const superagent = require('superagent');
const logger = require('log4js').getLogger();

const methods = ['get', 'post', 'put', 'patch', 'del'];
class Client {
  constructor(rootUrl, options = {}) {
    methods.forEach((method) =>
      this[method] = (path, { params, headers, data, auth } = {}, isJson = true) => new Promise((resolve, reject) => {
        const request = superagent[method](`${rootUrl}${path}`);
        request.timeout(options.timeout || 5000);
        if (params) {
          request.query(params);
        }
        if (headers) {
          request.set(headers);
        }
        if (data) {
          if (isJson) {
            request.send(data);
          } else {
            for (const key in data) {
              const value = data[key];
              request.send(`${key}=${value}`);
            }
          }
        }
        if (auth) {
          request.auth(auth.username, auth.password);
        }

        request.end((err, { status, body } = {}) => {
          if (err) {
            logger.error(`API ${rootUrl}${path} error`, err, status, body);
            if (status == '404') return reject(err);
            return reject(body || err);
          }
          logger.debug(`API ${rootUrl}${path} result`,  status, body);
          return resolve(body);
        });
      })
    );
  }
}

module.exports = Client;
