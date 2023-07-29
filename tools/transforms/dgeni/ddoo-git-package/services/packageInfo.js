'use strict';

const path = require('canonical-path');
const {PROJECT_ROOT, config} = require('../../../config');

/**
 * Load information about this project from the package.json
 * @return {Object} The package information
 */
module.exports = function packageInfo() {
  return require(path.resolve(PROJECT_ROOT, 'repos', config.mainRepositoryName , 'package.json'));
};
