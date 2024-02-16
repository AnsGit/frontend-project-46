import { test, expect } from '@jest/globals';

import { cwd } from 'node:process';
import * as path from 'path';

import { getDiffData } from '../../../src/parsers/json-comparer.js';

import {
  stringify,
  getStylishValue,
  getStylishDiff,
} from '../../../src/formatters/diff-stylish-formatter.js';

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
