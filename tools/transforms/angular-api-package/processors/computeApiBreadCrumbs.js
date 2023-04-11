module.exports = function computeApiBreadCrumbs(EXPORT_DOC_TYPES) {
  return {
    $runAfter: ['paths-computed'],
    $runBefore: ['rendering-docs'],
    $process(docs) {
      // Compute the breadcrumb for each doc by processing its containers
      docs.forEach(doc => {
        if (EXPORT_DOC_TYPES.indexOf(doc.docType) !== -1) {
          const splittedModuleDocPath = doc.moduleDoc.path.split('/');
          doc.breadCrumbs = [
            { text: 'API', path: '/ref' },
            { text: splittedModuleDocPath[1], path: splittedModuleDocPath[0] + `?pkg=${splittedModuleDocPath[1]}`},
            { text: splittedModuleDocPath[2], path: doc.moduleDoc.path },
            { text: doc.name, path: doc.path }
          ];
        }
      });
    }
  };
};

