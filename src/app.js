const express = require('express');
const morgan = require('morgan');
const helpmet = require('helmet');
const compression = require('compression');
const app = express();

// init midleware 
app.use(morgan('dev'));
app.use(helpmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

// init db 

require('./dbs/init.mongodb');
// const { checkOverload } = require('./helper/check.connect');
// checkOverload();



// init routes

app.use('', require('./routes'))

// handling error 

module.exports = app;