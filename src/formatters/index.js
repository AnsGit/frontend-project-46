import { getStylishDiff } from './diff-stylish-formatter.js';
import { getPlainDiff } from './diff-plain-formatter.js';
import { getJsonDiff } from './diff-json-formatter.js';

export default (diffData, format = 'stylish') => {
  if (format === 'stylish') {
    return getStylishDiff(diffData);
  }

  if (format === 'plain') {
    return getPlainDiff(diffData);
  }

  if (format === 'json') {
    return getJsonDiff(diffData);
  }

  return null;
};
