import _ from 'lodash';

const getJsonsUniqKeys = (json1, json2) => {
  const keys = _.uniq([...Object.keys(json1), ...Object.keys(json2)]);

  return _.sortBy(keys);
};

const getPropDiffData = (json1, json2, key) => {
  const data = {
    key,
    children: [],
    values: {},
  };

  // deleted
  if (!Object.hasOwn(json2, key)) {
    return {
      ...data,
      status: 'deleted',
      values: { old: json1[key] },
    };
  }

  // updated
  if (Object.hasOwn(json1, key)) {
    const isEqual = _.isEqual(json1[key], json2[key]);

    // is equal
    if (isEqual) {
      return {
        ...data,
        status: 'no-changes',
        values: { old: json1[key] },
      };
    }

    // is not equal
    const isValue1Object = _.isPlainObject(json1[key]);
    const isValue2Object = _.isPlainObject(json2[key]);

    // Is object
    if (isValue1Object && isValue2Object) {
      const keys = getJsonsUniqKeys(json1[key], json2[key]);

      return {
        ...data,
        status: 'no-changes',
        children: [
          ...data.children,
          // eslint-disable-next-line
          ...keys.map((innerKey) => {
            return getPropDiffData(json1[key], json2[key], innerKey);
          }),
        ],
      };
    }

    // Is not object
    return {
      ...data,
      status: 'updated',
      values: {
        ...data.values,
        old: json1[key],
        new: json2[key],
      },
    };
  }

  // created
  return {
    ...data,
    status: 'created',
    values: {
      new: json2[key],
    },
  };
};

const getDiffData = (json1, json2) => {
  const keys = getJsonsUniqKeys(json1, json2);

  if (!keys.length) return [];

  return keys.map((key) => getPropDiffData(json1, json2, key));
};

export { getJsonsUniqKeys, getPropDiffData, getDiffData };
