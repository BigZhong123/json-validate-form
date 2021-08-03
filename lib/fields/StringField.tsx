import { defineComponent, computed } from 'vue';

import { FieldPropsDefine } from '../types';
import { getWidget } from '../theme';
import { CommonWidgetNames } from '../types';

export default defineComponent({
  name: 'StringFeild',
  props: FieldPropsDefine,
  setup(props) {
    const handleChange = (v: string) => {
      props.onChange(v);
    };

    const TextWidgetRef = computed(() => {
      const widgetRef = getWidget(CommonWidgetNames.TextWidget, props);
      return widgetRef.value;
    });

    const optionsRef = computed(() => {
      const { widget, properties, items, ...rest } = props.uiSchema;
      return rest;
    });

    return () => {
      const { rootSchema, errorSchema, ...rest } = props;

      const TextWidget = TextWidgetRef.value;

      return <TextWidget {...rest} options={optionsRef.value} onChange={handleChange} errors={errorSchema.__errors} />;
    };
  },
});
