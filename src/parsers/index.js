import { getFileJSON } from './file-reader.js';
import { getDiffData } from './json-comparer.js';
import { getStylishDiff } from './diff-stylish-formatter.js';
import { getPlainDiff } from './diff-plain-formatter.js';

export default (file1path, file2path, options = {}) => {
  const file1JSON = getFileJSON(file1path);
  const file2JSON = getFileJSON(file2path);

  if (file1JSON === null || file2JSON === null) return null;

  const data = getDiffData(file1JSON, file2JSON);

  if (options.format === 'stylish') {
    return getStylishDiff(data);
  }

  if (options.format === 'plain') {
    return getPlainDiff(data);
  }

  return null;
};
