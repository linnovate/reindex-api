'use strict';
module.exports = {
  db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/reindex-dev',
  dbName: 'reindex-dev',
  host: 'https://localhost:3005',
  google: {
    client_id: 'client_id',
    client_secret: 'client_secret',
    redirect_uri: 'redirect_uri',
  },
  elastic: {
    host: 'localhost',
    port: 9200
  },
  records: {
    index: 'reindex-records',
  },
  hierarchyCategories: {
    index: 'reindex-categories'
  },
  categories: {
    index: 'reindex-cities'
  },
  history: {
    index: 'history',
    type: 'search'
  },
  rabbitmq: {
    host: 'localhost'
  },
  tokenSecret: 'reindex',
  recaptcha: {
    secret: '6LfNoRsUAAAAAG3VGlDXwEq0PS_ia5_TLPWUbPBQ'
  },
  email: {
    service: 'gmail',
    auth: {
      user: '',
      pass: ''
    }
  },
  hierarchyFilters: {
    kashrut: {
      content: 'אוכל'
    }
  },
  paycall: {
    uname: '',
    uid: '',
    pass: ''
  },
  tokenSecret: 'reindextoken',
  testLeads: true,
  gepCoderOptions: {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyBF-KtjsMQHJZ5xGIwLtpmvzsFzspafwtE', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
  },
};