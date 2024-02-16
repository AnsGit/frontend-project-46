const getJsonDiff = (data) => {
  if (!data.length) return '{}';

  const iter = (iterData) => {
    // eslint-disable-next-line
    const result = iterData.reduce((acc, { key, status, values, children }) => {
      switch (status) {
        case 'no-changes': {
          // Has changed children
          if (children.length) {
            return {
              ...acc,
              [key]: iter(children),
            };
          }
          // No changed children
          return {
            ...acc,
            [key]: values.old,
          };
        }
        case 'created':
        case 'updated': {
          return {
            ...acc,
            [key]: values.new,
          };
        }
        case 'deleted': {
          return acc;
        }
        default: {
          return acc;
        }
      }
    }, {});

    return result;
  };

  return JSON.stringify(iter(data));
};

// eslint-disable-next-line
export { getJsonDiff };
