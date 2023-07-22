# Usage
TODO, but for now, some examples:
```ts
const app = DiscordFactory.createRest('discord-bot-token', {
  rest: {
    listen: {
      host: '0.0.0.0',
      port: 8379,
      path: 'server'
    }
  }
})

app.on('interactionCreate', (context: InteractionCreateEventContext) => {
  const { interaction } = context

  if (!interaction.isAppCommand()) return

  if (interaction.data.name === 'ping')
    interaction.reply('pong!')
})

app.start()
  .then(() => console.log('started with rest only client:', app.user.tag))
```
```ts
const app = DiscordFactory.create('discord-bot-token', {
  providers: [
    // example: get events from queue
    { provide: DiscordooProviders.Gateway, useClass: KafkaGatewayProviderReceiver },
    // example: use redis as cache storage
    { provide: DiscordooProviders.Cache, useClass: RedisCacheProvider }
  ]
})


app.on('messageCreate', context => { // the event came from the broker
  const { message: msg } = context

  if (msg.content === '!ping') {
    msg.reply('pong!')
  }
})

app.start()
```
```ts
const app = DiscordFactory.create('discord-bot-token', {
  cache: {
    global: {
      policies: [ GlobalCachingPolicy.None ]
    }
  }
})

app.start()
  .then(async () => {
    let caches = await Promise.all([
        app.channels.cache.size(), app.guilds.cache.size(), app.users.cache.size() 
    ])

    console.log('cached', caches[0], 'channels,', caches[1], 'guilds and', caches[2], 'users.')
    // cached 0 channels, 0 guilds and 0 users.
  })
```
