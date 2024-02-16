import { getStylishDiff } from './diff-stylish-formatter.js';
import { getPlainDiff } from './diff-plain-formatter.js';

export default (diffData, format = 'stylish') => {
  if (format === 'stylish') {
    return getStylishDiff(diffData);
  }

  if (format === 'plain') {
    return getPlainDiff(diffData);
  }

  return null;
};
