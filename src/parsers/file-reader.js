import fs from 'node:fs';
import { cwd } from 'node:process';
import * as path from 'path';

import yaml from 'js-yaml';

const getFileData = (filepath) => {
  const absPath = path.resolve(cwd(), filepath);
  const extension = path.extname(filepath).slice(1);
  const content = fs.readFileSync(filepath);

  let format;

  switch (extension) {
    case 'json': {
      format = 'json';
      break;
    }
    case 'yaml':
    case 'yml': {
      format = 'yml';
      break;
    }
    default: {
      format = extension;
    }
  }

  return {
    path: absPath,
    format,
    content,
  };
};

const getFileJSON = (filepath) => {
  const fileData = getFileData(filepath);

  let json;

  switch (fileData.format) {
    case 'yml': {
      json = yaml.load(fileData.content);
      break;
    }
    case 'json': {
      json = JSON.parse(fileData.content);
      break;
    }
    default: {
      json = null;
    }
  }

  return json;
};

export { getFileData, getFileJSON };
