import { resolve } from 'path';
import { Repository } from './types';

export const repositories: Repository[] = [
  {
    name: 'discordoo',
    modules: [
      'api/index.ts',
      'cache/index.ts',
      'constants/index.ts',
      'core/index.ts',
      'events/index.ts',
      'gateway/index.ts',
      'rest/index.ts',
      'sharding/index.ts',
      'utils/index.ts',
      'wrapper/index.ts',
    ]
  },
  {
    name: 'collection',
    modules: [
      'interfaces/index.ts',
      'utils/index.ts'
    ],
    pseudoRootIndex: {
      exports: ['./Collection']
    }
  },
  {
    name: 'providers',
    modules: [
      'cache/index.ts',
      'gateway/index.ts',
      'ipc/index.ts',
      'rest/index.ts',
    ],
    pseudoRootIndex: {
      namedExports: [
        { exportedMemberNames: ['Provider'], path: './Provider' }
      ]
    }
  }
];

/* Dgeni paths */

export const PROJECT_ROOT = resolve(__dirname, '../..');
export const AIO_PATH = resolve(PROJECT_ROOT);
export const TEMPLATES_PATH = resolve(AIO_PATH, 'tools/transforms/dgeni/templates');
export const API_TEMPLATES_PATH = resolve(TEMPLATES_PATH, 'api');
export const CONTENTS_PATH = resolve(AIO_PATH, 'content');
export const SRC_PATH = resolve(AIO_PATH, 'src');
export const OUTPUT_PATH = resolve(SRC_PATH, 'generated');
export const DOCS_OUTPUT_PATH = resolve(OUTPUT_PATH, 'docs');
export const API_SOURCE_PATH = resolve(PROJECT_ROOT, 'repos/');
