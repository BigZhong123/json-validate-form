import { Schema } from './types';
import Ajv from 'ajv';
// import i18n from 'ajv-i18n';
const i18n = require('ajv-i18n'); // eslint-disable-line
import toPath from 'lodash.topath';
import { isObject } from './utils';

interface TransformedErrorObject {
  name: string;
  property: string;
  message: string | undefined;
  params: Ajv.ErrorParameters;
  schemaPath: string;
}

function transformErrors(errors: Ajv.ErrorObject[] | undefined): TransformedErrorObject[] {
  if (errors === null || errors === undefined) {
    return [];
  }

  return errors.map(({ message, dataPath, keyword, params, schemaPath }) => {
    return {
      name: keyword,
      property: `${dataPath}`,
      message,
      params,
      schemaPath,
    };
  });
}

interface ErrorSchemaObject {
  [level: string]: ErrorSchema;
}

export type ErrorSchema = ErrorSchemaObject & {
  __errors?: string[];
};

function toErrorSchema(errors: TransformedErrorObject[]): ErrorSchema | {} {
  if (errors.length < 1) {
    return {};
  }

  return errors.reduce((errorSchema, error) => {
    const { property, message } = error;
    const path = toPath(property);
    let parent = errorSchema;

    if (path.length > 0 && path[0] === '') {
      path.splice(0, 1);
    }

    for (const segment of path.slice(0)) {
      if (!(segment in parent)) {
        (parent as any)[segment] = {};
      }
      parent = parent[segment];
    }

    if (Array.isArray(parent.__errors)) {
      parent.__errors = parent.__errors.concat(message || '');
    } else {
      if (message) {
        parent.__errors = [message];
      }
    }
    return errorSchema;
  }, {} as ErrorSchema);
}

export async function validateFormData(validator: Ajv.Ajv, formData: any, schema: Schema, locale = 'zh', customValidate?: (d: any, e: any) => void) {
  let validationError: any = null;
  try {
    validator.validate(schema, formData);
  } catch (error) {
    validationError = error;
  }
  i18n[locale](validator.errors);

  let errors = transformErrors(validator.errors as any);

  if (validationError) {
    errors = [
      ...errors,
      {
        message: validationError.message,
      } as TransformedErrorObject,
    ];
  }

  const errorSchema = toErrorSchema(errors);

  if (!customValidate) {
    return {
      errors,
      errorSchema,
      valid: errors.length === 0,
    };
  }

  const proxy = createErrorProxy();
  await customValidate(formData, proxy);
  const newErrorSchema = mergeObjects(errorSchema, proxy, true);

  console.log({
    errors,
    errorSchema: newErrorSchema,
    valid: errors.length === 0,
  });

  return {
    errors,
    errorSchema: newErrorSchema,
    valid: errors.length === 0,
  };
}

const createErrorProxy = () => {
  const raw = {};
  return new Proxy(raw, {
    get(target, key, receiver) {
      if (key === 'addError') {
        return (msg: string) => {
          const __errors = Reflect.get(target, '__errors', receiver);
          if (__errors && Array.isArray(__errors)) {
            __errors.push(msg);
          } else {
            (target as any)['__errors'] = [msg];
          }
        };
      }
      const res = Reflect.get(target, key, receiver);
      if (res === undefined) {
        const p: any = createErrorProxy();
        (target as any)[key] = p;
        return p;
      }
      return res;
    },
  });
};

export function mergeObjects(obj1: any, obj2: any, concatArray = false) {
  const acc = Object.assign({}, obj1);
  return Object.keys(obj2).reduce((acc, key) => {
    const left = obj1 ? obj1[key] : {};
    const right = obj2[key];
    if (obj1 && Object.prototype.hasOwnProperty.call(obj1, key) && isObject(right)) {
      acc[key] = mergeObjects(left, right, concatArray);
    } else if (concatArray && Array.isArray(left) && Array.isArray(right)) {
      acc[key] = left.concat(right);
    } else {
      acc[key] = right;
    }
    return acc;
  }, acc);
}
