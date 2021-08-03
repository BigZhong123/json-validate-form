import { defineComponent, PropType, computed } from 'vue';
import { Schema, SchemaTypes, FieldPropsDefine } from './types';

import StringField from './fields/StringField';
// import StringField from './fields/StringField.vue';
import NumberField from './fields/NumberField';
// import NumberField from './fields/NumberField.vue';
import ObjectField from './fields/ObjectField';
import ArrayField from './fields/ArrayField';
import { retrieveSchema } from './utils';

export default defineComponent({
  name: 'SchemaItem',

  props: FieldPropsDefine,

  setup(props, { slots, emit, attrs }) {
    const retrievedSchemaRef = computed(() => {
      const { schema, rootSchema, value } = props;
      return retrieveSchema(schema, rootSchema, value);
    });

    return () => {
      const retrievedSchema = retrievedSchemaRef.value;
      const schema = props.schema;
      const type = schema.type;
      let Component: any;
      switch (type) {
        case SchemaTypes.STRING: {
          Component = StringField;
          break;
        }
        case SchemaTypes.NUMBER: {
          Component = NumberField;
          break;
        }
        case SchemaTypes.OBJECT: {
          Component = ObjectField;
          break;
        }
        case SchemaTypes.ARRAY: {
          Component = ArrayField;
          break;
        }
        default:
          console.warn(`${type} is not supported`);
          break;
      }

      return <Component {...props} schema={retrievedSchema} />;
    };
  },
});
