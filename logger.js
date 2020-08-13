const log4js = require('log4js')
const path = require('path')

function getCommonAppender(pathSeg) {
  return {
    type: 'dateFile',
    filename: path.resolve(__dirname, 'logs', pathSeg, 'logging.log'),
    maxLogSize: 1024 * 1024,
    keepFileExt: true,
    daysToKeep: 3,
    layout: {
      type: 'pattern',
      pattern: '%c [%d{yyyy-MM-dd hh:mm:ss}] [%p]: %m%n'
    }
  }
}
log4js.configure({
  appenders: {
    db: getCommonAppender('db'),
    default: {
      type: 'stdout'
    },
    api: getCommonAppender('api')
  },
  categories: {
    db: {
      appenders: ['db'],
      level: 'all'
    },
    default: {
      appenders: ['default'],
      level: 'all'
    },  
    api: {
      appenders: ['api'],
      level: 'all'
    }
  }
})

process.on('exit', () => {
  log4js.shutdown()
})
exports.dbLogger = log4js.getLogger('db')
exports.logger = log4js.getLogger()
exports.apiLogger = log4js.getLogger('api')
