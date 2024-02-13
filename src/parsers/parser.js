import fs from 'node:fs';
import _ from 'lodash';
import { cwd } from 'node:process';
import * as path from 'path';

const getFileData = async (filepath) => {
  const fileAbsolutePath = path.resolve(cwd(), filepath);
  const fileContent = JSON.parse(await fs.readFileSync(filepath));

  return {
    path: fileAbsolutePath,
    content: fileContent,
  };
};

export { getFileData };
