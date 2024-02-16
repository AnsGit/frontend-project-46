import _ from 'lodash';

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

const getStylishValue = (value, tab = '', startIndent = '') => {
  if (_.isPlainObject(value)) {
    return stringify(value, tab, startIndent);
  }

  if (_.isArray(value)) {
    return JSON.stringify(value);
  }

  return String(value);
};

const getStylishDiff = (data, indentTemplate = '  $ ') => {
  if (!data.length) return '{}';

  const [space, minus, plus] = [' ', '-', '+'].map((symbol) => {
    const indent = indentTemplate.replace(/\$/g, symbol);
    return indent;
  });

  const iter = (iterData, depth) => {
    const indent = space.repeat(depth);

    // eslint-disable-next-line
    const result = iterData.reduce((acc, { key, status, values, children }) => {
      const stylishNewValue = getStylishValue(
        values.new,
        space,
        indent + space,
      );
      const stylishOldValue = getStylishValue(
        values.old,
        space,
        indent + space,
      );

      switch (status) {
        case 'no-changes': {
          // Has changed children
          if (children.length) {
            return [
              ...acc,
              `${indent}${space}${key}: ${iter(children, depth + 1)}`,
            ];
          }
          // No changed children
          return [...acc, `${indent}${space}${key}: ${stylishOldValue}`];
        }
        case 'created': {
          return [...acc, `${indent}${plus}${key}: ${stylishNewValue}`];
        }
        case 'updated': {
          return [
            ...acc,
            `${indent}${minus}${key}: ${stylishOldValue}`,
            `${indent}${plus}${key}: ${stylishNewValue}`,
          ];
        }
        case 'deleted': {
          return [...acc, `${indent}${minus}${key}: ${stylishOldValue}`];
        }
        default: {
          return acc;
        }
      }
    }, []);

    return `{\n${result.join('\n')}\n${indent}}`;
  };

  return iter(data, 0);
};

export { stringify, getStylishValue, getStylishDiff };
