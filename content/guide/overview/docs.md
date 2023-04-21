# Documentation Features
For your convenience, there are several useful functions in our documentation.

## Instant API Reference
You can click on the component name to go to the page with the api reference of this component. For example, you can click on the _MessageEmbedBuilder_ component in the following code snippet:
```ts
import { MessageEmbedBuilder } from 'discordoo'
```
or _MessageCreateEventContext_ in the following code snippet:
```ts
app.on('messageCreate', (context: MessageCreateEventContext) => {
    context.message.reply('pong!')
})
```
or > `Message` <

or _GatewayOptions_ and _IntentsUtil_:
```ts
const app = DiscordFactory.create('discord-bot-token', {
    gateway: { // GatewayOptions
        intents: IntentsUtil.ALL
    }
})
```
this also works inside the [API Reference](/ref).

## Powerful Search
You can search for any component in the documentation and guide using the search bar in the top right corner of the page.
Use `/` to focus on the search bar.


## Thanks
This documentation was made possible thanks to the RxJS team for their [documentation](https://rxjs.dev/) and 
[source code](https://github.com/ReactiveX/rxjs/tree/master/docs_app) which was used as a basis for this documentation.
