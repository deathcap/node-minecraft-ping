# node-minecraft-ping

Sends a [server list ping](http://wiki.vg/Server_List_Ping#1.6) packet to Minecraft servers

For 1.7+ and later, also try [node-minecraft-protocol](https://github.com/PrismarineJS/node-minecraft-protocol)'s ping.

Usage:

    require('minecraft-ping').ping_fe01({host:'localhost', port:25565}, function(err, response) {
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

fe01 is a "legacy" ping but supported even on vanilla Minecraft 1.8.9 servers. It has been tested on
1.4.4, 1.5.2, 1.6.4, 1.7.10, 1.8.9, and 1.9 snapshot. `ping_fe01` includes `MC|PingHost` for efficient
1.6.4 pings as well. It does not support 1.3.2 and 1.2.5.

## ping_fe

`ping_fe` sends nothing more than a single 0xfe byte, and only returns `motd`, `playersOnline`, and
`maxPlayers`. No protocol or game version. However it works even on 1.2.5 and 1.3.2. It will also
work on 1.4.4, 1.5.2, and 1.6.4, but is noticeably slower than `ping_fe01`. On 1.7.10, 1.8.9, and 1.9
it responds quicker, but still lacks the protocol information also returned in `ping_fe01`.


## ping_fefd_udp

    require('minecraft-ping').ping_fefd_udp({host:'localhost', port:25565}, function(err, response) {
      console.log(err, response);
    });

Example response from `ping_fefd_udp`:

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

## License

MIT

