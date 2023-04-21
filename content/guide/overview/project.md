# First Project
Before you start working with discordoo, you need to create a bot token. You can do this by following the instructions on the [Discord Developer Portal](https://discord.com/developers/applications).

## First Code
The code of the simplest bot with gateway, for example:
```ts
import { DiscordFactory, IntentsUtil } from 'discordoo'

const app = DiscordFactory.create('discord-bot-token', { // ApplicationOptions
    gateway: { // passing GatewayOptions
        intents: IntentsUtil.ALL // passing intents to work with all events
    }
})

app.on('messageCreate', context => { // MessageCreateEventContext
    const { message: msg } = context

    if (msg.content === '!ping') { // some kind of command
        // the latency is updated once every 40 seconds as soon as the heartbeat occurs
        msg.reply(`🏓 pong! ${app.gateway.ping}ms`)
    }
})

app.start()
    .then(() => console.log('started using profile with tag:', app.user.tag))
```
Several things happen when the start function is called:
* Providers initialization. This includes, for example, connecting to Redis, if applicable
* HTTP Request sent to the Discord API to get the [/gateway/bot](https://discord.com/developers/docs/topics/gateway#get-gateway-bot) endpoint, if applicable.
  * If gateway is not applicable, HTTP Request sent to the Discord API to get the [/users/@me](https://discord.com/developers/docs/resources/user#get-current-user) endpoint
  * If an invalid token is specified, an error will occur at this point
* Interprocess communication is connected if applicable
* The gateway provider is connected to the Discord API if applicable
* Promise resolves with the `DiscordApplication`
