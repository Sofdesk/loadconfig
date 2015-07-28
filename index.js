"use strict";

var fs = require('fs');
var extend = require('extend');
var path = require('path');
var cached = {};

var mergeConfig = function(oldConfig, newConfig) {
	return extend(true, oldConfig, newConfig || {});
};

var getConfigFile = function(dir, filename, debug) {
	var config = {};

	var file = dir + "/" + filename + '.js';

	if (fs.existsSync(file)) {
		// delete require cache : http://stackoverflow.com/a/11477602/808657
		delete require.cache[require.resolve(file)];

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

module.exports = function(baseDir, debug, environment) {
	baseDir = path.resolve(baseDir);

	var env = environment || process.env.NODE_ENV;
	if (debug) {
		console.log("CONFIG : current environment: " + env);
	}

	if (cached[baseDir] && cached[baseDir][env]) {
		if (debug) {
			console.log("CONFIG : loading from cache");
		}
		return cached[baseDir][env];
	}

	if (debug) {
		console.log("CONFIG : current folder: " + baseDir);
	}

	var config = mergeConfig(getConfigFile(baseDir, 'global', debug), getConfigFile(baseDir, 'local', debug));

	// Set your process.env.NODE_ENV to "test dev"
	// to load the config files :
	//     test.js
	//     test.dev.js
	var envs = env && env.split(" ") || [];
	for (var i = 0; i < envs.length; i++) {
		var _env = envs.slice(0, i + 1).join(".");
		config = mergeConfig(config, getConfigFile(baseDir, _env, debug));
		config = mergeConfig(config, getConfigFile(baseDir, _env + '.local', debug));
	}

	cached[baseDir] = cached[baseDir] || {};
	cached[baseDir][env] = config;

	return config;
};
