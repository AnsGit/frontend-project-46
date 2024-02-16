import _ from 'lodash';

const getDiffData = (json1, json2) => {
  const keys = _.uniq([...Object.keys(json1), ...Object.keys(json2)]);

  if (!keys.length) return [];

  const sortedKeys = _.sortBy(keys);

  const result = [];

  sortedKeys.forEach((key) => {
    const data = {
      key,
      children: [],
      values: {},
    };

    // deleted
    if (!Object.hasOwn(json2, key)) {
      data.status = 'deleted';
      data.values.old = json1[key];
    }
    // updated
    else if (Object.hasOwn(json1, key)) {
      const isEqual = _.isEqual(json1[key], json2[key]);

      // is equal
      if (isEqual) {
        data.status = 'no-changes';
        data.values.old = json1[key];
      }
      // is not equal
      else {
        const isValue1Object = _.isPlainObject(json1[key]);
        const isValue2Object = _.isPlainObject(json2[key]);

        // Is object
        if (isValue1Object && isValue2Object) {
          data.status = 'no-changes';
          data.children.push(...getDiffData(json1[key], json2[key]));
        }
        // Is not object
        else {
          data.status = 'updated';
          data.values.old = json1[key];
          data.values.new = json2[key];
        }
      }
    }
    // created
    else {
      data.status = 'created';
      data.values.new = json2[key];
    }

    result.push(data);
  });

  return result;
};

// eslint-disable-next-line
export { getDiffData };
