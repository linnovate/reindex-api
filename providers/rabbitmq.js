'use strict';

var config = require('../config'),
  rabbit = require('replay-rabbitmq');

var queues = [{
  name: 'crons-402',
  requires: ['../consumers/crons'],
  maxUnackMessages: 1
}, {
  name: 'reindex-402',
  requires: ['../consumers/reindex'],
  maxUnackMessages: 1
}, {
  name: 'unset-route-402',
  requires: ['../consumers/unset-route'],
  maxUnackMessages: 10
}, {
  name: 'create-sitemap-file-402',
  requires: ['../consumers/sitemap'],
  maxUnackMessages: 1
}, {
  name: 'convert-location',
  requires: ['../consumers/convert2geo'],
  maxUnackMessages: 1
}];

function init() {
  connectRabbitMQ()
    .then(function (err) {
      console.log('connectRabbitMQ Err:', err);

      queues.forEach(function (queue, index) {
        queue.requires.forEach(function (r) {
          require(r)(rabbit, queue);
        });
      });
    });
}

init();


function connectRabbitMQ() {
  var host = (config.rabbitmq && config.rabbitmq.host) ? config.rabbitmq.host : 'localhost';
  return rabbit.connect(host);
}

rabbit.eventEmitter.on('channel.close', function (err) {
  init();
});
