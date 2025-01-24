require('dotenv').config()
if (process.env.NODE_ENV == 'development' || 'test')
    module.exports = require('./dev.config');