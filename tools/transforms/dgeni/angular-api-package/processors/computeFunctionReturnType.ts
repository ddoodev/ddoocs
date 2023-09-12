import { DocCollection, Processor } from 'dgeni';
import { ApiDoc } from 'dgeni-packages/typescript/api-doc-types/ApiDoc';
import { MethodMemberDoc } from 'dgeni-packages/typescript/api-doc-types/MethodMemberDoc';
import { FunctionExportDoc } from 'dgeni-packages/typescript/api-doc-types/FunctionExportDoc';

export function computeFunctionReturnType() {
  return new ComputeFunctionReturnType();
}

export class ComputeFunctionReturnType implements Processor {
  $runAfter = ['readTypeScriptModules'];
  $runBefore = ['processing-docs'];

  $process(docs: DocCollection): void {
    docs.forEach((doc: ApiDoc) => {
      if (!(doc instanceof MethodMemberDoc || doc instanceof FunctionExportDoc)) return;
      if (doc.type) return;

      const declaration = doc.declaration as any;
      const signature = doc.typeChecker.getSignatureFromDeclaration(declaration);
      if (!signature) return;

      const returnType = doc.typeChecker.getReturnTypeOfSignature(signature);
      doc.type = doc.typeChecker.typeToString(returnType);
    });
  }
}
