/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const Package = require('dgeni').Package;
const basePackage = require('../angular-base-package');
const contentPackage = require('../content-package');

const { CONTENTS_PATH } = require('../../config');

module.exports = new Package('angular-content', [basePackage, contentPackage])

  // Where do we get the source files?
  .config(function(readFilesProcessor) {

    readFilesProcessor.sourceFiles = readFilesProcessor.sourceFiles.concat([
      {
        basePath: CONTENTS_PATH,
        include: CONTENTS_PATH + '/{deprecations,guide,tutorial}/**/*.md',
        fileReader: 'contentFileReader'
      },
      {
        basePath: CONTENTS_PATH + '/marketing',
        include: CONTENTS_PATH + '/marketing/**/*.{html,md}',
        fileReader: 'contentFileReader'
      },
      {
        basePath: CONTENTS_PATH,
        include: CONTENTS_PATH + '/*.md',
        exclude: [CONTENTS_PATH + '/index.md'],
        fileReader: 'contentFileReader'
      },
      {
        basePath: CONTENTS_PATH,
        include: CONTENTS_PATH + '/navigation.json',
        fileReader: 'jsonFileReader'
      },

    ]);

  })


  // Configure jsdoc-style tag parsing
  .config(function(inlineTagProcessor) {
    inlineTagProcessor.inlineTagDefinitions.push(require('./inline-tag-defs/anchor'));
  })


  .config(function(computePathsProcessor) {

    // Replace any path templates inherited from other packages
    // (we want full and transparent control)
    computePathsProcessor.pathTemplates = computePathsProcessor.pathTemplates.concat([
      {
        docTypes: ['content'],
        getPath: (doc) => `${doc.id.replace(/\/index$/, '')}`,
        outputPathTemplate: '${path}.json'
      },
      {docTypes: ['navigation-json'], pathTemplate: '${id}', outputPathTemplate: '../${id}.json'},
      {docTypes: ['contributors-json'], pathTemplate: '${id}', outputPathTemplate: '../${id}.json'},
      {docTypes: ['announcements-json'], pathTemplate: '${id}', outputPathTemplate: '../${id}.json'}
    ]);
  })

  // We want the content files to be converted
  .config(function(convertToJsonProcessor, postProcessHtml) {
    convertToJsonProcessor.docTypes.push('content');
    postProcessHtml.docTypes.push('content');
  });
