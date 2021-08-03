import { mount } from '@vue/test-utils';

import JsonSchemaFrom, { StringField, NumberField } from '../../lib';

describe('ObjectField', () => {
  let schema: any;
  beforeEach(() => {
    schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        age: {
          type: 'number',
        },
      },
    };
  });

  it('ObjectField should render correct NumberField and stringField', async () => {
    const wrapper = mount(JsonSchemaFrom, {
      props: {
        schema,
        value: {},
        onChange: () => {},
      },
    });

    const numberField = wrapper.findComponent(NumberField);
    const stringField = wrapper.findComponent(StringField);

    expect(numberField.exists()).toBeTruthy();
    expect(stringField.exists()).toBeTruthy();
  });

  it('ObjectField should change correct when subField trigger onChange', async () => {
    let value: any = {};

    const wrapper = mount(JsonSchemaFrom, {
      props: {
        schema,
        value,
        onChange: (v: any) => {
          value = v;
        },
      },
    });

    const numberField = wrapper.findComponent(NumberField);
    const stringField = wrapper.findComponent(StringField);

    await numberField.props('onChange')(18);
    await stringField.props('onChange')('123');

    expect(value.age).toBe(18);
    expect(value.name).toBe('123');
  });

  it('ObjectField should change correct when subField trigger onChange 2', async () => {
    let value = {
      name: '123',
    };

    const wrapper = mount(JsonSchemaFrom, {
      props: {
        schema,
        value,
        onChange: (v: any) => {
          value = v;
        },
      },
    });

    const stringField = wrapper.findComponent(StringField);

    await stringField.props('onChange')(undefined);

    expect(value.name).toBeUndefined();
  });
});
