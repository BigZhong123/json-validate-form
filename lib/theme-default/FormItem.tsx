import { defineComponent } from 'vue';
import { CommonWidgetPropsDefine, CommonWidgetDefine } from '../types';
import { createUseStyles } from 'vue-jss';

const useStyles = createUseStyles({
  container: {},
  label: {
    color: '#777',
    display: 'block',
  },
  errors: {
    color: 'red',
    margin: '0 5px',
    padding: 0,
    paddingLeft: 20,
    fontSize: 12,
  },
});

const FormItem = defineComponent({
  name: 'FormItem',
  props: CommonWidgetPropsDefine,
  setup(props, { slots }) {
    const classRef = useStyles();

    return () => {
      const { schema } = props;
      let { errors } = props;
      errors = errors || [];
      const classes = classRef.value;
      return (
        <div class={classes.container}>
          <label class={classes.label}>{schema.title}</label>
          {slots.default && slots.default()}
          <ul class={classes.errors}>
            {errors.map((err: string) => (
              <li>{err}</li>
            ))}
          </ul>
        </div>
      );
    };
  },
});

export default FormItem;

export function withFormItem(Widget: any) {
  return defineComponent({
    name: `Wrapped${Widget.name}`,
    props: CommonWidgetPropsDefine,
    setup(props, { attrs }) {
      return () => {
        return (
          <FormItem {...props}>
            <Widget {...props} {...attrs} />
          </FormItem>
        );
      };
    },
  }) as any;
}
