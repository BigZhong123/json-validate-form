import { defineComponent, DefineComponent } from 'vue';

import { FieldPropsDefine, CommonFieldType } from '../types';
import { isObject } from '../utils';
import { SchemaFormContextKey, useVJSFContext } from '../context';

// import SchemaItem from '../SchemaItem'

// console.log(SchemaItem)

const schema = {
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

export default defineComponent({
  name: 'ObjectField',
  props: FieldPropsDefine,
  setup(props) {
    const context = useVJSFContext();

    const handleObjectFieldChange = (key: string, v: any) => {
      const value: any = isObject(props.value) ? props.value : {};

      if (v === undefined) {
        delete value[key];
      } else {
        value[key] = v;
      }
      props.onChange(value);
    };

    return () => {
      const { schema, rootSchema, value, errorSchema, uiSchema } = props;

      const { SchemaItem } = context;

      const properties = schema.properties || {};

      const currentValue: any = isObject(value) ? value : {};

      return Object.keys(properties).map((k: string, index: number) => <SchemaItem schema={properties[k]} uiSchema={uiSchema.properties ? uiSchema.properties[k] || {} : {}} rootSchema={rootSchema} value={currentValue[k]} errorSchema={errorSchema[k] || {}} key={index} onChange={(v: any) => handleObjectFieldChange(k, v)} />);
    };
  },
});
