'use strict';

const net = require('net');
const process = require('process');
const ProtoDef = require('protodef').ProtoDef;

if (process.argv.length < 4) {
  console.log('Usage: node mcping16.js <host> <port>');
  process.exit(1);
}

const host = process.argv[2];
const port = parseInt(process.argv[3]);

const proto = new ProtoDef();

const socket = net.connect(port, host);
socket.on('connect', () => {
  console.log('connected');

  // request challenge token
  // TODO: encode/decode using protodef
  socket.write(new Buffer('fefd090000000000000000', 'hex'));
});
socket.on('end', () => {
  console.log('ended');
});
socket.on('data', (raw) => {
  console.log('data',raw);
  console.log(raw.toString());
});
