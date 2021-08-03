import { CommonFieldType, Theme, CommonWidgetDefine, Schema } from './types';
import { inject, Ref } from 'vue';

export const SchemaFormContextKey = Symbol();

export const useVJSFContext = () => {
  const context:
    | {
        SchemaItem: CommonFieldType;
        formatMapRef: Ref<{ [key: string]: CommonWidgetDefine }>;
        customKeywords: Ref<(s: Schema) => Schema>;
      }
    | undefined = inject(SchemaFormContextKey);

  if (!context) {
    throw new Error('SchemaForm should be used');
  }

  return context;
};
