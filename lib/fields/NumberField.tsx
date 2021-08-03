import { FieldPropsDefine, CommonWidgetNames } from '../types';
import { defineComponent } from 'vue';
import { getWidget } from '../theme';

export default defineComponent({
  name: 'NumberFeild',
  props: FieldPropsDefine,
  setup(props) {
    const handleChange = (value: string) => {
      const num = Number(value);

      if (Number.isNaN(num)) {
        props.onChange(undefined);
      } else {
        props.onChange(num);
      }
    };

    const NumberWidgetRef = getWidget(CommonWidgetNames.NumberWidget, props);

    return () => {
      const NumberWidget = NumberWidgetRef.value;
      const { rootSchema, errorSchema, ...rest } = props;
      return <NumberWidget {...rest} onChange={handleChange} errors={errorSchema.__errors} />;
    };
  },
});
