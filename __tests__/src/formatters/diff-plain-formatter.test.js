import { test, expect } from '@jest/globals';

import { getDiffData } from '../../../src/parsers/json-comparer.js';

import {
  getPlainText,
  getPlainDiff,
} from '../../../src/formatters/diff-plain-formatter.js';

import filesData from '../../../__fixtures__/files-data.js';

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
