var http = require('http');
var https = require('https');
var request = require('request');

/*Logger Declaration*/

var log4js = require('log4js');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/adapCom.log'), 'adapCom');

var logger = log4js.getLogger('adapCom');


var utils = require(__base + 'lib/utils/utils.js');


/* Include various endpoint reuqests */
module.exports = {

    sample: function(callback) {
        var text = "Hello! I'm a text string";
        var data = {
            firstName: "john",
            lastName: "doe"
        };
        // logger.debug(text);
        // callback(new Error("ErrorName"));
        callback(null, data);
    },

    sampleRequest: function(callback) {

        request({
            strictSSL: false,
            headers: {
                'Content-Type': "application/json"
            },
            uri: url, //URL goes here
            method: 'POST'
        }, function(err, res, body) {
            //Check for error
            if (err) {
                //returning the error as response in json
                return callback(err);
            }

            //Check for right status code
            if (res.statusCode !== 200) {
                //returning custom error
                return callback(new Error("ErrorName"));
            }
            //success callback
            callback(null, body);
        });

    },

    // Another way to make http requests
    sampleRequestAlternate: function(callback) {

        var query = urlHelper.ibmURL + 'helloURL';

        var options = {
            host: urlHelper.ibmEndpoint,
            path: query,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };
        var req = http.request(options, function(res) {
            res.setEncoding('utf8');

            //Check for right status code
            if (res.statusCode !== 200) {
                //returning custom error
                return callback(new Error("ErrorName"));
            }

            var category = '';
            res.on('data', function(chunk) {
                logger.debug("Response received");
                logger.debug(chunk);
            });
            res.on('end', function() {
                //success callback
                callback(null, "Success");
            });
        });
        //Check for error
        req.on('error', function(err) {
            //returning the error as response in json
            return callback(err);
        });
        req.end();

    }

};
