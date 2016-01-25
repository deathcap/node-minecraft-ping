# mcping16

Sends a [server list ping](http://wiki.vg/Server_List_Ping#1.6) packet to pre-Netty Minecraft servers (1.6.4, 1.5.2, 1.4.4)

For 1.7+ and later, try [node-minecraft-protocol](https://github.com/PrismarineJS/node-minecraft-protocol)'s ping instead.

Usage:

    node mcping16.js localhost 25565

Example responses:

```javascript
{
  pingVersion: 1,
  protocolVersion: 78,
  gameVersion: '1.6.4',
  motd: 'A Minecraft Server',
  playersOnline: 0,
  maxPlayers: 2
}

{
  pingVersion: 1,
  protocolVersion: 61,
  gameVersion: '1.5.2',
  motd: 'A Minecraft Server',
  playersOnline: 0,
  maxPlayers: 2
}

{
  pingVersion: 1,
  protocolVersion: 49,
  gameVersion: '1.4.4',
  motd: 'A Minecraft Server',
  playersOnline: 0,
  maxPlayers: 2
}
```

## License

MIT

