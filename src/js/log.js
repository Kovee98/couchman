/*
    Log levels (what logs to show):
        1 - error
        2 - error, warn
        3 - error, warn, info

    When to use:
        error - problem needing attention/investiagtion
        warn  - might be a problem, might not (heads up)
        info  - important/useful information (most common)
*/

/* eslint-disable no-console */
let log = {
    level: 1,
    error: (...args) => {
        if (log.level >= 0) {
            console.error(...args);
        }
    },
    warn: (...args) => {
        if (log.level >= 1) {
            console.warn(...args);
        }
    },
    info: (...args) => {
        if (log.level >= 2) {
            console.info(...args);
        }
    }
};

export default log;
