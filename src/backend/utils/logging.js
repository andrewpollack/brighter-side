module.exports = {
    timestampedLog: function (message) {
        date_string = new Date().toLocaleString();
        console.log(`[${date_string}]: ${message}`);
    }
};
