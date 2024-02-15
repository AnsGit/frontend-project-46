import { test, expect } from '@jest/globals';

import * as path from 'path';
import { fileURLToPath } from 'node:url';

import { getFileData } from '../../../src/parsers/file-reader.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const filesPaths = [
  path.resolve(__dirname, '../../__fixtures__/file1.json'),
  path.resolve(__dirname, '../../__fixtures__/file2.json'),
];

test('check file-reader getFileData()', () => {
  const data = getFileData(filesPaths[0]);

  expect(data).toEqual({
    path: filesPaths[0],
    extension: 'json',
    content: {
      host: 'hexlet.io',
      timeout: 50,
      proxy: '123.234.53.22',
      follow: false,
    },
  });
});
