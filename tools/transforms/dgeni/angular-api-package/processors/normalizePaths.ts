import { DocCollection, Document, Processor } from 'dgeni';

export function normalizePaths(API_DOC_TYPES: any[]) {
  return new NormalizePaths(API_DOC_TYPES);
}

export class NormalizePaths implements Processor {
  $runAfter = ['readTypeScriptModules'];
  $runBefore = ['processing-docs'];

  constructor(public API_DOC_TYPES: any[]) {}

  $process(docs: DocCollection): void {
    docs.forEach((doc: Document) => {
      if (this.API_DOC_TYPES.indexOf(doc.docType) !== -1 && doc.fileInfo && doc.fileInfo.realFilePath) {
        doc.fileInfo.relativePath = doc.fileInfo.relativePath.replace('src/', '');
        doc.fileInfo.projectRelativePath = doc.fileInfo.projectRelativePath.replace('src/', '');
        doc.id = doc.id.replace('src/', '');
      }
    });
  }
}
