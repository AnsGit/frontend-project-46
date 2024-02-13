import { getFileData } from './parsers/parser.js';

const genDiff = async (filepath1, filepath2) => {
  const file1Data = await getFileData(filepath1);
  const file2Data = await getFileData(filepath2);

  console.log(file1Data);
  console.log(file2Data);
};

export { genDiff };
