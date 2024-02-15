import { getFileJSON } from './file-reader.js';
import { getDiff } from './json-parser.js';

export default (file1path, file2path) => {
  const file1JSON = getFileJSON(file1path);
  const file2JSON = getFileJSON(file2path);

  if (file1JSON === null || file2JSON === null) return null;

  return getDiff(file1JSON, file2JSON);
};
