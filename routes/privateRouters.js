const config = require('jkonfig')();
const router = require('express').Router();
const moment = require('moment');
const { authMiddleware } = require('../libs/Auth');
const errorHandle = require('../libs/errorHandle');
const CustomError = require('../libs/CustomError');
const { activityLogModel } = require('../models');

const prefix = config.private_prefix;

router.use(prefix, authMiddleware);
router.get(`${prefix}/auth`, (req, res) => {
  res.json({
    token: req.header('Authorization'),
    user: req.user
  });
})
router.post(`${prefix}/checkin`, (req, res) => {
  const user = req.user;
  const activity = req.body.activity;
  const checkinTime = req.body.checkin_time;
  activityLogModel.checkin(user.user_id, activity, checkinTime)
    .then((result) => {
      res.json({ message: "Checked in!!!", activity_log_id: result.activity_log_id });
    })
    .catch((error) => {
      return errorHandle(res, error);
    });
});

router.post(`${prefix}/checkout`, (req, res) => {
  const user = req.user;
  const activityLogId = req.body.activity_log_id;
  const checkoutTime = req.body.checkout_time;
  activityLogModel.getOne(activityLogId)
    .then((activityLog) => {
      if (!activityLog || activityLog.user_id != user.user_id) {
        return Promise.reject(new CustomError('not_found', 'Cannot checkout this activity.'));
      }
      const checkinTime = moment(activityLog.checkin);
      const totalSec = moment(checkoutTime, config.time_format).diff(checkinTime, 'seconds');
      return activityLogModel.checkout(activityLogId, checkoutTime, totalSec)
        .then(() => {
          res.json({
            message: 'Checked out!!!',
            total_sec: totalSec
          });
        });
    })
    .catch((error) => {
      return errorHandle(res, error);
    });
});

router.get(`${prefix}/logs/:activity`, (req, res) => {
  const user = req.user;
  const activity = req.params.activity;
  const fromDate = req.query.from;
  const toDate = req.query.to;
  return activityLogModel.getLogs(user.user_id, activity, fromDate, toDate)
    .then((result) => res.json(result))
    .catch((error) => {
      return errorHandle(res, error);
    });
});

router.get(`${prefix}/reports/monthly`, (req, res) => {
  const user = req.user;
  const activity = req.query.activity;
  const fromDate = req.query.from;
  const toDate = req.query.to;
  return activityLogModel.getMonthlyReport(user.user_id, activity, fromDate, toDate)
    .then((result) => {
      result.map((item) => {
        item.deliver = moment(item.deliver_date).format('X');
        return item;
      });
      res.json(result);
    })
    .catch((error) => {
      return errorHandle(res, error);
    });
});

router.get(`${prefix}/reports/summary`, (req, res) => {
  const user = req.user;
  const date = req.query.date;
  const activity = req.query.activity;
  const momentDate = moment(date, config.date_format);
  const startOfmonth = momentDate.startOf('month').format(config.date_format);
  const endOfMonth = momentDate.endOf('month').format(config.date_format);
  const promises = [
    activityLogModel.getTotalSec(user.user_id, activity, date, date),
    activityLogModel.getTotalSec(user.user_id, activity, startOfmonth, endOfMonth)
  ];
  return Promise.all(promises)
    .then((result) => {
      res.json({
        date: result[0].total_sec | 0,
        month: result[1].total_sec | 0
      });
    })
    .catch((error) => {
      return errorHandle(res, error);
    });
})

module.exports = router;
