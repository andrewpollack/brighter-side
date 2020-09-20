
function timestampedLog(message) {
    date_string = new Date().toLocaleString();
    console.log(`[${date_string}]: ${message}.`);
}

module.exports = {
    timestampedLog: timestampedLog
};
