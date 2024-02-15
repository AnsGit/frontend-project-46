import getDiff from './parsers/index.js';

const genDiff = (filepath1, filepath2) => {
  const diff = getDiff(filepath1, filepath2);
  console.log(diff);
};

export { getDiff, genDiff };
