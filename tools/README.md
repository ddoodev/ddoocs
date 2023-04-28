# Project tooling

This document gives an overview of the tools that we use to generate the content for the 
Discordoo documentation website.

The application that actually renders this content can be found in the `src` folder.
The handwritten content can be found in the `content` folder.

Each subfolder in this `/docs_app/tools/` folder contains a self-contained tool and its configuration. 
There is a `README.md` file in each folder that describes the tool in more detail.

## transforms

All the content that is rendered by the Discordoo docs application, and some of its configuration files,
are generated from source files by internal transformers and [Dgeni](https://github.com/angular/dgeni). 
Dgeni is a general purpose documentation generation tool.

Markdown files in `content`, code comments in the core Angular source files and example
files are processed and transformed into files that are consumed by the Discordoo docs application.

Dgeni is configured by "packages", which contain services and processors. Some of these packages are
installed as `node_modules` from the [dgeni-packages](https://github.com/angular/dgeni-packages)

See the [README.md](transforms/dgeni/README.md) for more details about Dgeni generation.
