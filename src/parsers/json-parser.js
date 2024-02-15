import _ from 'lodash';

const getDiffData = (json1, json2) => {
  const keys = _.uniq([...Object.keys(json1), ...Object.keys(json2)]);

  if (!keys.length) return [];

  const sortedKeys = _.sortBy(keys);

  const result = [];

  sortedKeys.forEach((key) => {
    let status;
    const children = [];
    const values = {};

    // deleted
    if (!Object.hasOwn(json2, key)) {
      status = 'deleted';
      values.old = json1[key];
    }
    // updated
    else if (Object.hasOwn(json1, key)) {
      const isEqual = _.isEqual(json1[key], json2[key]);

      // is equal
      if (isEqual) {
        status = 'no-changes';
        values.old = json1[key];
      }
      // is not equal
      else {
        const isValue1Object = _.isPlainObject(json1[key]);
        const isValue2Object = _.isPlainObject(json2[key]);

        // Is object
        if (isValue1Object && isValue2Object) {
          status = 'no-changes';
          children.push(...getDiffData(json1[key], json2[key]));
        }
        // Is not object
        else {
          status = 'updated';
          values.old = json1[key];
          values.new = json2[key];
        }
      }
    }
    // created
    else {
      status = 'created';
      values.new = json2[key];
    }

    result.push({
      key,
      status,
      values,
      children,
    });
  });

  return result;
};

const stringify = (obj, tab = '', startIndent = '') => {
  const iter = (props, depth) => {
    const keys = Object.keys(props);

    if (!keys.length) return '';

    const indent = tab.repeat(depth);

    const values = keys.map((key) => {
      const keyPart = `${startIndent}${indent}${tab}${key}: `;

      if (_.isPlainObject(props[key])) {
        return keyPart + iter(props[key], depth + 1);
      }

      if (_.isArray(props[key])) {
        return keyPart + JSON.stringify(props[key]);
      }

      return keyPart + props[key];
    });

    return `{\n${values.join('\n')}\n${startIndent}${indent}}`;
  };

  return iter(obj, 0);
};

const getStringValue = (value, tab = '', startIndent = '') => {
  if (_.isPlainObject(value)) {
    return stringify(value, tab, startIndent);
  }

  if (_.isArray(value)) {
    return JSON.stringify(value);
  }

  return value;
};

const getDiff = (json1, json2, indentTemplate = '  $ ') => {
  const data = getDiffData(json1, json2);

  if (!data.length) return '{}';

  const [space, minus, plus] = [' ', '-', '+'].map((symbol) => {
    const indent = indentTemplate.replace(/\$/g, symbol);
    return indent;
  });

  const iter = (iterData, depth) => {
    const indent = space.repeat(depth);

    // eslint-disable-next-line
    const result = iterData.reduce((acc, { key, status, values, children }) => {
      const formattedNewValue = getStringValue(
        values.new,
        space,
        indent + space,
      );
      const formattedOldValue = getStringValue(
        values.old,
        space,
        indent + space,
      );

      switch (status) {
        case 'no-changes': {
          // Has changed children
          if (children.length) {
            acc.push(`${indent}${space}${key}: ${iter(children, depth + 1)}`);
          }
          // No changed children
          else {
            acc.push(`${indent}${space}${key}: ${formattedOldValue}`);
          }
          break;
        }
        case 'created': {
          acc.push(`${indent}${plus}${key}: ${formattedNewValue}`);
          break;
        }
        case 'updated': {
          acc.push(`${indent}${minus}${key}: ${formattedOldValue}`);
          acc.push(`${indent}${plus}${key}: ${formattedNewValue}`);
          break;
        }
        case 'deleted': {
          acc.push(`${indent}${minus}${key}: ${formattedOldValue}`);
          break;
        }
        default: {
          break;
        }
      }

      return acc;
    }, []);

    return `{\n${result.join('\n')}\n${indent}}`;
  };

  return iter(data, 0);
};

// eslint-disable-next-line
export { getDiffData, getDiff, stringify };
