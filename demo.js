'use strict';

const mcping = require('./');

if (process.argv.length < 4) {
  console.log('Usage: node demo.js <host> <port>');
  process.exit(1);
}

const host = process.argv[2];
const port = parseInt(process.argv[3]);

mcping.ping_all({host, port}, function(err, response, type) {
  if (err) {
    console.log('ping '+type+' error',err);
    return;
  }
  console.log('received ping_'+type,response);
});
