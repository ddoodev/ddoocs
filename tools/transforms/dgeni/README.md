# Overview

All the content that is rendered by the AIO application, and some of its configuration files, are
generated from source files by [Dgeni](https://github.com/angular/dgeni). Dgeni is a general purpose
documentation generation tool.

Markdown files in `content`, code comments in the core source files are processed and transformed 
into files that are consumed by the AIO application.

Dgeni is configured by "packages", which contain services and processors. Some of these packages are
installed as `node_modules` from the [dgeni-packages](https://github.com/angular/dgeni-packages) and
some are specific to the AIO project.

The project specific packages are stored in this folder (`tools/transforms/dgeni`).

## Root packages

To run Dgeni, you must specify a root package, which acts as the entry point to the documentation
generation.
This root package, in turn requires a number of other packages, some are defined locally in the
`tools/transforms/dgeni` folder, such as `tools/transforms/dgeni/content-package`, etc. 
And some are brought in from the `dgeni-packages` node modules, such as `jsdoc` and `nunjucks`.

* The primary root package is defined in `tools/transforms/dgeni/angular.io-package/index.js`. 
This package is used to run a full generation of all the documentation.
* There are also root packages defined in `tools/transforms/dgeni/authors-package/*-package.js`. These
packages are used by the documentation authors when writing docs, since it allows them to run partial
doc generation, which is not complete but is faster for quickly seeing changes to the document that
you are working on.

## Other packages

* angular-base-package
* angular-api-package
* angular-content-package
* content-package
* links-package
* post-process-package
* remark-package
* target-package

## Templates

All the templates for the dgeni transformations are stored in the `tools/transforms/dgeni/templates`
folder. See the [README](templates/README.md).
