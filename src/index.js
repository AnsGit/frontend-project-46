import { getDiff } from './parsers/json-parser.js';

const genDiff = (filepath1, filepath2) => {
  const diff = getDiff(filepath1, filepath2);
  console.log(diff);
};

export default genDiff;
