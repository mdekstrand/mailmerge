/**
 * Created by MichaelEkstrand on 3/25/2016.
 */
const Message = require('./src/message');
const mailmerge = require('./src/mailmerge');

module.exports = {
  Message: Message,
  mergeAndSend: mailmerge.mergeAndSend
};