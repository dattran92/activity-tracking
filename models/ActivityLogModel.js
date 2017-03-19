const moment = require('moment');
const logger = require('log4js').getLogger();
const config = require('jkonfig')();
const ModelBase = require('../libs/ModelBase');

class ActivityLogModel extends ModelBase {
  constructor() {
    super(config.db);
  }

  getOne(id) {
    return this.queryOne('SELECT * FROM activity_logs WHERE activity_log_id = $1', [ id ]);
  }

  getLogs(userId, activity, fromDate, toDate) {
    const query = `
      SELECT
        *
      FROM
        activity_logs
      WHERE
        user_id = $1 AND
        activity = $2 AND
        deliver_date >= $3 AND
        deliver_date <= $4
    `;
    return this.queryMulti(query, [ userId, activity, fromDate, toDate ]);
  }

  checkin(userId, activity, checkin) {
    const deliverDate = moment(checkin, config.time_format).format(config.date_format);
    const query = `
      INSERT INTO activity_logs (user_id, activity, deliver_date, checkin)
      VALUES ($1, $2, $3, $4)
      RETURNING activity_log_id`;
    return this.queryOne(query, [ userId, activity, deliverDate, checkin ]);
  }

  checkout(activity_log_id, checkout, totalSec) {
    const query = `UPDATE activity_logs SET checkout = $2, total_sec = $3 WHERE activity_log_id = $1`;
    return this.queryOne(query, [ activity_log_id, checkout, totalSec ]);
  }

  getTotalSec(userId, activity, fromDate, toDate) {
    const query = `
      SELECT
        SUM(total_sec) AS total_sec
      FROM
        activity_logs
      WHERE
        user_id = $1 AND
        activity = $2 AND
        deliver_date >= $3 AND 
        deliver_date <= $4
    `;
    return this.queryOne(query, [ userId, activity, fromDate, toDate ]);
  }
}

module.exports = ActivityLogModel;
