'use strict';

var path = require('path'),
	rootPath = path.normalize(__dirname + '/../..');

module.exports = {
	templateEngine: 'swig',
	version: 'v1',
	activeProvider: '',
	root: rootPath,
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
	// queues: [
	//   {
	//     name: 'reindex-import-module',
	//     maxUnackMessages: 5
	//   }
	// ],	
	// schedules: [
	//   {
	//     name: 'reindex-import-module'
	//   }
	// ],
	// inheritFunctions: {
	//   importRecords: 'reindex-import-module',
	// },
};