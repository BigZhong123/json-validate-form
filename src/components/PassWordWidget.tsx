import { defineComponent } from 'vue';
import { CommonWidgetDefine, CommonWidgetPropsDefine } from '../../lib/types';
import { withFormItem } from '../../lib/theme-default/FormItem';

const PassWordWidget: CommonWidgetDefine = withFormItem(
  defineComponent({
    name: 'PassWordWidget',
    props: CommonWidgetPropsDefine,
    setup(props) {
      const handleChange = (e: any) => {
        const value = e.target.value;
        e.target.value = props.value;
        props.onChange(value);
      };

      return () => {
        return <input type="password" value={props.value as any} onInput={handleChange} />;
      };
    },
  }),
);

export default PassWordWidget;
