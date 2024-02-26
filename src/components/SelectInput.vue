<script lang="ts" setup>
import { ref, computed } from 'vue';
import { onClickOutside } from '@vueuse/core';

import DropDownList from './DropDownList.vue';
import CommonInputWrapper from './CommonInputWrapper.vue';

type commonInput = {
  label?: string;
  id: string;
  placeholder: string;
  modelValue: string | number | null;
  optionsList: Array<string>;
};

const props = withDefaults(defineProps<commonInput>(), {
  placeholder: '',
  inputType: 'text',
});

const emit = defineEmits(['update:modelValue']);

const dropDownOpen = ref(false);
const dropDownWrapper = ref(null);
const filterText = ref<null | string>(null);

const textToDisplay = computed(() => {
  if (!props.modelValue && filterText.value) return filterText.value;
  return props.modelValue;
});

const filteredList = computed(() => {
  if (filterText.value === null) return props.optionsList;
  const filterTextLC = filterText.value.toLowerCase();
  const filtered = props.optionsList.filter((curr) => {
    if (`${curr}`.toLowerCase().startsWith(filterTextLC)) return curr;
  });
  return filtered.length === 0 ? ['No match found'] : filtered;
});

onClickOutside(dropDownWrapper, () => {
  dropDownOpen.value = false;
  filterText.value = null;
});

function optionSelected(option: string) {
  dropDownOpen.value = false;
  filterText.value = null;
  emit('update:modelValue', option);
}

function clearInput(e: KeyboardEvent) {
  const key = e.key;
  if (key === 'Backspace' && props.modelValue) {
    filterText.value = null;
    emit('update:modelValue', null);
  }
}
</script>

<template>
  <common-input-wrapper :label="props.label" :id="props.id">
    <div ref="dropDownWrapper" class="select-input-wrapper">
      <input
        type="text"
        :id="props.id"
        class="select-input"
        :placeholder="props.placeholder"
        :value="textToDisplay"
        autocomplete="off"
        @focus="dropDownOpen = true"
        @keydown="clearInput"
        @input="filterText = ($event.target as HTMLInputElement).value"
      />
      <drop-down-list
        :show="dropDownOpen"
        :list-items="filteredList"
        @selected="optionSelected"
      />
    </div>
  </common-input-wrapper>
</template>

<style lang="scss" scoped>
.select-input {
  width: 100%;
  border: 1px solid var(--vt-c-divider-light);
  outline: none;
  padding: 1.2rem 1rem;
  color: var(--vt-c-text-1);
  background: var(--vt-c-bg-soft);
  border-radius: 4px;
  font-size: 1.4rem;

  &-wrapper {
    position: relative;
  }
}
</style>
