import { defineComponent, PropType, provide, Ref, watch, shallowRef, watchEffect, ref, computed } from 'vue';
import { Schema, UISchema, CustomFormat, CommonWidgetDefine, CustomKeywords } from './types';
import { SchemaFormContextKey } from './context';
import { Theme } from './types';
import Ajv, { Options } from 'ajv';
import { validateFormData, ErrorSchema } from './validator';

import SchemaItem from './SchemaItems';

interface ContextRef {
  doValidate: () => Promise<{
    errors: any[];
    valid: boolean;
  }>;
}

const defaultAjvOptions: Options = {
  allErrors: true,
  // jsonPointers: true,
};

export default defineComponent({
  name: 'SchemaForm',

  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    value: {
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
    contextRef: {
      type: Object as PropType<Ref<ContextRef | undefined>>,
    },
    ajvOptions: {
      type: Object as PropType<Options>,
    },
    locale: {
      type: String,
      default: 'zh',
    },
    customValidate: {
      type: Function as PropType<(data: any, errors: any) => void>,
    },
    uiSchema: {
      type: Object as PropType<UISchema>,
    },
    customFormat: {
      type: [Object, Array] as PropType<CustomFormat | CustomFormat[]>,
    },
    customKeywords: {
      type: [Object, Array] as PropType<CustomKeywords | CustomKeywords[]>,
    },
    // theme: {
    //   type: Object as PropType<Theme>,
    //   required: true,
    // },
  },

  setup(props, { slots, emit, attrs }) {
    const handleChange = (v: any) => {
      props.onChange(v);
    };

    const formatMapRef = computed(() => {
      if (props.customFormat) {
        const customFormats = Array.isArray(props.customFormat) ? props.customFormat : [props.customFormat];
        return customFormats.reduce((result, format) => {
          result[format.name] = format.component;
          return result;
        }, {} as { [key: string]: CommonWidgetDefine });
      } else {
        return {};
      }
    });

    const customKeywordsRef = computed(() => {
      if (props.customKeywords) {
        const customKeywords = Array.isArray(props.customKeywords) ? props.customKeywords : [props.customKeywords];
        return (schema: Schema) => {
          let newSchema = schema;
          customKeywords.forEach((keyword) => {
            if ((schema as any)[keyword.name]) {
              newSchema = keyword.transformSchema(schema);
            }
          });
          return newSchema;
        };
      } else {
        return (s: Schema) => s;
      }
    });

    const context = {
      SchemaItem,
      formatMapRef,
      customKeywordsRef,
    };

    provide(SchemaFormContextKey, context);

    const validatorRef: Ref<Ajv.Ajv> = shallowRef() as any;
    const errorSchemaRef: Ref<ErrorSchema> = shallowRef({});

    const validateResolveRef = ref();
    const validateIndexRef = ref(0);

    async function doValidate() {
      const index = (validateIndexRef.value += 1);

      const result = await validateFormData(validatorRef.value, props.value, props.schema, props.locale, props.customValidate);

      if (index !== validateIndexRef.value) {
        return;
      }

      errorSchemaRef.value = result.errorSchema;
      // return result;

      validateResolveRef.value(result);
      validateResolveRef.value = undefined;
    }

    watchEffect(() => {
      validatorRef.value = new Ajv({
        ...defaultAjvOptions,
        ...props.ajvOptions,
      });

      if (props.customFormat) {
        const customFormats = Array.isArray(props.customFormat) ? props.customFormat : [props.customFormat];
        customFormats.forEach((format) => {
          validatorRef.value.addFormat(format.name, format.definition);
        });
      }

      if (props.customKeywords) {
        const customKeywords = Array.isArray(props.customKeywords) ? props.customKeywords : [props.customKeywords];
        customKeywords.forEach((keyword) => {
          validatorRef.value.addKeyword(keyword.name, keyword.definition);
        });
      }
    });

    watch(
      () => props.value,
      () => {
        if (validateResolveRef.value) {
          doValidate();
        }
      },
      {
        deep: true,
      },
    );

    watch(
      () => props.contextRef,
      () => {
        if (props.contextRef) {
          props.contextRef.value = {
            async doValidate() {
              // const result = await validateFormData(validatorRef.value, props.value, props.schema, props.locale, props.customValidate);
              // errorSchemaRef.value = result.errorSchema;
              // return result;

              return new Promise((resolve) => {
                validateResolveRef.value = resolve;
                doValidate();
              });
            },
          };
        }
      },
      {
        immediate: true,
      },
    );

    return () => {
      const { schema, value, uiSchema, customFormat } = props;

      return <SchemaItem schema={schema} uiSchema={uiSchema || {}} rootSchema={schema} value={value} onChange={handleChange} errorSchema={errorSchemaRef.value || {}} />;
    };
  },
});
