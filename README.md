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

### ping_fe01fa

`ping_fe01fa` is the best general-purpose ping for most use cases, where a fast response and
reasonable version compatibility is required. It includes `MC|PingHost`,
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

`ping_fe01fa` does not support 1.3.2 and 1.2.5.

### ping_fe01

`ping_fe01` is similar to `ping_fe01fa`, but without the `MC|PingHost` channel. The missing
`MC|PingHost` means it will respond slowly on 1.6.4 servers, but this has the advantage of
not confusing 1.3.2 and 1.2.5 servers with the extra data.

However, 1.3.2 and 1.2.5 servers respond only with limited information (no protocol payload,
only server message of the day description, number of online players, and maximum player count).
1.7.10 and above will respond quickly and include the full response, including protocol version.

If you need to support arbitrarily old versions, but do not mind the slow 1.6.4 response (for example,
if you're sending a batch of ping requests over a long period of time), `ping_fe01` may be a good choice.

### ping_fe

`ping_fe` sends nothing more than a single 0xfe byte, and only returns `motd`, `playersOnline`, and
`maxPlayers`. No protocol or game version. However it works even on 1.2.5 and 1.3.2. It will also
work on 1.4.4, 1.5.2, and 1.6.4, but is noticeably slower than `ping_fe01`. On 1.7.10, 1.8.9, and 1.9
it responds quicker, but still lacks the protocol information also returned in `ping_fe01`.

If all you need is the server description, and do not mind the slowness of 1.6.4/1.5.2/1.4.4, consider
`ping_fe`. It is not very useful in most situations, better served by `ping_fe01fa` or `ping_fe01`.


### ping_fefd_udp

`ping_fefd_udp` is a multi-step UDP-based query protocol described in 2011 at
https://dinnerbone.com/blog/2011/10/14/minecraft-19-has-rcon-and-query (for Minecraft 1.9 *beta*).

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

It can be used to query modified servers, such as CraftBukkit, in order to get their installed plugins.
Unlike the fe pings, it does not include the protocol version, though it does include the game version.

On vanilla servers, support can be enabled by setting `enable-query=true` in `server.properties`
(and optionally `query.port`, which defaults to the same as `server-port`). If enabled, the server will log:

```
2016-01-30 11:28:10 [INFO] Starting GS4 status listener
2016-01-30 11:28:11 [INFO] Setting default query port to 25565
2016-01-30 11:28:11 [INFO] Query running on 0.0.0.0:25565
```

where GS4 is apparently the "GameSpy4" protocol. Since it is off by default, you'll probably
not need to use `ping_fefd_udp` except in very specialized situations.

### ping_all

`ping_all` sends all of the types of pings, and calls the callback multiple times.
You can get the ping type with the third argument in the callback function.

Note: synchronizing and waiting for each of the pings is currently out of the scope
of this module (see https://github.com/deathcap/node-minecraft-ping/issues/4),
in general it is preferrable to use only one ping type (suggestion: `ping_fe01fa`).

## License

MIT

