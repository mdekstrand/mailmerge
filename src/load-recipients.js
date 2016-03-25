const fs = require('fs');
const split = require('binary-split');
const miss = require('mississippi');

function loadJSONLines(file, callback) {
  var lines = [];
  var stream = miss.to((line, enc, cb) => {
    lines.push(JSON.parse(line));
    cb();
  }, () => {
    callback(null, lines);
  });

  fs.createReadStream(file)
      .pipe(split())
      .pipe(stream)
      .on('error', callback);
}

module.exports = {
  jsonLines: loadJSONLines
};