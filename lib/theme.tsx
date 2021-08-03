import { provide, inject, defineComponent, PropType, computed, ComputedRef, ref, shallowRef, ExtractPropTypes } from 'vue';

import { Theme, SelectionWidgetNames, CommonWidgetNames, UISchema, CommonWidgetDefine, FieldPropsDefine } from './types';

import { useVJSFContext } from './context';

const THEME_PROVIDE_KEY = Symbol();

const ThemeProvider = defineComponent({
  name: 'VJSFThemeProvide',
  props: {
    theme: {
      type: Object as PropType<Theme>,
      required: true,
    },
  },

  setup(props, { slots }) {
    const context = computed(() => {
      return props.theme;
    });

    provide(THEME_PROVIDE_KEY, context);

    return () => {
      return slots.default && slots.default();
    };
  },
});

export function getWidget<T extends SelectionWidgetNames | CommonWidgetNames>(name: T, props?: ExtractPropTypes<typeof FieldPropsDefine>) {
  const context: ComputedRef<Theme> | undefined = inject<ComputedRef<Theme>>(THEME_PROVIDE_KEY);
  if (!context) {
    throw new Error('vjsf theme required');
  }

  if (props) {
    const { uiSchema, schema } = props;
    const formatContext = useVJSFContext();

    if (uiSchema && uiSchema.widget) {
      return shallowRef(uiSchema.widget as CommonWidgetDefine);
    }

    if (schema.format) {
      if (formatContext.formatMapRef.value[schema.format]) {
        return ref(formatContext.formatMapRef.value[schema.format]);
      }
    }
  }

  const widgetRef = computed(() => {
    return context.value.widgets[name];
  });

  return widgetRef;
}

export default ThemeProvider;
