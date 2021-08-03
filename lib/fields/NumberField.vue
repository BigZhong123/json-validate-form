<template>
  <input type="number" :value="value" @input="handleChange" />
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Schema, FieldPropsDefine } from '../types';
export default {
  props: FieldPropsDefine,
  setup(props: any) {
    const handleChange = (e: any) => {
      const value = e.target.value;
      const num = Number(value);
      if (isNaN(num)) {
        props.onChange(undefined);
      } else {
        props.onChange(num);
      }
    };

    return {
      handleChange,
    };
  },
};
</script>
