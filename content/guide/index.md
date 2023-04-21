# Introduction
Discordoo is a library for building scalable [Discord](https://discord.com) Apps with your favorite javascript runtime. It is built from ground up to be fast, reliable and easy to use. It is written in [TypeScript](https://typescriptlang.org) (yet still allows developers to code in pure JavaScript) and has a lot of features that will help you to build your own Discord App. **The library is under development and is not in the production-ready state.**

## Philosophy
At Discordoo, we rethought the concept of a Discord bot and came to the conclusion that a Discord bot does not differ much from an HTTP REST backend in its essence. The key similarity between a backend and a Discord bot is that both respond to requests. The difference is that a backend responds to HTTP requests, while a Discord bot responds to Discord gateway events or even Discord's HTTP requests via Discord's HTTP API. Therefore, we took and brought familiar concepts from backends to the library for Discord like dependency injection, providers, controllers, etc.

While there are already projects like [Necord](https://github.com/necordjs/necord), they use libraries created long ago like discord.js and eris under the hood, which due to problems with architecture cannot offer the same as us. Also, such projects are mostly based on NestJS, which is just not designed for such things. We decided to fix it all.

Our library is architecturally built in such a way as to fit any task of any developer in Discord, if they want to work with the Discord API. We have introduced the concept of cache, rest and gateway providers. This allows you to use any cache, rest or gateway provider you want. This means that you can not build your project as an add-on over the library, overcoming problems such as the lack of the ability to use Redis as a cache, but just do it.

## One more thing
It was mentioned above about dependency injection. The fact is that discordoo is just a basic library for working with the Discord API, although very pumped, but still similar to the discord.js/eris. But we have a framework that is built on top of discordoo, which is called [waifoo](https://github.com/ddoodev/waifoo). In turn, this framework provides the nest-like experience. We decided to separate the library and the framework so that developers who do not need the framework can use the library, and developers who need the framework can use it. **Quick remind: the library and framework are under development and are not ready for use in production code.**

## Getting Started
Go to the [getting started](/guide/start) page.
