const _ = require('lodash');

const log = {};

// The service/app is going to stop or become unusable now. An operator should definitely look into this soon.
log.FATAL = 5;
// Fatal for a particular request, but the service/app continues servicing other requests.
// An operator should look at this soon(ish).
log.ERROR = 4;
// A note on something that should probably be looked at by an operator eventually.
log.WARN = 3;
// Detail on regular operation.
log.INFO = 2;
// Anything else, i.e. too verbose to be included in 'info' level.
log.DEBUG = 1;
// Very detailed application logging.
log.TRACE = 0;

var _level;

log.level = function (level) {
    if (!_.isInteger(level)) {
        return _level;
    }
    if (level < log.TRACE || level > log.FATAL) {
        throw new Error('level must be in range [' + log.TRACE + '-' + log.FATAL + '], got: ' + level);
    }

    _level = level;

    log.fatal = (level <= log.FATAL) ? console.trace.bind(console) : _.noop;
    log.error = (level <= log.ERROR) ? console.error.bind(console) : _.noop;
    log.warn = (level <= log.WARN) ? console.warn.bind(console) : _.noop;
    log.info = (level <= log.INFO) ? console.info.bind(console) : _.noop;
    log.debug = (level <= log.DEBUG) ? console.log.bind(console) : _.noop;
    log.trace = (level <= log.TRACE) ? console.log.bind(console) : _.noop;
};

// set default level to INFO
log.level(log.INFO);

process.on('uncaughtException', function (err) {
    log.error('uncaughtException:', _.get(err, 'stack', err));
});
process.on('unhandledRejection', function (reason, p) {
    log.error('unhandledRejection promise:', p, '\nreason:', _.get(reason, 'stack', reason));
});

module.exports = log;