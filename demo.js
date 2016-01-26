'use strict';

const mcping16 = require('./');

if (process.argv.length < 4) {
  console.log('Usage: node demo.js <host> <port>');
  process.exit(1);
}

const host = process.argv[2];
const port = parseInt(process.argv[3]);

mcping16.ping_fe01({host, port}, function(err, response) {
  if (err) {
    console.log('ping_fe01 error',err);
    return;
  }

  console.log('received ping_fe01',response);
});

mcping16.ping_fefd_udp({host, port}, function(err, response) {
  if (err) {
    console.log('ping_fefd error',err);
    return;
  }
  console.log('received ping_fefd',response);
});