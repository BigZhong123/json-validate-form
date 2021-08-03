import { shallowMount, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';

import JsonSchemaForm, { NumberField } from '../../lib';

describe('JsonSchemaForm', () => {
  it('NumberField should be correct render', async () => {
    let value = '';
    const wrapper = mount(JsonSchemaForm, {
      props: {
        schema: {
          type: 'number',
        },
        value,
        onChange: (v: any) => {
          value = v;
        },
      },
    });

    const numberField = wrapper.findComponent(NumberField);
    expect(numberField.exists()).toBeTruthy();

    const input = numberField.find('input');
    input.element.value = '123';
    input.trigger('input');
    expect(value).toBe(123);
  });
});
