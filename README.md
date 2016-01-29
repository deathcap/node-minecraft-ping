# node-minecraft-ping

Sends a [server list ping](http://wiki.vg/Server_List_Ping#1.6) packet to Minecraft servers

Usage:

    require('minecraft-ping').ping_fe01fa({host:'localhost', port:25565}, function(err, response) {
      console.log(err, response);
    });

Several pings are supported. Version compatibility:

| Minecraft Version | ping_fe01fa   | ping_fe01     | ping_fe       | Netty status ping(*)
| -------------     | ------------- | ------------- | ------------- | -------------
| 1.9               | YES           | YES           | Limited       | YES
| 1.8.9             | YES           | YES           | Limited       | YES
| 1.7.10            | YES           | YES           | Limited       | YES
| 1.6.4             | YES           | Slow          | Limited, Slow | NO
| 1.5.2             | YES           | YES           | Limited, Slow | NO
| 1.4.4             | YES           | YES           | Limited, Slow | NO
| 1.3.2             | NO            | Limited       | Limited       | NO
| 1.2.5             | NO            | Limited       | Limited       | NO
| earlier           | NO            | maybe         | probably      | NO

(*) As implemented in [node-minecraft-protocol](https://github.com/PrismarineJS/node-minecraft-protocol) src/ping.js

(**) Limited = responds but does not return the game/protocol version

Example:

    node demo.js localhost 25565

### ping_fe01a

`ping_fe01a` is the best general-purpose ping on most servers. It includes `MC|PingHost`,
for efficient 1.6.4 compatibility (but ≤1.3.2 incompatibility). You can use it on old servers
starting with 1.4.4 at the earliest, then 1.5.2 and 1.6.4, and it even works on Netty-based
1.7.10, 1.8.9, and 1.9 servers. The protocol and game version is included in the ping so you
can tell what protocol to speak to it. Example responses from `ping_fe01fa`:

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

`ping_fe01fa` does not support 1.3.2 and 1.2.5

### ping_fe01



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

