ALTER DATABASE activity_tracking SET timezone TO 'Asia/Ho_Chi_Minh';

CREATE TABLE users
(
  user_id SERIAL NOT NULL,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(100) NULL,
  active bool NOT NULL,
  PRIMARY KEY (user_id)
);

CREATE UNIQUE INDEX user_username ON users(username);

CREATE TABLE activity_logs
(
  activity_log_id SERIAL NOT NULL,
  user_id INTEGER NOT NULL,
  activity VARCHAR(50) NOT NULL,
  deliver_date DATE NOT NULL,
  checkin TIMESTAMP NULL,
  checkout TIMESTAMP NULL,
  total_sec INT NULL
);

CREATE INDEX activity_log_user ON activity_logs(user_id);
CREATE INDEX activity_log_user_activity ON activity_logs(user_id, activity);
