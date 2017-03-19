const UserModel = require('./UserModel');
const ActivityLogModel = require('./ActivityLogModel');

module.exports.userModel = new UserModel();
module.exports.activityLogModel = new ActivityLogModel();
