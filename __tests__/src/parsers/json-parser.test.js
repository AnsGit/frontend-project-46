import { test, expect } from '@jest/globals';

import { cwd } from 'node:process';
import * as path from 'path';

import {
  getDiffData,
  getDiff,
  stringify,
  getStringValue,
} from '../../../src/parsers/json-parser.js';

const filesData = [
  {
    path: path.resolve(cwd(), './__fixtures__/file1.json'),
    format: 'json',
    content: {
      host: 'hexlet.io',
      timeout: 50,
      proxy: '123.234.53.22',
      follow: false,
    },
  },
  {
    path: path.resolve(cwd(), './__fixtures__/file1.json'),
    format: 'json',
    content: { timeout: 20, verbose: true, host: 'hexlet.io' },
  },
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

test('check json-parser stringify()', () => {
  expect(getStringValue(123)).toEqual('123');
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

test('check json-parser getDiffData()', () => {
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

test('check json-parser getDiff()', () => {
  const result1 = getDiff(filesData[0].content, filesData[1].content);

  expect(result1).toEqual(`{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`);

  const result2 = getDiff(filesData[1].content, filesData[0].content);

  expect(result2).toEqual(`{
  + follow: false
    host: hexlet.io
  + proxy: 123.234.53.22
  - timeout: 20
  + timeout: 50
  - verbose: true
}`);

  const result3 = getDiff(filesData[2].content, filesData[3].content);

  expect(result3).toEqual(`{
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

  const result4 = getDiff({}, {});

  expect(result4).toEqual('{}');
});
