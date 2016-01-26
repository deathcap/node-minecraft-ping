# mcping16

Sends a [server list ping](http://wiki.vg/Server_List_Ping#1.6) packet to pre-Netty Minecraft servers (1.6.4, 1.5.2, 1.4.4)

For 1.7+ and later, try [node-minecraft-protocol](https://github.com/PrismarineJS/node-minecraft-protocol)'s ping instead.

Usage:

    require('mcping16').ping_fe01({host:'localhost', port:25565}, function(err, response) {
      console.log(err, response);
    });

    require('mcping16').ping_fefd_udp({host:'localhost', port:25565}, function(err, response) {
      console.log(err, response);
    });

Example:

    node demo.js localhost 25565

Example responses from `ping_fe01`:

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

fe01 is a "legacy" ping but supported even on vanilla Minecraft 1.8.9 servers.

Example response from `ping\_fefd\_udp`:

```javascript
{ worldHeight: 128,
  motd: 'A Minecraft Server',
  gameType: 'SMP',
  gameName: 'MINECRAFT',
  gameVersion: '1.5.2',
  plugins: 'CraftBukkit on Bukkit 1.5.2-R1.1-SNAPSHOT: MultiWorld 4.5.4; SilkSpawners 3.2.2; OpenInv 2.0.2; EnchantMore 2.0; WorldEdit 5.5.6',
  defaultWorld: 'world',
  numPlayers: 0,
  maxPlayers: 20,
  port: 25565,
  host: '0.0.0.0'
}
```

fefd_udp works on 1.5.2 but not newer (TODO: exact versions), and lacks the protocolVersion of fe01.

There is also a fefd_tcp ping, but it returns only the MOTD and player count so it is not exposed by this module.

## License

MIT

