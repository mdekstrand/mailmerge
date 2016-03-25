"use strict";
const fs = require('fs');
const extend = require('extend');
const yaml = require('js-yaml');
const mustache = require('mustache');

class Message {
  /**
   * Create a new message object.
   * @param meta The message metadata.
   * @param body The message body.
   */
  constructor(meta, body) {
    this.meta = meta;
    this.body = body;
  }

  merge(params) {
    var obj = extend({}, this.meta, params);
    return new Message(obj, this.body);
  }

  get subject() {
    return mustache.render(this.meta.subject, this.meta);
  }

  get renderedBody() {
    return mustache.render(this.body, this.meta);
  }

  /**
   * Load a message from a file.
   * @param {string} file The file to load.
   * @param callback The callback to call when finished.
   */
  static load(file, callback) {
    fs.readFile(file, (err, text) => {
      if (err) return callback(err);
      var headerRE = /^---\r?\n^((?:.|\r?\n)*?)^---\s*\r?\n/m;
      var bodyText = text.toString('utf8');
      var m = bodyText.match(headerRE);
      if (m == null) {
        return callback(new Error("cannot parse YAML header"));
      }
      var meta = yaml.safeLoad(m[1]);
      var body = bodyText.slice(m[0].length);
      callback(null, new Message(meta, body));
    });
  };
}

module.exports = Message;