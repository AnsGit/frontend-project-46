import fs from 'node:fs';
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

export { getFileData };
