const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true, jsonPointers: true }); // options can be passed, e.g. {allErrors: true}

require('ajv-errors')(ajv);

const localize = require('ajv-i18n');

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      // test: true,
      minLength: 10,
      errorMessage: {
        type: '必须是字符串',
        minLength: '长度不能小于10',
      },
    },
    age: {
      type: 'number',
    },
    pets: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    isWorker: {
      type: 'boolean',
    },
  },
  required: ['name', 'age'],
};

// ajv.addFormat('test', (data) => {
//     console.log(data, '----');
//     return data === 'haha'
// })

ajv.addKeyword('test', {
  macro: function () {
    return {
      minLength: 10,
    };
  },
  // compile(sch, parentSchema) {
  //     console.log(sch, parentSchema);
  //     return () => true;
  // },
  // metaSchema: {
  //     type: 'boolean'
  // }
  // validate: function (schema, data) {
  //     return false
  // }
});

ajv.addKeyword();

const validate = ajv.compile(schema);

const data = {
  name: '123',
  age: 18,
  pets: ['mimi', 'mama'],
  isWorker: false,
  test: 111,
};

const valid = validate(data);
if (!valid) {
  // localize.zh(validate.errors)
  console.log(validate.errors);
}
