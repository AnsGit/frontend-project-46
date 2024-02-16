import { getFileJSON, getDiffData } from './parsers/index.js';
import getFormattedDiff from './formatters/index.js';

export default (file1path, file2path, format) => {
  const file1JSON = getFileJSON(file1path);
  const file2JSON = getFileJSON(file2path);

  if (file1JSON === null || file2JSON === null) return null;

  const data = getDiffData(file1JSON, file2JSON);

  return getFormattedDiff(data, format);
};
