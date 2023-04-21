# Events And Contexts
Since Discord is a realtime messenger, a lot of it is built on the concept of events.

## Events
Events are triggered when something happens in the Discord API. For example, when a message is sent, a `MESSAGE_CREATE` event is triggered. When a user joins a guild, a `GUILD_MEMBER_ADD` event is triggered.

We made a wrapper over these events:
```ts
const app = DiscordFactory.create('discord-bot-token')

app.on('messageCreate', ctx => {}) // the event came from the gateway through GatewayProvider
```
or you can use enum:
```ts
import { EventNames } from 'discordoo'

app.on(EventNames.MessageCreate, ctx => {})
```

## Contexts
A context (for example, `MessageCreateEventContext`) is an object created for each event.
It is built taking into account the principles of building the library and the Discord API.
Thus, if you take for example the context of the message creation event, you will see that the channel property is marked as optional there. This is due to the fact that Discord does not transmit the channel object along with the message, but only its ID. Therefore, the library will access the cache to find this channel. And if it doesn't find it, this property will remain empty. Properties not marked as optional are passed by discord and will always be present in the context.

```ts
app.on('messageCreate', (context: MessageCreateEventContext) => {
    // msg will always be present, but channel is optional, so use channelId instead
    const { message: msg, channelId } = context

    if (channelId === 'id' && msg.content === '!ping') {
        msg.reply('pong!')
    }
})
```

## Event List
Complete list of events & contexts for:
1. Cache Application: `AbstractApplicationEventsHandlers`
2. Rest+Cache Application: `RestApplicationEventsHandlers`
3. Gateway+Rest+Cache Application: `ApplicationEventsHandlers`
