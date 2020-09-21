/**
 * Prints out the message with timestamp beforehand
 *  e.g. [9/19/2020, 6:47:47 PM]: MESSAGE.
 * @param {String} message
 */
function timestampedLog(message) {
  dateString = new Date().toLocaleString();
  console.log(`[${dateString}]: ${message}.`);
}

/**
 * Prints out the endpoint and related message
 * @param {String} endpoint
 * @param {String} message
 */
function logEndpoint(endpoint, message) {
  timestampedLog(`${endpoint} ${message}`);
}

module.exports = {
  timestampedLog: timestampedLog,
  logEndpoint: logEndpoint,
};
