#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	CREATE DATABASE ssa;
EOSQL

psql ssa -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --file=/docker-entrypoint-initdb.d/init.sql
psql ssa -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --file=/init-script/test-data.sql
psql ssa -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --file=/init-script/create_campaign.sql
psql ssa -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --file=/init-script/accept_campaign.sql
psql ssa -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --file=/init-script/reject_campaign.sql
psql ssa -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --file=/init-script/refuse_campaign.sql
psql ssa -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --file=/init-script/update_campaign_param.sql
psql ssa -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --file=/init-script/start_campaign.sql
psql ssa -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --file=/init-script/close_campaign.sql
psql ssa -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --file=/init-script/update_campaign_order.sql
psql ssa -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --file=/init-script/fill_draft_campaign.sql
psql ssa -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --file=/init-script/pay_campaign.sql
psql ssa -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --file=/init-script/cancel_campaign.sql
psql ssa -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --file=/init-script/submit_payment_approval.sql
psql ssa -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --file=/init-script/approve_payment.sql
