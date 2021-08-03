import { CommonWidgetDefine, CommonWidgetPropsDefine } from '../types';
import { defineComponent, nextTick, computed } from 'vue';
import { withFormItem } from './FormItem';

const TextWidget: CommonWidgetDefine = withFormItem(
  defineComponent({
    name: 'TextWidget',
    props: CommonWidgetPropsDefine,
    setup(props) {
      const handleChange = (e: any) => {
        const value = e.target.value;
        e.target.value = props.value;
        props.onChange(value);

        // nextTick(() => {
        //   if (e.target.value !== props.value) {
        //     e.target.value = props.value;
        //   }
        // });
      };

      const styleRef = computed(() => {
        return {
          color: (props.options && props.options.color) || 'black',
        };
      });

      return () => {
        return <input type="text" value={props.value as any} onInput={handleChange} style={styleRef.value} />;
      };
    },
  }),
);

export default TextWidget;
