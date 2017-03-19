FROM postgres:9.5
RUN mkdir /var/lib/postgresql/data/archive/
RUN cp -f /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime
COPY init-db.sh /docker-entrypoint-initdb.d/
COPY init.sql /docker-entrypoint-initdb.d/
COPY test-data.sql /init-script/
COPY functions/ /init-script/
