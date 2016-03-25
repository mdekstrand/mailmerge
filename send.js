#!/usr/bin/env node
"use strict";
const program = require('commander');
const nodemailer = require('nodemailer');
const recipients = require('./src/load-recipients');
const Message = require('./src/message');
const mailMerge = require('./src/mailmerge');
const async = require('async');
const logger = require('glogg')('mailmerge');

program.version('0.0.1')
    .option('--sendmail <path>', 'Use sendmail at [path]')
    .option('-r, --recipients <file>', 'Load recipient data from <file>')
    .parse(process.argv);

logger.on('info', (msg) => {
  console.info(msg);
});
logger.on('warn', (msg) => {
  console.warn(msg);
});
logger.on('error', (msg) => {
  console.error(msg);
});

var mf = program.args[0];

var mailer;
if (program.sendmail) {
  var sendmail = require('nodemailer-sendmail-transport');
  logger.info('using mailer %s in sendmail mode', program.sendmail);
  mailer = nodemailer.createTransport(sendmail(program.sendmail));
} else {
  logger.error('no mailer configured');
  process.exit(2);
}

async.parallel({
  message: (cb) => Message.load(mf, cb),
  recipients: loadRecipients
}, (err, data) => {
  if (err) throw err;
  mailMerge.mergeAndSend(mailer, data.message, data.recipients, (err) => {
    if (err) throw err;
  });
});

function loadRecipients(cb) {
  if (program.recipients) {
    recipients.jsonLines(program.recipients, cb);
  } else {
    cb(null, program.args.slice(1).map((r) => ({to: r})));
  }
}