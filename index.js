"use strict";

var fs = require('fs');
var extend = require('extend');
var NODE_ENV = process.env.NODE_ENV;
var cached = {};

var mergeConfig = function(oldConfig, newConfig) {
	return extend(true, oldConfig, newConfig || {});
};

var getConfigFile = function(dir, filename, debug) {
	var config = {};

	var file = dir + "/" + filename + '.js';

	if (fs.existsSync(file)) {
		config = require(file);
		if (debug) {
			console.log("CONFIG : Loaded " + filename + ".js");
		}
	}
	else if (debug) {
		console.log("CONFIG : Not found " + filename + ".js");
	}

	return config;
};

module.exports = function(baseDir, debug) {
	if (debug) {
		console.log("CONFIG : current environment: " + NODE_ENV);
	}

	if (cached[baseDir]) {
		if (debug) {
			console.log("CONFIG : loading from cache");
		}
		return cached[baseDir];
	}

	if (debug) {
		console.log("CONFIG : current folder: " + baseDir);
	}

	var config = mergeConfig(getConfigFile(baseDir, 'global', debug), getConfigFile(baseDir, 'local', debug));

	// Set your process.env.NODE_ENV to "test dev"
	// to load the config files :
	//     test.js
	//     test.dev.js
	var envs = NODE_ENV && NODE_ENV.split(" ") || [];
	for (var i = 0; i < envs.length; i++) {
		var env = envs.slice(0, i + 1).join(".");
		config = mergeConfig(config, getConfigFile(baseDir, env, debug));
		config = mergeConfig(config, getConfigFile(baseDir, env + '.local', debug));
	}

	return config;
};
