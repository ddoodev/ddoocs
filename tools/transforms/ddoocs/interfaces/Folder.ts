export interface Folder {
  name: string;
  path: string;
  indexPath?: string;
  folders: Folder[];
  files: string[];
}
