export interface IFileSystem {
  readDirectory(path: string): string[];
  readFile(path: string): string;
  writeFile(path: string, data: string): void;
}
