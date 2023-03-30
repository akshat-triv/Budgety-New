<script lang="ts" setup>
type commonInput = {
  label?: string;
  id: string;
  palceholder: string;
  inputType: "text" | "number";
  modelValue: string | number | null;
};

const props = withDefaults(defineProps<commonInput>(), {
  palceholder: "",
  inputType: "text",
});

const emit = defineEmits(["update:modelValue"]);

function numbersOnly(e: KeyboardEvent) {
  const key = e.key;
  if (props.inputType === "number" && key.length === 1) {
    const ascii = key.charCodeAt(0);
    if (ascii !== 46 && !(ascii < 58 && ascii > 47)) e.preventDefault();
  }
}
</script>

<template>
  <CoreComponentsCommonInputWrapper :label="props.label" :id="props.id">
    <input
      type="text"
      :id="props.id"
      class="border-none outline-none w-100 px-2 py-1 dark:bg-gray-700 bg-gray-200 dark:text-white text-slate-700 rounded relative flex-1 placeholder:text-sm"
      :placeholder="props.palceholder"
      :value="props.modelValue"
      @keydown="numbersOnly"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
  </CoreComponentsCommonInputWrapper>
</template>
