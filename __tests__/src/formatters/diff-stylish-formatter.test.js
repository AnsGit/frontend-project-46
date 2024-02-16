import { test, expect } from '@jest/globals';

import { getDiffData } from '../../../src/parsers/json-comparer.js';

import {
  stringify,
  getStylishValue,
  getStylishDiff,
} from '../../../src/formatters/diff-stylish-formatter.js';

import filesData from '../../../__fixtures__/files-data.js';

test('check json-parser getStylishValue()', () => {
  expect(getStylishValue(123)).toEqual('123');
  expect(getStylishValue([1, 2, 3])).toEqual('[1,2,3]');
});

test('check json-parser stringify()', () => {
  const obj = {
    a: 5,
    b: {
      c: 'null',
      d: [1, 2, 3],
      e: { f: 10, g: 'value' },
    },
  };

  expect(stringify(obj, '    ')).toEqual(`{
    a: 5
    b: {
        c: null
        d: [1,2,3]
        e: {
            f: 10
            g: value
        }
    }
}`);

  expect(stringify({})).toEqual('');
});

test('check json-parser getStylishDiff()', () => {
  const diff0Data = getDiffData(filesData[0].content, filesData[1].content);
  const result0 = getStylishDiff(diff0Data);

  expect(result0).toEqual(`{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`);

  const result1 = getStylishDiff([]);

  expect(result1).toEqual('{}');
});
