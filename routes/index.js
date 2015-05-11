var express = require('express');
var router = express.Router();


/*Logger Declaration*/

var log4js = require('log4js');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/adapCom.log'), 'adapCom');

var logger = log4js.getLogger('adapCom');


/* Include various endpoints for making requests */

var endpointObj = require(__base + 'lib/logic/logic-endpoint-calls.js');


/* Mapping for default request */

router.get('/', function(req, res) {
    res.send('Node Application is running');
});

router.get('/sampleJsonResponse', function(req, res, next) {
    logger.debug("sampleJsonResponse block executed");

    endpointObj.sample(function(err, data) {

        if (err) {
            next(err);
        }
        res.json(data);
    });

});

router.get('/sampleViewResponse', function(req, res, next) {
    logger.debug("sampleViewResponse block executed");

    res.render('index', {
        title: "I am a title",
        welcomeText: "my page"
    });

});

router.get('/sampleRequest', function(req, res, next) {
    logger.debug("sampleRequest block executed");

    endpointObj.requestSample(function(err, data) {

        if (err) {
            next(err);
        }
        res.json(data);
    });

});

router.get('/sampleRequestAlternate', function(req, res, next) {
    logger.debug("sampleRequestAlternate block executed");

    endpointObj.sampleRequestAlternate(function(err, data) {

        if (err) {
            next(err);
        }
        res.json(data);
    });

});
module.exports = router;
