import { test, expect } from '@jest/globals';

import { cwd } from 'node:process';
import * as path from 'path';
import {
  getFileData,
  getDiffData,
  getDiffResult,
  getDiff,
} from '../../../src/parsers/json-parser.js';

const filesData = [
  {
    path: '/home/ansi/work/my/hexlet/frontend-project-46/src/temp/file1.json',
    extension: 'json',
    content: {
      host: 'hexlet.io',
      timeout: 50,
      proxy: '123.234.53.22',
      follow: false,
    },
  },
  {
    path: '/home/ansi/work/my/hexlet/frontend-project-46/src/temp/file2.json',
    extension: 'json',
    content: { timeout: 20, verbose: true, host: 'hexlet.io' },
  },
];

const filesPaths = [
  path.resolve(cwd(), 'src/temp/file1.json'),
  path.resolve(cwd(), 'src/temp/file2.json'),
];

test('check json-parser getFileData()', () => {
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

test('check json-parser getDiffData()', () => {
  const data0 = getDiffData(filesData[0].content, filesData[1].content);

  expect(data0).toEqual([
    { key: 'follow', status: 'deleted', values: { old: false } },
    {
      key: 'host',
      status: 'no-changes',
      values: { old: 'hexlet.io', new: 'hexlet.io' },
    },
    { key: 'proxy', status: 'deleted', values: { old: '123.234.53.22' } },
    { key: 'timeout', status: 'updated', values: { old: 50, new: 20 } },
    { key: 'verbose', status: 'created', values: { new: true } },
  ]);

  const data1 = getDiffData({}, {});

  expect(data1).toHaveLength(0);

  const data2 = getDiffData({}, filesData[1].content);

  expect(data2).toEqual([
    {
      key: 'host',
      status: 'created',
      values: { new: 'hexlet.io' },
    },
    { key: 'timeout', status: 'created', values: { new: 20 } },
    { key: 'verbose', status: 'created', values: { new: true } },
  ]);

  const data3 = getDiffData(filesData[1].content, {});

  expect(data3).toEqual([
    {
      key: 'host',
      status: 'deleted',
      values: { old: 'hexlet.io' },
    },
    { key: 'timeout', status: 'deleted', values: { old: 20 } },
    { key: 'verbose', status: 'deleted', values: { old: true } },
  ]);

  const data4 = getDiffData(filesData[1].content, filesData[1].content);

  expect(data4).toEqual([
    {
      key: 'host',
      status: 'no-changes',
      values: { old: 'hexlet.io', new: 'hexlet.io' },
    },
    { key: 'timeout', status: 'no-changes', values: { old: 20, new: 20 } },
    { key: 'verbose', status: 'no-changes', values: { old: true, new: true } },
  ]);
});

test('check json-parser getDiffResult()', () => {
  const result1 = getDiffResult(filesData[0].content, filesData[1].content);

  expect(result1).toEqual(`{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`);

  const result2 = getDiffResult(filesData[1].content, filesData[0].content);

  expect(result2).toEqual(`{
  + follow: false
    host: hexlet.io
  + proxy: 123.234.53.22
  - timeout: 20
  + timeout: 50
  - verbose: true
}`);
});

test('check json-parser getDiff()', () => {
  const diff = getDiff(filesPaths[0], filesPaths[1]);

  expect(diff).toEqual(`{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`);
});
