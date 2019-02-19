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
    .option('--server <url>', 'Use SMTP server at [url]')
    .option('--gmailaddress <gmail address>', 'Use GMail with specified address')
    .option('--gmailpassword <gmail password>', 'App password to go with specified GMail address (see https://support.google.com/accounts/answer/185833 on how to generate)')
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
} else if (program.server) {
  var smtp = require('nodemailer-smtp-transport');
  logger.info('using SMTP server');
  mailer = nodemailer.createTransport(smtp(program.server));
} else if (program.gmailaddress) {
  logger.info('using GMail');
  if (program.gmailpassword){
      var mailer = nodemailer.createTransport({
	    service: 'gmail',
	    auth: {
		  user: program.gmailaddress,
		  pass: program.gmailpassword
        }
      });
  } else {
      logger.error('using GMail requires a GMail app password (see: https://support.google.com/accounts/answer/185833)');
      process.exit(2);
  }
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
