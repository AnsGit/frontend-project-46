import { test, expect } from '@jest/globals';

import { cwd } from 'node:process';
import * as path from 'path';

import { getDiffData } from '../../../src/parsers/json-comparer.js';

import {
  getPlainText,
  getPlainDiff,
} from '../../../src/formatters/diff-plain-formatter.js';

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

test('check json-parser getPlainText()', () => {
  const text0 = getPlainText('deleted', 'common.setting2');

  expect(text0).toEqual(
    // eslint-disable-next-line
    `Property 'common.setting2' was removed`,
  );

  const text1 = getPlainText('updated', 'common.setting3', true, null);

  expect(text1).toEqual(
    // eslint-disable-next-line
    `Property 'common.setting3' was updated. From true to null`,
  );

  const text2 = getPlainText('created', 'common.setting5', '[complex value]');

  expect(text2).toEqual(
    // eslint-disable-next-line
    `Property 'common.setting5' was added with value: [complex value]`,
  );
});

test('check json-parser getPlainDiff()', () => {
  const diff0Data = getDiffData(filesData[0].content, filesData[1].content);
  const result0 = getPlainDiff(diff0Data);

  expect(result0).toEqual(`Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`);

  const result1 = getPlainDiff([]);

  expect(result1).toEqual('');
});
