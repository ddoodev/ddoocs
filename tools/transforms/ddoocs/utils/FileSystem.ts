import * as fs from 'fs';
import { Logger } from './Logger';

export class FileSystem {
  constructor(private logger: Logger) {}

  public readDirectory(path: string): string[] {
    const res = fs.readdirSync(path);
    this.logger.debug(`read directory: ${path}`);
    return res;
  }

  public readFile(path: string): string {
    const res = fs.readFileSync(path, { encoding: 'utf-8' });
    this.logger.debug(`read file: ${path}`);
    return res;
  }

  public writeFile(path: string, data: string): void {
    fs.writeFileSync(path, data);
    this.logger.debug(`written file: ${path}`);
  }
}
