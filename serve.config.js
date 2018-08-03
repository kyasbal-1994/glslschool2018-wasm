const history = require('connect-history-api-fallback')
const convert = require('koa-connect')

module.exports = {
  host: '0.0.0.0',
  port: 3000,
  hotClient: {
    port: 3001
  },
  content: 'public',
  add: (app, middleware, options) => {
    const historyOptions = {
      // ... see: https://github.com/bripkens/connect-history-api-fallback#options
    }
    app.use(convert(history(historyOptions)))
  }
}
