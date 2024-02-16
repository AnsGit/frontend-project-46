import { test, expect } from '@jest/globals';

import {
  getJsonsUniqKeys,
  getDiffData,
} from '../../../src/parsers/json-comparer.js';

import filesData from '../../../__fixtures__/files-data.js';

test('check getJsonsUniqKeys()', () => {
  const keys1 = getJsonsUniqKeys({ c: 3, a: 1, b: 2 }, { a: 1, d: 4 });
  expect(keys1).toEqual(['a', 'b', 'c', 'd']);

  const keys2 = getJsonsUniqKeys({}, {});
  expect(keys2).toEqual([]);
});

test('check getDiffData()', () => {
  const data0 = getDiffData(filesData[0].content, filesData[1].content);

  expect(data0).toEqual([
    {
      key: 'follow',
      status: 'deleted',
      values: { old: false },
      children: [],
    },
    {
      key: 'host',
      status: 'no-changes',
      values: { old: 'hexlet.io' },
      children: [],
    },
    {
      key: 'proxy',
      status: 'deleted',
      values: { old: '123.234.53.22' },
      children: [],
    },
    {
      key: 'timeout',
      status: 'updated',
      values: { old: 50, new: 20 },
      children: [],
    },
    {
      key: 'verbose',
      status: 'created',
      values: { new: true },
      children: [],
    },
  ]);

  const data1 = getDiffData({}, {});

  expect(data1).toHaveLength(0);

  const data2 = getDiffData({}, filesData[1].content);

  expect(data2).toEqual([
    {
      key: 'host',
      status: 'created',
      values: { new: 'hexlet.io' },
      children: [],
    },
    {
      key: 'timeout',
      status: 'created',
      values: { new: 20 },
      children: [],
    },
    {
      key: 'verbose',
      status: 'created',
      values: { new: true },
      children: [],
    },
  ]);

  const data3 = getDiffData(filesData[1].content, {});

  expect(data3).toEqual([
    {
      key: 'host',
      status: 'deleted',
      values: { old: 'hexlet.io' },
      children: [],
    },
    {
      key: 'timeout',
      status: 'deleted',
      values: { old: 20 },
      children: [],
    },
    {
      key: 'verbose',
      status: 'deleted',
      values: { old: true },
      children: [],
    },
  ]);

  const data4 = getDiffData(filesData[1].content, filesData[1].content);

  expect(data4).toEqual([
    {
      key: 'host',
      status: 'no-changes',
      values: { old: 'hexlet.io' },
      children: [],
    },
    {
      key: 'timeout',
      status: 'no-changes',
      values: { old: 20 },
      children: [],
    },
    {
      key: 'verbose',
      status: 'no-changes',
      values: { old: true },
      children: [],
    },
  ]);
});
