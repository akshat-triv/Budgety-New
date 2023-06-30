<script lang="ts" setup>
type buttonProps = {
  buttonText: string;
  disable?: boolean;
  loading?: boolean;
};

const props = withDefaults(defineProps<buttonProps>(), {
  loading: false,
  disable: false,
});
</script>

<template>
  <button
    type="submit"
    class="common-button"
    :class="{
      'opacity-50 cursor-default': props.disable,
      loading: props.loading,
    }"
  >
    <span v-if="props.loading" class="spinner"></span>
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

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    background: var(--vt-c-brand-light);
  }

  &.loading {
    justify-content: space-evenly;
  }
}

.spinner {
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  border: 2px solid transparent;
  border-right: 2px solid var(--vt-c-bg-soft);
  margin-right: 1.2rem;
  animation: spin 0.3s linear infinite;
  display: block;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
