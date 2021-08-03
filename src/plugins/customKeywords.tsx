import { CustomKeywords, Schema } from 'lib';

const test: CustomKeywords = {
  name: 'test',
  definition: {
    macro: () => {
      return {
        minLength: 10,
      };
    },
  },
  transformSchema(schema: Schema) {
    return {
      ...schema,
      minLength: 10,
    };
  },
};

export default test;
