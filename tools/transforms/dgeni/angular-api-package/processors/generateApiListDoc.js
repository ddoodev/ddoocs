module.exports = function generateApiListDoc() {

  return {
    $runAfter: ['extra-docs-added'],
    $runBefore: ['rendering-docs'],
    outputFolder: null,
    $validate: {outputFolder: {presence: true}},
    $process: function(docs) {
      docs.push({
        docType: 'api-list-data',
        template: 'json-doc.template.json',
        path: this.outputFolder + '/api-list.json',
        outputPath: this.outputFolder + '/api-list.json',
        data: docs
          .filter(doc => doc.docType === 'module')
          .map(getModuleInfo)
      });
    }
  };
};

function getModuleInfo(moduleDoc) {
  const moduleName = moduleDoc.id.replace(/\/index$/, '').toLowerCase();
  const moduleNameSplit = moduleName.split('/');
  return {
    name: findEndsWithAndReplace(moduleName, 'src', 'index'),
    title: moduleNameSplit.filter(s => s !== 'src').join(' / '),
    titleShort: findEndsWithAndReplace(moduleNameSplit[moduleNameSplit.length - 1], 'src', 'index'),
    items: moduleDoc.exports
    // Ignore internals and private exports (indicated by the ɵ prefix)
      .filter(doc => !doc.internal && !doc.privateExport)
    // Ignore all renamed exports that are just duplicates of other docs
      .filter(doc => !doc.duplicateOf)
      .map(getExportInfo)
      .sort((a, b) => a.name === b.name ? 0 : a.name > b.name ? 1 : -1)
  };
}

function getExportInfo(exportDoc) {
  return {
    name: exportDoc.name.toLowerCase(),
    title: exportDoc.name,
    path: exportDoc.path,
    docType: getDocType(exportDoc),
    stability: getStability(exportDoc),
    securityRisk: !!exportDoc.security,
    pkg: exportDoc.id ? exportDoc.id.split('/')[0] : 'all'
  };
}

function getDocType(doc) {
  // We map `let` and `var` types to `const`
  if (['let', 'var'].indexOf(doc.docType) !== -1) {
    return 'const';
  }
  return doc.docType;
}

const stabilityProperties = ['stable', 'experimental', 'deprecated'];
function getStability(doc) {
  return stabilityProperties.find(prop => prop in doc) || '';
}

function findEndsWithAndReplace(str, endsWith, replace) {
  return str.endsWith(endsWith) ? str.replace(endsWith, replace) : str;
}
