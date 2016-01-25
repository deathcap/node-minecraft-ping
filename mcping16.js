'use strict';

const net = require('net');
const process = require('process');

if (process.argv.length < 4) {
  console.log('Usage: node mcping16.js <host> <port>');
  process.exit(1);
}

const host = process.argv[2];
const port = parseInt(process.argv[3]);

const MAGIC = new Buffer('\xfe\xfd');
const REQUEST_CHALLENGE = new Buffer('\x09');
const REQUEST_STATUS = new Buffer('\x00');

const socket = net.connect(port, host);
socket.on('connect', () => {
  console.log('connected');

  //TODO rquest challenge token
});
socket.on('end', () => {
  console.log('ended');
});
