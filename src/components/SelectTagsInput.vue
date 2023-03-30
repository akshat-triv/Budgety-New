<script lang="ts" setup>
type commonInput = {
  label?: string;
  id: string;
  palceholder: string;
  modelValue: Array<string>;
  selectLimit?: number;
  optionsList: Array<string>;
};

const props = withDefaults(defineProps<commonInput>(), {
  palceholder: "",
  inputType: "text",
});

const emit = defineEmits(["update:modelValue"]);

const dropDownOpen = ref(false);
const dropDownWrapper = ref(null);
const filterText = ref<null | string>(null);

const filteredList = computed(() => {
  if (filterText.value === null && props.modelValue.length === 0)
    return props.optionsList;

  const filterTextLC = filterText.value?.toLowerCase();

  const filtered = props.optionsList.filter((curr) => {
    if (props.modelValue.includes(curr)) return false;

    if (filterTextLC) return `${curr}`.toLowerCase().startsWith(filterTextLC);

    return true;
  });
  return filtered.length === 0 ? ["No match found"] : filtered;
});

onClickOutside(dropDownWrapper, () => {
  dropDownOpen.value = false;
  filterText.value = null;
});

function optionSelected(option: string) {
  dropDownOpen.value = false;
  filterText.value = null;
  const updatedValue = [...props.modelValue, option];
  emit("update:modelValue", updatedValue);
}

function clearInput(e: KeyboardEvent) {
  const key = e.key;
  if (key === "Backspace" && filterText.value === null) {
    const updatedValue = [...props.modelValue];
    updatedValue.pop();
    emit("update:modelValue", updatedValue);
  }
}
</script>

<template>
  <CoreComponentsCommonInputWrapper :label="props.label" :id="props.id">
    <div ref="dropDownWrapper" class="relative">
      <div
        class="w-100 dark:bg-gray-700 bg-gray-200 rounded flex flex-wrap dark:text-white text-slate-700 transition-all overflow-hidden"
        :class="{ 'px-2 py-2': props.modelValue.length }"
      >
        <span
          v-for="(tag, tagIdx) of props.modelValue"
          :key="`tag-${tagIdx}`"
          class="tag px-2 py-1 dark:bg-gray-900 bg-gray-100 rounded text-sm inline-block"
          :class="{ 'mr-1': tagIdx !== props.modelValue.length - 1 }"
        >
          {{ tag }}
        </span>
        <input
          type="text"
          :id="props.id"
          class="flex-1 border-none outline-none px-2 py-1 bg-transparent"
          :placeholder="props.palceholder"
          :value="filterText"
          :readonly="
            props.selectLimit
              ? props.modelValue.length === props.selectLimit
              : false
          "
          autocomplete="off"
          @focus="dropDownOpen = true"
          @keydown="clearInput"
          @input="filterText = ($event.target as HTMLInputElement).value"
        />
      </div>
      <CoreComponentsDropDownList
        :show="dropDownOpen"
        :readonly="
          props.selectLimit
            ? props.modelValue.length === props.selectLimit
            : false
        "
        :list-items="filteredList"
        @selected="optionSelected"
      />
    </div>
  </CoreComponentsCommonInputWrapper>
</template>

<style lang="scss" scoped>
input {
  width: inherit;
}
</style>
