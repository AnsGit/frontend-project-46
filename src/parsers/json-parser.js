import _ from 'lodash';

const getDiffData = (json1, json2) => {
  const keys = _.uniq([...Object.keys(json1), ...Object.keys(json2)]);

  if (!keys.length) return [];

  const sortedKeys = _.sortBy(keys);

  const result = [];

  sortedKeys.forEach((key) => {
    let status;
    const values = {};

    // no changes
    if (!Object.hasOwn(json2, key)) {
      status = 'deleted';
      values.old = json1[key];
    }
    // updated
    else if (Object.hasOwn(json1, key)) {
      const isEqual = _.isEqual(json1[key], json2[key]);

      status = isEqual ? 'no-changes' : 'updated';

      values.old = json1[key];
      values.new = json2[key];
    }
    // created
    else {
      status = 'created';
      values.new = json2[key];
    }

    result.push({ key, status, values });
  });

  return result;
};

const getDiff = (json1, json2) => {
  const data = getDiffData(json1, json2);

  const prefixes = { space: '    ', minus: '  - ', plus: '  + ' };

  const result = data.reduce((acc, { key, status, values }) => {
    switch (status) {
      case 'no-changes': {
        acc.push(`${prefixes.space}${key}: ${values.old}`);
        break;
      }
      case 'created': {
        acc.push(`${prefixes.plus}${key}: ${values.new}`);
        break;
      }
      case 'updated': {
        acc.push(`${prefixes.minus}${key}: ${values.old}`);
        acc.push(`${prefixes.plus}${key}: ${values.new}`);
        break;
      }
      case 'deleted': {
        acc.push(`${prefixes.minus}${key}: ${values.old}`);
        break;
      }
      default: {
        break;
      }
    }

    return acc;
  }, []);

  return `{\n${result.join('\n')}\n}`;
};

// eslint-disable-next-line
export { getDiffData, getDiff };
