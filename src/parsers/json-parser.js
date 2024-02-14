import fs from 'node:fs';
import _ from 'lodash';
import { cwd } from 'node:process';
import * as path from 'path';

const getFileData = (filepath) => {
  const absPath = path.resolve(cwd(), filepath);
  const extension = path.extname(filepath).slice(1);
  const content = fs.readFileSync(filepath);

  return {
    path: absPath,
    extension,
    content: JSON.parse(content),
  };
};

const getDiffData = (json1, json2) => {
  const keys = _.uniq([...Object.keys(json1), ...Object.keys(json2)]);

  if (!keys.length) return [];

  const sortedKeys = _.sortBy(keys);

  const result = [];

  sortedKeys.forEach((key) => {
    let status;
    let values = {};

    // no changes
    if (!Object.hasOwn(json2, key)) {
      status = 'deleted';
      values.old = json1[key];
    }
    // updated
    else if (Object.hasOwn(json1, key)) {
      const isEqual = _.isEqual(json1[key], json2[key]);

      status = isEqual ? 'no-changes' : 'updated';

      values.old = json1[key];
      values.new = json2[key];
    }
    // created
    else {
      status = 'created';
      values.new = json2[key];
    }

    result.push({ key, status, values });
  });

  return result;
};

const getDiffResult = (json1, json2) => {
  const data = getDiffData(json1, json2);

  const prefixes = { space: '    ', minus: '  - ', plus: '  + ' };

  const result = data.reduce((acc, { key, status, values }) => {
    switch (status) {
      case 'no-changes': {
        acc.push(`${prefixes.space}${key}: ${values.old}`);
        break;
      }
      case 'created': {
        acc.push(`${prefixes.plus}${key}: ${values.new}`);
        break;
      }
      case 'updated': {
        acc.push(`${prefixes.minus}${key}: ${values.old}`);
        acc.push(`${prefixes.plus}${key}: ${values.new}`);
        break;
      }
      case 'deleted': {
        acc.push(`${prefixes.minus}${key}: ${values.old}`);
        break;
      }
    }

    return acc;
  }, []);

  return `{\n${result.join('\n')}\n}`;
};

const getDiff = (filepath1, filepath2) => {
  const file1Data = getFileData(filepath1);
  const file2Data = getFileData(filepath2);

  if (file1Data.extension !== file2Data.extension) return null;

  switch (file1Data.extension) {
    case 'json': {
      return getDiffResult(file1Data.content, file2Data.content);
    }
    default: {
      return '';
    }
  }
};

export { getFileData, getDiffData, getDiffResult, getDiff };
