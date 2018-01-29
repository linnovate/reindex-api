'use strict';

var path = require('path'),
	rootPath = path.normalize(__dirname + '/../..');

module.exports = {
	templateEngine: 'swig',
	version: 'v1',
	activeProvider: '',
	root: rootPath,
};