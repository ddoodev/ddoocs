# Getting Started
The first question that confronts you: what do you want to build?
If this is something huge, a project that should use the advantages of discordoo to the maximum, we recommend going to the [section for the framework](#framework). If not, start with a simple installation:
```shell
npm i discordoo
```
or
```shell
yarn add discordoo
```

### Very Beginning
The basic discordoo is very similar in appearance to discord.js/eris. However, there are a few differences:
```ts
import { DiscordFactory } from 'discordoo'

const app = DiscordFactory.create('token')

app.on('ready', () => {
  console.log('ready')
})

app.start()
```
The first thing that catches your eye: the absence of a Client and the use of some kind of factory. If you click on the name inside the import, you will be redirected to the page with the api reference for this class, and you will immediately be horrified by the amount of text there.
This is because discordoo lacks the concept of a client, it is replaced by an application and divided into several layers. In the api reference of this class, you may notice that there is not one create method, but several. The fact is that an application can be created without being forced to use everything at once: gateway, reset and cache. Instead, for example, you can completely abandon the gateway and use the rest-only version if, for example, your application works through HTTP interactions.

### Contexts and Events
Let's get back to the topic. The main differences are in the structure of interaction with the library, or rather, with its architectural features: async cache and the concept of context.
```ts
import { DiscordFactory, IntentsUtil } from 'discordoo'

DiscordFactory.create('token', { // ApplicationOptions are passed here
    gateway: { // GatewayOptions
        intents: IntentsUtil.ALL
    }
})

// messageCreate is one of the >> events <<
app.on('messageCreate', (ctx) => {
    const { message: msg } = ctx // MessageCreateEventContext

    if (msg.content === '!ping') {
        msg.reply(`pong! ${ctx.app.gateway.ping()}ms`)
    }
})

app.start()
    .then(() => console.log('ready'))
```

## Framework
TODO !
