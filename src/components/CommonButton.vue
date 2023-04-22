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
    class="common-button"
    :class="{ 'opacity-50 cursor-default': props.disable }"
  >
    {{ props.buttonText }}
  </button>
</template>

<style lang="scss" scoped>
.common-button {
  outline: none;
  border: none;
  background: var(--vt-c-brand);
  color: var(--vt-c-white);
  font-size: 1.4rem;
  padding: 1.2rem 1rem;
  border-radius: 0.4rem;
  transition: all 0.3s;

  &:hover {
    cursor: pointer;
    background: var(--vt-c-brand-light);
  }
}
</style>
