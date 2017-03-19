const bcrypt = require('bcrypt-nodejs');
const logger = require('log4js').getLogger();
const config = require('jkonfig')();
const ModelBase = require('../libs/ModelBase');
const SEED = 'Te!@#0Pha';

class UserModel extends ModelBase {
  constructor() {
    super(config.db);
  }

  login(username, password) {
    const query = 'SELECT * FROM users WHERE username = $1 AND active = $2';
    return this.queryOne(query, [username, true])
      .then((user) => {
        if (user && bcrypt.compareSync(`${SEED}${password}`, user.password)) {
          return {
            user_id: user.user_id,
            username: user.username
          }
        }
        return null;
      });
  }

  register(username, password) {
    const query = 'INSERT INTO users (username, password, active) VALUES ($1, $2, $3)';
    return this.queryOne(query, [username, bcrypt.hashSync(`${SEED}${password}`), true]);
  };
}

module.exports = UserModel;
