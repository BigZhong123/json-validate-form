import { defineComponent, ref, PropType, watch } from 'vue';
import { SelectionWidgetPropsDefine, SelectionWidgetDefine } from '../types';

const Selection: SelectionWidgetDefine = defineComponent({
  name: 'Selection',
  props: SelectionWidgetPropsDefine,
  setup(props) {
    const currentValRef = ref(props.value);

    watch(currentValRef, (newV, oldV) => {
      if (newV !== props.value) {
        props.onChange(newV);
      }
    });

    watch(
      () => props.value,
      (v) => {
        if (v !== currentValRef.value) {
          currentValRef.value = v;
        }
      },
    );

    return () => {
      return (
        <select multiple="true">
          {props.options.map((option, index) => {
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
});

export default Selection;
