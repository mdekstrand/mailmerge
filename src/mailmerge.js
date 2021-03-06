/**
 * Created by MichaelEkstrand on 3/25/2016.
 */
"use strict";
const mustache = require('mustache');
const fs = require('fs');
const extend = require('extend');
const async = require('async');
const logger = require('glogg')('mailmerge');

function mergeAndSend(mailer, message, recipients, callback) {
  let tasks = recipients.map((recip) => {
    let merged = message.merge(recip);
    let mail = extend({}, merged.meta, {
      subject: merged.subject,
      text: merged.renderedBody
    });
    logger.info('sending mail to %s', mail.to);
    return (cb) => mailer.sendMail(mail, cb);
  });
  async.parallel(tasks, callback);
}

module.exports = {
  mergeAndSend: mergeAndSend
};
