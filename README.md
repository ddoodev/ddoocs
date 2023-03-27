# ddoocs

## Description

This repository contains a documentation generator for ddoodev projects based on the `dgeni` 
package, as well as a viewing site created in Google, adapted by RxJS and then adapted by us,
the official documentation of all ddoodev projects `docs.ddoo.dev`.

## Installing

Clone and install project dependencies and then start a local server with the following terminal commands:

```
git clone --recurse-submodules https://github.com/ddoodev/ddoocs.git
npm run setup
npm start
```

## Using ServiceWorker locally

Running `npm run start` (even when explicitly targeting production mode) does not set up the
ServiceWorker. If you want to test the ServiceWorker locally, you can use `npm run build` and then
serve the files in `dist/` with `npm run http-server -- dist -p 4200`.

## Guide to authoring

There are two types of content in the documentation:

- **API docs**: descriptions of the modules, classes, interfaces, etc are generated directly from the source code.
  The source code of multiple repositories is located in the `ddoocs/repos` folder.
  Each API item may have a preceding comment, which contains JSDoc style tags and content.
  The content is written in markdown.

- **Other content**: guides and tutorials.
  All other content is written using markdown in text files, located in the `ddoocs/content` folder.

For contributing, see [Discordoo contribution guide](https://github.com/ddoodev/discordoo/blob/develop/CONTRIBUTING.md).

### Generating the complete docs

The main task for generating the docs is `npm run docs`. This will process all the source files (API and other),
extracting the documentation and generating JSON files that can be consumed by the doc-viewer.

## Disclaimer
Since this documentation is based on the documentation of the RXJS project, you can see some residual code from their repository. 
Information about the licensing of the project is in the LICENSE file.
