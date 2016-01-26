'use strict';

const net = require('net');
const dgram = require('dgram');
const process = require('process');
const ProtoDef = require('protodef').ProtoDef;

if (process.argv.length < 4) {
  console.log('Usage: node mcping16.js <host> <port>');
  process.exit(1);
}

const host = process.argv[2];
const port = parseInt(process.argv[3]);

//const proto = new ProtoDef(); // TODO

//ping_fe01(host, port);
ping_fefd_udp(host, port);

// the 2011 beta 1.9 query protocol from https://dinnerbone.com/blog/2011/10/14/minecraft-19-has-rcon-and-query
function ping_fefd_udp(host, port) {
  const udp = dgram.createSocket('udp4');

  console.log('udp ping');

  const STARTED = 0;
  const SENT_CHALLENGE_REQUEST = 1;
  const SENT_STATUS_REQUEST = 2;
  const DONE = 3;
  let state = 0;

  udp.on('error', (err) => {
    console.log(`udp error:\n${err.stack}`);
    udp.close();
  });

  udp.on('message', (msg, rinfo) => {
    console.log(msg);
    //console.log(`udp got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    if (state === STARTED) {
      console.log('received unexpected packet before sent anything');
      return;
    } else if (state === SENT_CHALLENGE_REQUEST) {
      // challenge token
      // 09          challenge type
      // 00 00 00 00 id token (sent all zeros)
      // xx xx xx xx new challenge token
      if (msg[0] != 0x09) {
        console.log('unexpected packet received after sent challenge request');
        return;
      }
      // challenge token is received as ASCII decimal string, but replied as encoded uint32be
      const challengeTokenString = msg.slice(5).toString();
      const challengeTokenInt = parseInt(challengeTokenString);
      console.log('challenge token: '+challengeTokenInt);
      const challengeTokenBuffer = new Buffer(4);
      challengeTokenBuffer.writeUInt32BE(challengeTokenInt);

      const statusRequest = new Buffer(
        'fefd'+ // magic
        '00'+   // status type
        '00000000'+ // id token
        challengeTokenBuffer.toString('hex')+ // challenge token
        '00000000', // id token, again (extended status request)
        'hex');

      console.log('requesting status');
      //console.log(statusRequest.toString('hex'));
      udp.send(statusRequest, 0, statusRequest.length, port, host, function() {
        state = SENT_STATUS_REQUEST;
      });
    } else if (state === SENT_STATUS_REQUEST) {
      //console.log('response', msg);
      //console.log('response', msg.toString('hex'));
      //console.log('response', msg.toString());
      const array = msg.toString().split('\0');
      //console.log(array);
      let result = {};
      // example response array, some fields are not fixed strings
      // ['', '', '', '', '', 'splitnum', '\x80', 'hostname', 'A Minecraft Server', 'gametype', 'SMP', 'game_id', 'MINECRAFT', 'version', '1.5.2', 'plugins', 'CraftBukkit on Bukkit 1.5.2-R1.1-SNAPSHOT: MultiWorld 4.5.4; SilkSpawners 3.2.2; OpenInv 2.0.2; EnchantMore 2.0; WorldEdit 5.5.6', 'map', 'world', 'numplayers', '0', 'maxplayers', '20', 'hostport', '25565', 'hostip', '0.0.0.0', '', '\x01player_', '', '', '']
      result.worldHeight = array[6].charCodeAt(0);
      result.motd = array[8];
      result.gameType = array[10];
      result.gameName = array[12];
      result.gameVersion = array[14];
      result.plugins = array[16]; // TODO: decode structure, which is:  server-software: plugin1; plugin2; plugin3...
      result.defaultWorld = array[18];
      result.numPlayers = parseInt(array[20]);
      result.maxPlayers = parseInt(array[22]);
      result.port = parseInt(array[24]);
      result.host = array[26];
      // TODO: online players comes last, parse it
      console.log('result',result);
      state = DONE;
    }
  });

  udp.on('listening', () => {
    const address = udp.address();
    console.log(`udp listening ${address.address}:${address.port}`);

    // query request
    const request = new Buffer('fefd090000000000000000', 'hex');
    udp.send(request, 0, request.length, port, host, function() {
      state = SENT_CHALLENGE_REQUEST;
    });
  });

  udp.bind();
}

function ping_fefd_tcp(host, port) {
  const socket = net.connect(port, host);
  socket.on('connect', () => {
    console.log('connected');

    // request challenge token
    // TODO: encode/decode using protodef
    socket.write(new Buffer('fefd090000000000000000', 'hex'));
  });
  socket.on('data', (raw) => {
    console.log('data(fefd_tcp)', raw);
    console.log(raw.toString());
    // kinda useless, returns not very useful information, example: (redundant with ping_fe01)
    // ['\xff\x16A Minecraft Server', '0', '20']
  });
}

function ping_fe01(host, port) {
  const socket = net.connect(port, host);
  socket.on('connect', () => {
    console.log('connected');

    // MC|PingHost compatible with 1.6.4, 1.5.2, 1.4.4
    // TODO: extended ping for getting plugin list? see https://github.com/Dinnerbone/mcstatus/commit/6b6a5659156785bcaaa75980782215f777bd5b97 it gets more
    socket.write(new Buffer('fe01'+
        'fa'+ // plugin message
        '000b'+'004D0043007C00500069006E00670048006F00730074'+ // MC|PingHost,
        '0007'+ // 7+len(hostname)
        '4a'+   // protocol version (74, last)
        '0000'+''+ // hostname TODO
        '00000000' // port TODO
        ,'hex'));
  });
  socket.on('end', () => {
    console.log('ended');
  });
  socket.on('data', (raw) => {
    console.log('data(fe01)',raw);
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
    // TODO: callback
  });
}


