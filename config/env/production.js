'use strict';

module.exports = {
  db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/402-prod',
  dbName: '402-prod',
  host: 'https://402.co.il',
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
    index: 'records4',
    type: 'record'
  },
  hierarchyCategories: {
    index: 'cat1'
  },
  categories: {
    index: '402autocomplete'
  },
  history: {
    index: 'history',
    type: 'search'
  },
  rabbitmq: {
    host: 'localhost'
  },
  tokenSecret: '402newstart402',
  recaptcha: {
    secret: '6LfNoRsUAAAAAG3VGlDXwEq0PS_ia5_TLPWUbPBQ'
  },
  email: {
    service: 'gmail',
    auth: {
      user: 'hamadrichharedi@gmail.com',
      pass: 'hamadrichharedi402'
    }
  },
  hierarchyFilters: {
    kashrut: {
      content: 'אוכל'
    }
  },
  paycall: {
    uname: 'shlemut2',
    uid: '981',
    pass: '123456'
  },
  messereser: {
    userName: '5350500@gmail.com',
    password: 'madrich5326',
    ppl:{
      userId: '4848',
      contactListName: 'רשימת 402 אנשים'
    },
    bis: {
      userId: '4848',
      contactListName: 'רשימת 402 עסקים'
    },
    updatebis: {
      userId: '4848',
      contactListName: 'מעדכני עסקים 402'
    },
    updateppl: {
      userId: '4848',
      contactListName: 'מעדכני אנשים 402'
    }
  },
  testLeads: true,
  gepCoderOptions: {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyBF-KtjsMQHJZ5xGIwLtpmvzsFzspafwtE', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
  },
  headersCSV : ['business_name', 'first_name', 'last_name', 'business_description', 'address_street_name', 'address_street_number', 'address_street_entrance', 'address_neighborhood', 'address_additional_info', 'address_city', 'phone', 'phone_2', 'email', 'website', 'listing_type_1', 'tags', 'categories_str']

};