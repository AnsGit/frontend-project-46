import { getDiff } from './parsers/json-parser.js';

const genDiff = async (filepath1, filepath2) => {
  const diff = getDiff(filepath1, filepath2);
  console.log(diff);
};

export { genDiff };
