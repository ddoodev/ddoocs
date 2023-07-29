export interface Config {
  mainRepositoryName: string;
  repositories: Repository[];
}

/** Represents repository */
export interface Repository {
  /** Represents modules that declared in source root index.ts.
   * Should be synced with source root index.ts */
  modules: string[];
  /** Name of repository */
  name: string;
  /** Source folder name
   *
   * @default src
   */
  sourceFolder?: string;
  /** Represents index.ts in root of source folder
   *
   * Used for cases when root index.ts needs modifications for documentation viewer app
   * */
  pseudoRootIndex?: PseudoRootIndex;
}

export interface PseudoRootIndex {
  /** Paths to folder that contains index.ts or files that contains exported members
   *
   * @example
   * // exports: ['./Something']
   * export * from './Something';
   */
  exports?: string[];
  /** Array of {@link NamedExport}
   *
   * @example
   * // namedExports: { exportedMemberNames: ['Something', 'Other'], path: './Example' }
   * export { Something, Other } from './Example'
   */
  namedExports?: NamedExport[];
}

export interface NamedExport {
  exportedMemberNames: string[];
  path: string;
}
