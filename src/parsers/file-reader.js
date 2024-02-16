import fs from 'node:fs';
import { cwd } from 'node:process';
import * as path from 'path';

import yaml from 'js-yaml';

const getFileData = (filepath) => {
  const absPath = path.resolve(cwd(), filepath);
  const extension = path.extname(filepath).slice(1);
  const content = fs.readFileSync(filepath);

  const data = {
    path: absPath,
    content,
  };

  switch (extension) {
    case 'json': {
      return { ...data, format: 'json' };
    }
    case 'yaml':
    case 'yml': {
      return { ...data, format: 'yml' };
    }
    default: {
      return { ...data, format: extension };
    }
  }
};

const getFileJSON = (filepath) => {
  const fileData = getFileData(filepath);

  switch (fileData.format) {
    case 'yml': {
      return yaml.load(fileData.content);
    }
    case 'json': {
      return JSON.parse(fileData.content);
    }
    default: {
      return null;
    }
  }
};

export { getFileData, getFileJSON };
