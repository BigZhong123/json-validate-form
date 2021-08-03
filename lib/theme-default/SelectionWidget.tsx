import { defineComponent, ref, PropType, watch } from 'vue';
import { SelectionWidgetDefine, SelectionWidgetPropsDefine } from '../types';
import { withFormItem } from './FormItem';

const SelectionWidget: SelectionWidgetDefine = withFormItem(
  defineComponent({
    name: 'Selection',
    props: SelectionWidgetPropsDefine,
    setup(props) {
      const currentValueRef = ref(props.value);

      watch(currentValueRef, (newv, oldv) => {
        if (newv !== props.value) {
          props.onChange(newv);
        }
      });

      watch(
        () => props.value,
        (v) => {
          if (v !== currentValueRef.value) {
            currentValueRef.value = v;
          }
        },
      );

      return () => {
        const { options } = props;
        return (
          <select multiple={true} v-model={currentValueRef.value}>
            {options.map((option, index) => {
              return (
                <option key={index} value={option.value}>
                  {option.key}
                </option>
              );
            })}
          </select>
        );
      };
    },
  }),
);

export default SelectionWidget;
