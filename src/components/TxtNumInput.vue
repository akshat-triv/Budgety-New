<script lang="ts" setup>
import CommonInputWrapper from './CommonInputWrapper.vue';

type commonInput = {
  label?: string;
  id: string;
  palceholder: string;
  inputType: 'text' | 'number';
  modelValue: string | number | null;
};

const props = withDefaults(defineProps<commonInput>(), {
  palceholder: '',
  inputType: 'text',
});

const emit = defineEmits(['update:modelValue']);

function numbersOnly(e: KeyboardEvent) {
  const key = e.key;
  if (props.inputType === 'number' && key.length === 1) {
    const ascii = key.charCodeAt(0);
    if (ascii !== 46 && !(ascii < 58 && ascii > 47)) e.preventDefault();
  }
}

function updateValue(value: string) {
  if (props.inputType === 'number') emit('update:modelValue', Number(value));
  else emit('update:modelValue', value);
}
</script>

<template>
  <common-input-wrapper :label="props.label" :id="props.id">
    <input
      type="text"
      :id="props.id"
      class="txt-num-input"
      :placeholder="props.palceholder"
      :value="props.modelValue"
      @keydown="numbersOnly"
      @input="updateValue(($event.target as HTMLInputElement).value)"
    />
  </common-input-wrapper>
</template>

<style lang="scss" scoped>
.txt-num-input {
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
}
</style>
