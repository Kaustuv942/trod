const { createLogger, format, transports } = require("winston");
 
const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};
 
const log = createLogger({
    level: "trace",
    levels: logLevels,
    transports: [new transports.Console()],
});

module.exports = {
    log
}

