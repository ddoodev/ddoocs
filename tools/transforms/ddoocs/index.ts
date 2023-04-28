import { TransformRunner } from './TransformRunner';
import { IndexFileTransformer } from './transforms/IndexFileTransformer';
import { EnumTransformer } from './transforms/EnumTransformer';
import * as fs from 'fs';
import * as ts from 'typescript';
import { createPrinter } from 'typescript';
import { contains } from './utils/contains';
import { Repository } from '../types';
import { join } from 'path';
import { getSourceFolderName } from '../utils';
import { DirectoryReader } from './readers/DirectoryReader';

export function ddoocsTransformRunner(repositoryPath: string, repositories: Repository[]) {
  const directoryReader = new DirectoryReader();
  const transformRunner = new TransformRunner()
    .setIndexTransformation((sourceFile, filePath) => {
        const indexFileTransformer = new IndexFileTransformer(
          '@ddoocs',
          'ignore',
          'force-export'
        );

        const res = indexFileTransformer.transform(sourceFile);
        fs.writeFileSync(filePath, res);
    })
    .setTransformation((sourceFile, filePath) => {
      const isContains = contains(ts.SyntaxKind.EnumDeclaration, sourceFile);
      if (!isContains) return;

      const enumTransformer = new EnumTransformer(sourceFile);
      const res = enumTransformer.transform();
      fs.writeFileSync(filePath, createPrinter().printFile(res.transformed[0] as ts.SourceFile));
    });

  repositories.forEach((repo) => {
    const srcPath = join(repositoryPath, repo.name, getSourceFolderName(repo));
    const folder = directoryReader.read(srcPath);

    transformRunner.run(folder);
  });
}
