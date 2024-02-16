import _ from 'lodash';

const getPlainValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (_.isString(value)) {
    return `'${value}'`;
  }

  return value;
};

const getPlainText = (status, path, value0, value1) => {
  const templates = {
    created: `Property '${path}' was added with value: {value-0}`,
    updated: `Property '${path}' was updated. From {value-0} to {value-1}`,
    deleted: `Property '${path}' was removed`,
  };

  return templates[status]
    .replace('{value-0}', value0)
    .replace('{value-1}', value1);
};

const getPlainDiff = (data) => {
  if (!data.length) return '';

  const iter = (iterData, path = []) => {
    // eslint-disable-next-line
    const result = iterData.reduce((acc, { key, status, values, children }) => {
      const plainNewValue = getPlainValue(values.new);
      const plainOldValue = getPlainValue(values.old);

      const curPath = [...path, key];
      const curFormattedPath = curPath.join('.');

      switch (status) {
        case 'no-changes': {
          if (children.length) {
            // Has changed children
            return [...acc, iter(children, curPath)];
          }
          // No changed children
          return acc;
        }
        case 'created': {
          return [
            ...acc,
            getPlainText(status, curFormattedPath, plainNewValue),
          ];
        }
        case 'updated': {
          return [
            ...acc,
            getPlainText(
              status,
              curFormattedPath,
              plainOldValue,
              plainNewValue,
            ),
          ];
        }
        case 'deleted': {
          return [...acc, `Property '${curFormattedPath}' was removed`];
        }
        default: {
          return acc;
        }
      }
    }, []);

    return result.join('\n');
  };

  return iter(data, []);
};

export { getPlainText, getPlainDiff };
