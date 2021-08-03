<template>
  <input type="text" :value="value" @input="handleChange" />
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Schema, FieldPropsDefine } from '../types';
export default {
  props: FieldPropsDefine,
  setup(props: any) {
    const handleChange = (e: any) => {
      props.onChange(e.target.value);
    };

    return {
      handleChange,
    };
  },
};
</script>
