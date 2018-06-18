'use strict';
module.exports = {
  db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || '172.17.0.1') + '/reindex-dev',
  dbName: 'reindex-dev',
  host: 'https://172.17.0.1:3005',
  google: {
    client_id: 'client_id',
    client_secret: 'client_secret',
    redirect_uri: 'redirect_uri',
  },
  elastic: {
    host: '172.17.0.1',
    port: 9200
  },
  records: {
    index: 'reindex-records',
    type: 'record'
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
    host: '172.17.0.1'
  },
  tokenSecret: 'reindex',
  recaptcha: {
    secret: 'recaptcha-key'
  },
  email: {
    service: 'gmail',
    auth: {
      user: '',
      pass: ''
    }
  },
  categoriesFilters: ['kashrut'],
  hierarchyFilters: {
    kashrut: {
      content: 'אוכל'
    }
  },
  searchQuery: {
    businesses: {
      default: {
        match: ['tags.raw', 'categories'],
        regexp: ['business_name']
      },
      notOnlyCategoriesFilter: {
        match: ['business_name'],
        plain: ['business_name']
      }
    }
  },
  queues: [
    // {
    //   name: 'reindex-module',
    //   maxUnackMessages: 5
    // }
  ],
  inheritFunctions: {
    // importRecords: 'reindex-import-module',
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
    apiKey: 'api-key', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
  },
};
