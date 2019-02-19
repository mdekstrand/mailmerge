const fs = require('fs');
const split = require('binary-split');
const miss = require('mississippi');

function loadJSONLines(file, callback) {
  var lines = [];

  miss.pipe([
    fs.createReadStream(file),
    split(),
    miss.through.obj((line, enc, cb) => cb(null, JSON.parse(line))),
    miss.to.obj((line, enc, cb) => {lines.push(line); cb()})
  ], (err) => {
    callback(err, lines);
  });
}

module.exports = {
  jsonLines: loadJSONLines
};