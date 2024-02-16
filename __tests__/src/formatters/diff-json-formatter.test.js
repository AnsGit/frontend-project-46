import { test, expect } from '@jest/globals';

import { getDiffData } from '../../../src/parsers/json-comparer.js';
import { getJsonDiff } from '../../../src/formatters/diff-json-formatter.js';

import filesData from '../../../__fixtures__/files-data.js';

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
