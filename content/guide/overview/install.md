# Getting Started
[discordoo on npm](https://www.npmjs.com/package/discordoo)

[providers on npm](https://www.npmjs.com/package/@discordoo/providers)

## Runtime
You'll need to install the [NodeJS javascript runtime](https://nodejs.org/en/download) `v12.18` or newer. **Deno and Bun is not supported**, but we are planning to add support for [Bun javascript runtime](https://bun.sh) in the future, as soon as they add support for the `net` NodeJS API.

## Installation
You can install our library using the following command:
```shell
npm i discordoo
```
or
```shell
yard add discordoo
```

## TypeScript
If you plan using TypeScript, you'll need to install TypeScript version not lower than `4.4`.

## Dev Versions
You can install unstable versions of discordoo using the following command:
```shell
npm i discordoo@dev
```
Unstable versions of the library are created [automatically](https://github.com/ddoodev/discordoo/blob/develop/.github/workflows/publish.yml) from the `develop` branch code every Sunday around 02:30 UTC. Unstable versions of the library can also be published by developers on request or their wish. 
**It is not guaranteed that unstable versions of the library will work correctly and without errors.** It is not guaranteed that they will work at all if there is active work in the branch.

## Another Packages
If you plan to create a provider for discordoo and upload it to npm (for example), you can make your life easier by installing a package for providers separately:
```shell
npm i @discordoo/providers
```
Note that this package only makes sense if you use TypeScript and plan to publish your package to the public. Otherwise, just import the necessary interfaces from discordoo. Learn more about providers on the [Providers](/guide/overview/providers) page.
