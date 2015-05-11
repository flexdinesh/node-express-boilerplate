/* 
File name: app.js
Server: Node JS
*/
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var fs = require('fs');
var express = require('express');
var nconf = require('nconf');
var http = require('http');
var https = require('https');

var bodyParser = require('body-parser');

global.__base = __dirname + '/';

//Application configuration environment file
nconf.argv()
    .env()
    .file({
        file: './config/app-config.json'
    });

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use("/css", express.static(__dirname + '/static/css'));
app.use("/js", express.static(__dirname + '/static/js'));
app.use("/images", express.static(__dirname + '/static/images'));
app.use("/logs", express.static(__dirname + '/logs'));


function include(f) {
    eval.apply(global, [fs.readFileSync(f).toString()]);
}


/*Logger Declaration*/

var log4js = require('log4js');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/adapCom.log'), 'adapCom');

var logger = log4js.getLogger('adapCom');



/* HTTPS SSL Support (Port:443) */

var secureOptions = {
    key: fs.readFileSync('config/ssl/key.pem'),
    cert: fs.readFileSync('config/ssl/cert.pem'),
    rejectUnauthorized: false
};


/* HTTP Server (Port: 3000) */

var httpServer = http.createServer(app);
var httpsServer = https.createServer(secureOptions, app);


/*Router Declarations*/

var index = require(__dirname + '/routes/index'); //Generic routes


/* setting encoding for response */

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


/* Mapping the requests to routes (controllers) */

app.use('/', index); //Mapping for generic app requests


/*Top-level error handler for requests*/

app.use(function(err, req, res, next) {

    logger.error(err.stack);
    var errObj = {
        status: 500,
        error: true,
        // errorName: err.name,
        // errorType: err.type,
        // errrorMessage: err.message,
        description: err.toString()
    };
    var stringifiedResponse = JSON.stringify(errObj);

    res.status(500).json(errObj);
});


/*Starting the server*/

httpServer.listen(nconf.get('httpPort'));
httpsServer.listen(nconf.get('httpsPort'));
logger.info('HTTP Server Initiated on port %s at %s : ', httpServer.address().port, httpServer.address().address);
logger.info('HTTPS Server Initiated on port %s at %s : ', httpsServer.address().port, httpsServer.address().address);


// TODO - find where these methods are used
/*
function sendResponse(json, handler, object) {
    var arr = object[handler]().split(",");
    var arr_length = arr.length;
    var returnJson = {};
    for (var i = 0; i < arr_length; i++) {
        var new_arr = arr[i].split('|');
        returnJson[new_arr[0]] = json[new_arr[1]];
    }
    return JSON.stringify(returnJson);
}

 // Special character escaping for json
function jsonEscape(str) {
    return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
}
*/
