import { test, expect } from '@jest/globals';

import { cwd } from 'node:process';
import * as path from 'path';

import { getDiffData } from '../../../src/parsers/json-comparer.js';

import { getJsonDiff } from '../../../src/formatters/diff-json-formatter.js';

const filesData = [
  {
    path: path.resolve(cwd(), './__fixtures__/file3.json'),
    format: 'json',
    content: {
      common: {
        setting1: 'Value 1',
        setting2: 200,
        setting3: true,
        setting6: {
          key: 'value',
          doge: {
            wow: '',
          },
        },
      },
      group1: {
        baz: 'bas',
        foo: 'bar',
        nest: {
          key: 'value',
        },
      },
      group2: {
        abc: 12345,
        deep: {
          id: 45,
        },
      },
    },
  },
  {
    path: path.resolve(cwd(), './__fixtures__/file4.json'),
    format: 'json',
    content: {
      common: {
        follow: false,
        setting1: 'Value 1',
        setting3: null,
        setting4: 'blah blah',
        setting5: {
          key5: 'value5',
        },
        setting6: {
          key: 'value',
          ops: 'vops',
          doge: {
            wow: 'so much',
          },
        },
      },
      group1: {
        foo: 'bar',
        baz: 'bars',
        nest: 'str',
      },
      group3: {
        deep: {
          id: {
            number: 45,
          },
        },
        fee: 100500,
      },
    },
  },
];

test('check json-parser getJsonDiff()', () => {
  const diff0Data = getDiffData(filesData[0].content, filesData[1].content);
  const result0 = getJsonDiff(diff0Data);

  expect(result0).toEqual(
    '{"common":{"follow":false,"setting1":"Value 1","setting3":null,"setting4":"blah blah","setting5":{"key5":"value5"},"setting6":{"doge":{"wow":"so much"},"key":"value","ops":"vops"}},"group1":{"baz":"bars","foo":"bar","nest":"str"},"group3":{"deep":{"id":{"number":45}},"fee":100500}}',
  );

  const diff1Data = getDiffData({}, {});
  const result1 = getJsonDiff(diff1Data);

  expect(result1).toEqual('{}');

  const diff2Data = getDiffData(filesData[0].content, {});
  const result2 = getJsonDiff(diff2Data);

  expect(result2).toEqual('{}');
});
