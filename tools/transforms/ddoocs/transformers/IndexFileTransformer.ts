import * as ts from 'typescript';

enum ModifyType {
  Ignore = 1,
  ForceExport
}

export class IndexFileTransformer {
  private exportRegexp = /^(\/\/(\s|)|)export/;

  constructor(
    private prefix: string,
    private ignoreWord: string,
    private forceExportWord: string
  ) {}

  transform(sourceFile: ts.SourceFile) {
    const fileLines = sourceFile.text.split('\n');

    let modifyType: ModifyType | undefined = undefined;
    for (let i = 0; i < fileLines.length; i++) {
      const line = fileLines[i];

      if (modifyType) {
        switch (modifyType) {
          case ModifyType.Ignore:
            fileLines[i] = this.setIgnoreLine(line);
            break;
          case ModifyType.ForceExport:
            fileLines[i] = this.setForceLine(line);
            break;
        }

        modifyType = undefined;
        continue;
      }

      if (!line.includes(this.prefix)) {
        continue;
      }

      const keyword = line.split(this.prefix)[1].trim().split(' ')[0];
      const nextLine = fileLines[i + 1];

      switch (keyword) {
        case this.ignoreWord:
          if (this.exportRegexp.test(nextLine)) {
            modifyType = ModifyType.Ignore;
          }
          break;
        case this.forceExportWord:
          if (this.exportRegexp.test(nextLine)) {
            modifyType = ModifyType.ForceExport;
          }
          break;
      }
    }

    return fileLines.join('\n');
  }

  private setIgnoreLine(line: string): string {
    if (line.startsWith('//')) return line;
    return '// ' + line;
  }

  private setForceLine(line: string): string {
    return line.replace('// ', '');
  }
}
