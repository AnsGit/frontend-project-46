import getDiff from './parsers/index.js';

const genDiff = (filepath1, filepath2, options = {}) => {
  const diff = getDiff(filepath1, filepath2, options);
  console.log(diff);
};

export { getDiff, genDiff };
