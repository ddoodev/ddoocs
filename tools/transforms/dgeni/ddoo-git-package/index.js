'use strict';

const path = require('canonical-path');
const Package = require('dgeni').Package;
const basePackage = require('dgeni-packages/base');

/**
 * @dgPackage ddoo-git
 * @description
 * ddoo-git is a Dgeni git package with some patched services
 * for submodules structure
 */
module.exports = new Package('ddoo-git', [basePackage])
  .factory(require('./services/packageInfo'))
  .factory(require('dgeni-packages/git/services/decorateVersion'))
  .factory(require('dgeni-packages/git/services/getPreviousVersions'))
  .factory(require('dgeni-packages/git/services/gitData'))
  .factory(require('dgeni-packages/git/services/gitRepoInfo'))
  .factory(require('./services/versionInfo'))
  .config(function(renderDocsProcessor, gitData) {
    renderDocsProcessor.extraData.git = gitData;
  })
  .config(function(templateFinder) {
    templateFinder.templateFolders.unshift(path.resolve(__dirname, 'templates'));
  });

