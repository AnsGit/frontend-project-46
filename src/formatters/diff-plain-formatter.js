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

const getPlainText = (status, path, ...values) => {
  const templates = {
    created: `Property '${path}' was added with value: {value-0}`,
    updated: `Property '${path}' was updated. From {value-0} to {value-1}`,
    deleted: `Property '${path}' was removed`,
  };

  // eslint-disable-next-line
  return values.reduce((acc, value, i) => {
    return acc.replace(`{value-${i}}`, value);
  }, templates[status]);
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
          // Has changed children
          if (children.length) {
            acc.push(iter(children, curPath));
          }
          // No changed children
          else {
            return acc;
          }
          break;
        }
        case 'created': {
          acc.push(getPlainText(status, curFormattedPath, plainNewValue));
          break;
        }
        case 'updated': {
          acc.push(
            getPlainText(
              status,
              curFormattedPath,
              plainOldValue,
              plainNewValue,
            ),
          );
          break;
        }
        case 'deleted': {
          acc.push(`Property '${curFormattedPath}' was removed`);
          break;
        }
        default: {
          return acc;
        }
      }

      return acc;
    }, []);

    return result.join('\n');
  };

  return iter(data, []);
};

export { getPlainText, getPlainDiff };
