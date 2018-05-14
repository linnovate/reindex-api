FROM node:7
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
RUN echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.6 main" | tee /etc/apt/sources.list.d/mongodb-org-3.6.list
RUN apt-get update
RUN apt-get install -y mongodb-org-tools
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
#RUN npm cache clean
RUN npm install
#prod mode (not supported now)-> COPY . /usr/src/app
EXPOSE 3005
CMD ["node","bin/www"]
