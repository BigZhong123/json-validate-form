import { ErrorSchema } from './validator';
import { PropType, defineComponent, DefineComponent } from 'vue';
import { FormatDefinition, KeywordDefinition, CompilationContext } from 'ajv';

export enum SchemaTypes {
  'NUMBER' = 'number',
  'INTEGER' = 'integer',
  'STRING' = 'string',
  'OBJECT' = 'object',
  'ARRAY' = 'array',
  'BOOLEAN' = 'boolean',
}

type SchemaRef = { $ref: string };

export interface Schema {
  type?: SchemaTypes | string;
  const?: any;
  format?: string;

  title?: string;
  default?: any;

  properties?: {
    [key: string]: Schema;
  };
  items?: Schema | Schema[] | SchemaRef;
  uniqueItems?: any;
  dependencies?: {
    [key: string]: string[] | Schema | SchemaRef;
  };
  oneOf?: Schema[];
  anyOf?: Schema[];
  allOf?: Schema[];
  // TODO: uiSchema
  // vjsf?: VueJsonSchemaConfig
  required?: string[];
  enum?: any[];
  enumNames?: any[];
  enumKeyValue?: any[];
  additionalProperties?: any;
  additionalItems?: Schema;

  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  multipleOf?: number;
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
}

export const FieldPropsDefine = {
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
  rootSchema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  errorSchema: {
    type: Object as PropType<ErrorSchema>,
    required: true,
  },
  uiSchema: {
    type: Object as PropType<UISchema>,
    required: true,
  },
} as const;

const TypeHelperComponent = defineComponent({
  props: FieldPropsDefine,
});

export type CommonFieldType = typeof TypeHelperComponent;

export const CommonWidgetPropsDefine = {
  value: {
    required: true,
  },
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
  errors: {
    type: Array as PropType<string[]>,
  },
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  options: {
    type: Object as PropType<{ [key: string]: any }>,
  },
} as const;

export const SelectionWidgetPropsDefine = {
  ...CommonWidgetPropsDefine,
  options: {
    type: Array as PropType<{ key: string; value: string }[]>,
    required: true,
  },
} as const;

export enum SelectionWidgetNames {
  SelectionWidget = 'SelectionWidget',
}

export enum CommonWidgetNames {
  TextWidget = 'TextWidget',
  NumberWidget = 'NumberWidget',
}

export type CommonWidgetDefine = DefineComponent<typeof CommonWidgetPropsDefine, {}, {}>;

export type SelectionWidgetDefine = DefineComponent<typeof SelectionWidgetPropsDefine, {}, {}>;

export interface Theme {
  widgets: {
    [SelectionWidgetNames.SelectionWidget]: SelectionWidgetDefine;
    [CommonWidgetNames.TextWidget]: CommonWidgetDefine;
    [CommonWidgetNames.NumberWidget]: CommonWidgetDefine;
  };
}

export type UISchema = {
  widget?: string | CommonWidgetDefine;
  properties?: {
    [key: string]: UISchema;
  };
  items?: UISchema | UISchema[];
} & {
  [key: string]: any;
};

export interface CustomFormat {
  name: string;
  definition: FormatDefinition;
  component: CommonWidgetDefine;
}

interface CustomKeywordsDefinition {
  type?: string | Array<string>;
  async?: boolean;
  $data?: boolean;
  errors?: boolean | string;
  metaSchema?: object;
  // schema: false makes validate not to expect schema (ValidateFunction)
  schema?: boolean;
  statements?: boolean;
  dependencies?: Array<string>;
  modifying?: boolean;
  valid?: boolean;
  // one and only one of the following properties should be present
  macro?: (schema: any, parentSchema: object, it: CompilationContext) => object | boolean;
}

export interface CustomKeywords {
  name: string;
  definition: CustomKeywordsDefinition;
  transformSchema: (s: Schema) => Schema;
}
