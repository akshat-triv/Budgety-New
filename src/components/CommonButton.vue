<script lang="ts" setup>
type buttonProps = {
  buttonText: string;
  disable?: boolean;
};

const props = defineProps<buttonProps>();
</script>

<template>
  <button
    type="submit"
    class="outline-none border-none bg-sky-400/20 hover:bg-sky-400/30 text-sky-500 text-sm px-2 py-1 rounded transition-all"
    :class="{ 'opacity-50 cursor-default': props.disable }"
  >
    {{ props.buttonText }}
  </button>
</template>
