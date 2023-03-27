module.exports = function checkOperator() {
  return {
    $runAfter: ['generateApiListDoc'],
    $runBefore: ['renderDocsProcessor'],
    $process(docs) {
      docs.forEach((doc) => {
        doc.isOperator = !!(doc.originalModule?.startsWith('internal/operators') && doc.docType === 'function');
      });
    },
  };
};
