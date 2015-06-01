/*jshint -W030 */
"use strict";

require("should");
var loadconfig = require("../index.js");

describe("#loadTest", function() {
	var path = __dirname + '/configs';

	it("should load global config", function() {
		var config = loadconfig(path);
		config.should.have.properties(['env', 'val1', 'val2', 'val3']);
	});
	it("should load local config", function() {
		var config = loadconfig(path);
		config.should.have.properties(['local']);
	});
	it("should load test config", function() {
		var config = loadconfig(path);
		config.should.have.properties(['test']);
	});
	it("should load test.local config", function() {
		var config = loadconfig(path);
		config.should.have.properties(['testlocal']);
	});
	it("should load global/local/test/test.local config", function() {
		var config = loadconfig(path);
		config.should.have.properties(['env', 'val1', 'val2', 'val3', 'local', 'test', 'testlocal']);
		config.env.should.be.equal('testlocal');
	});

});
