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
  //socket.write(new Buffer('fefd090000000000000000', 'hex')); // the 2011 beta 1.9 query protocol from https://dinnerbone.com/blog/2011/10/14/minecraft-19-has-rcon-and-query/
    // http://wiki.vg/Server_List_Ping#1.4_to_1.5
    // "Prior to the Minecraft 1.6, the client to server operation is much simpler, and only sends FE 01, with none of the following data."
    // since it could be any version earlier, assume the latest
  //socket.write(new Buffer('fe01', 'hex'));
  socket.write(new Buffer('fe01fa000b004D0043007C00500069006E00670048006F00730074','hex'));
});
socket.on('end', () => {
  console.log('ended');
});
socket.on('data', (raw) => {
  console.log('data',raw);
  const packetID = raw.readUInt8(0);
  if (packetID !== 0xff) {
    throw new Error('unexpected packet id');
  }
  const length = raw.slice(1).readUInt16BE(); // in UCS-2/UTF-16 characters

  const string = raw.slice(4).toString('ucs2');
  console.log('response string',string);
  let result = {};

  if (string[0] == '\xa7') {
    // https://gist.github.com/Jckf/4574114#file-minecraftserver-java-L170
    const parts = string.split('\0');
    console.log(parts);
    result.pingVersion = parseInt(parts[0].slice(1));
    result.protocolVersion = parseInt(parts[1]);
    result.gameVersion = parts[2];
    result.motd = parts[3];
    result.playersOnline = parseInt(parts[4]);
    result.maxPlayers = parseInt(parts[5]);
  } else {
    // 0xfe 0xfd response lacks game version, so assume a reasonably old one
    result.pingVersion = 0;
    result.gameVersion = '1.5.2';
    result.protocolVersion = 61; // https://github.com/PrismarineJS/minecraft-data/pull/92/files#diff-0ccb8c9bf6497574bdc134eb428dc649R782

    const parts = string.split('\xa7');
    result.motd = parts[0];
    result.playersOnline = parseInt(parts[1]);
    result.maxPlayers = parseInt(parts[2]);
  }
  console.log('result',result);
});
