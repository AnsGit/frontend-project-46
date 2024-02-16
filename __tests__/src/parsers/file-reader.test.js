import { test, expect } from '@jest/globals';

import { cwd } from 'node:process';
import * as path from 'path';

import { getFileData, getFileJSON } from '../../../src/parsers/file-reader.js';

const filesPaths = [
  path.resolve(cwd(), './__fixtures__/file1.json'),
  path.resolve(cwd(), './__fixtures__/file2.yaml'),
  path.resolve(cwd(), './__fixtures__/temp.temp'),
];

test('check file-reader getFileData()', () => {
  const data1 = getFileData(filesPaths[0]);

  expect(data1.path).toEqual(filesPaths[0]);
  expect(data1.format).toEqual('json');

  const data2 = getFileData(filesPaths[1]);

  expect(data2.format).toEqual('yml');

  const data3 = getFileData(filesPaths[2]);

  expect(data3.format).toEqual('temp');
});

test('check file-reader getFileJSON()', () => {
  const json1 = getFileJSON(filesPaths[0]);

  expect(json1).toEqual({
    host: 'hexlet.io',
    timeout: 50,
    proxy: '123.234.53.22',
    follow: false,
  });

  const json2 = getFileJSON(filesPaths[1]);

  expect(json2).toEqual({
    timeout: 20,
    verbose: true,
    host: 'hexlet.io',
  });

  const json3 = getFileJSON(filesPaths[2]);

  expect(json3).toBeNull();
});
