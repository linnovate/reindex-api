'use strict';


module.exports = function(rabbit, qData) {
    rabbit.consume(qData.name, qData.maxUnackMessages, handleMessage);
};

function handleMessage(message, error, done) {
    var type = message.type,
        subtype = message.subtype;

    if (type && subtype && actions[type] && actions[type][subtype]) return actions[type][subtype](message, error, done);
    if (actions[type]) return actions[type](message, error, done);
    console.log('CRON TYPE ' + type + ' IS MISSING');
    done();
}

var actions = {
    //98d8b4b6ce4628e270fcdb7971ccb43c2ad89ceece0b9b5db1699bab26e7e3c0
    reindex: function(message, error, done) {
        require('../crons/reindex')(message, error, done);
    },
    //0f4f92a569b1210143822b1152350a588951b7ec558780d52fa529bc49db20f32dd78cbe163579fab6b7b3edbbdb91d6
    cleanVirtualNumbers: function(message, error, done) {
        require('../crons/clean-virtuals-numbers')(message, error, done);
    },
    //d14db03009a4b6f0c1bd718a3031ad535ff6f52e43840a6fc3ff3d84ea0d3b10
    sitemap: function(message, error, done) {
        require('../crons/sitemap')(message, error, done);
    },
    //0f4f92a569b1210143822b1152350a58c3e6c0b5cefd669ea2db0192296d3283
    convert2geo: function(message, error, done) {
        require('../crons/convert2geo')(message, error, done);
    },
};