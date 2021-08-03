import SelectionWidget from './SelectionWidget';
import TextWidget from './TextWidget';
import NumberWidget from './NumberWidget';

import { CommonWidgetPropsDefine, CommonWidgetDefine, Theme } from '../types';
import { defineComponent } from 'vue';

const CommonWidget: CommonWidgetDefine = defineComponent({
  props: CommonWidgetPropsDefine,
  setup() {
    return () => null;
  },
});

const DefaultTheme: Theme = {
  widgets: {
    SelectionWidget,
    NumberWidget: CommonWidget,
    TextWidget: CommonWidget,
  },
};

export default {
  widgets: {
    SelectionWidget,
    NumberWidget,
    TextWidget,
  },
};
