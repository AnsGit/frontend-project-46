const getJsonDiff = (data) => {
  if (!data.length) return '{}';

  const iter = (iterData) => {
    // eslint-disable-next-line
    const result = iterData.reduce((acc, { key, status, values, children }) => {
      switch (status) {
        case 'no-changes': {
          // Has changed children
          if (children.length) {
            acc[key] = iter(children);
          }
          // No changed children
          else {
            acc[key] = values.old;
            return acc;
          }
          break;
        }
        case 'created':
        case 'updated': {
          acc[key] = values.new;
          break;
        }
        case 'deleted': {
          return acc;
        }
        default: {
          return acc;
        }
      }

      return acc;
    }, {});

    return result;
  };

  return JSON.stringify(iter(data));
};

// eslint-disable-next-line
export { getJsonDiff };
