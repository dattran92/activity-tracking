FROM node:6.0
RUN cp -f /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime
RUN npm config set registry http://npm.chotot.org

RUN mkdir -p /app
WORKDIR /app

RUN echo activity-tracking
# Install app dependencies
COPY package.json /app/
RUN npm install

# Bundle app source
COPY . /app

EXPOSE 3000
CMD ["node", "index.js"]
