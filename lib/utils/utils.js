var nconf = require('nconf');

//Application configuration environment file
nconf.argv()
    .env()
    .file({
        file: './config/app-config.json'
    });

/*module.exports.helperModule = {

    varName: "",

    methodName: function() {
        return val;
    },

};*/
