import { IFileSystem } from './IFileSystem';
import { Logger } from './Logger';
import { Volume } from 'memfs/lib/volume';

export class InMemoryFileSystem implements IFileSystem {
  constructor(
    private logger: Logger,
    private readonly volume: Volume,
  ) {}

  readDirectory(path: string): string[] {
    const res = this.volume.readdirSync(path);
    this.logger.debug(`read directory: ${path}`);
    return res as string[];
  }

  readFile(path: string): string {
    const res = this.volume.readFileSync(path, { encoding: 'utf-8' });
    this.logger.debug(`read file: ${path}`);
    return res as string;
  }

  writeFile(path: string, data: string): void {
    this.volume.writeFileSync(path, data);
    this.logger.debug(`written file: ${path}`);
  }
}
