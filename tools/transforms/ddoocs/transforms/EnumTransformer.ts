import * as ts from 'typescript';

export class EnumTransformer {
  private static sourceFile: ts.SourceFile;

  constructor(sourceFile: ts.SourceFile) {
    EnumTransformer.sourceFile = sourceFile;
  }

  transform() {
    try {
      return ts.transform(EnumTransformer.sourceFile, [this._transformer]);
    }
    catch (e) {
      throw new Error(`error while processing ${EnumTransformer.sourceFile.fileName}: ${e}`);
    }
  }

  private _transformer(context: ts.TransformationContext) {
    const { factory } = context;

    const visitor: ts.Visitor = (node: ts.Node): ts.Node => {
      if (ts.isEnumDeclaration(node) && ts.isIdentifier(node.name)) {
        const members = node.members;
        const newMembers: ts.EnumMember[] = [];

        let lastValue = -1;

        if (Number.isNaN(lastValue)) {
          throw new Error(
            `cannot compute value if previous value is not simple numeric literal (ex. string or 1 << 1)
            please update it manually`
          );
        }

        members.forEach((member) => {
          if (ts.isEnumMember(member)) {
            const initializer = member.initializer;
            if (initializer === undefined) {
              lastValue++;
              const newMember = factory.updateEnumMember(
                member,
                member.name,
                factory.createNumericLiteral(lastValue.toString())
              );
              newMembers.push(newMember);
            } else {
              lastValue = Number(initializer.getText(EnumTransformer.sourceFile));
              newMembers.push(member);
            }
          }
        });

        const newNode = factory.updateEnumDeclaration(node, node.decorators, node.modifiers, node.name, newMembers);
        return ts.visitEachChild(newNode, visitor, context);
      }

      return ts.visitEachChild(node, visitor, context);
    };

    return (node: ts.Node) => ts.visitNode(node, visitor);
  }
}
