<script lang="ts" setup>
import CommonInputWrapper from './CommonInputWrapper.vue';

type commonInput = {
  label?: string;
  id: string;
  modelValue: string | null;
  readonly?: boolean;
};

const props = defineProps<commonInput>();

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <common-input-wrapper :label="props.label" :id="props.id">
    <input
      type="date"
      :id="props.id"
      class="date-input"
      :class="{ readonly: props.readonly }"
      :value="props.modelValue"
      :readonly="props.readonly"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
  </common-input-wrapper>
</template>

<style lang="scss" scoped>
.date-input {
  border: 1px solid var(--vt-c-divider-light);
  outline: none;
  width: 100%;
  padding: 1.2rem 1rem;
  color: var(--vt-c-text-1);
  background: var(--vt-c-bg-soft);
  border-radius: 4px;
  position: relative;
  flex: 1;
  font-size: 1.4rem;

  &.readonly {
    cursor: not-allowed;
  }
}
</style>
