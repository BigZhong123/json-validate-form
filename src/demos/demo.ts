import PassWordWidget from '../components/PassWordWidget';

export default {
  name: 'Demo',
  schema: {
    type: 'object',
    properties: {
      pass1: {
        type: 'string',
        // minLength: 10,
        test: true,
        title: 'password',
      },
      pass2: {
        type: 'string',
        minLength: 10,
        title: 're try password',
      },
      color: {
        type: 'string',
        format: 'color',
        title: 'input color',
      },
    },
  },
  customValidate(data: any, errors: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (data.pass1 !== data.pass2) {
          errors.pass2.addError('密码必须相同');
        }
        resolve();
      }, 3000);
    });
  },
  uiSchema: {
    properties: {
      pass1: {
        widget: PassWordWidget,
      },
      pass2: {
        color: 'red',
      },
    },
  },
  default: {
    pass1: '1',
    pass2: '',
  },
};
