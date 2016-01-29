'use strict';

const mcping = require('./');

if (process.argv.length < 4) {
  console.log('Usage: node demo.js <host> <port>');
  process.exit(1);
}

const host = process.argv[2];
const port = parseInt(process.argv[3]);

mcping.ping_fe01fa({host, port}, function(err, response) {
  if (err) {
    console.log('ping_fe01fa error',err);
    return;
  }

  console.log('received ping_fe01fa',response);
});

mcping.ping_fefd_udp({host, port}, function(err, response) {
  if (err) {
    console.log('ping_fefd_udp error',err);
    return;
  }
  console.log('received ping_fefd_udp',response);
});

mcping.ping_fe({host, port}, function(err, response) {
  if (err) {
    console.log('ping_fe error',err);
    return;
  }

  console.log('received ping_fe',response);
});
