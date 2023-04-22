<script lang="ts" setup>
type commonInputWrapper = {
  label?: string;
  lengthLimit?: number;
  length?: number;
  id: string;
};

const props = defineProps<commonInputWrapper>();
</script>

<template>
  <div class="common-input-wrapper">
    <label :for="props.id" class="common-input-label">
      {{ props.label }}
    </label>
    <slot class="flex-1"></slot>
    <span
      v-if="lengthLimit"
      class="common-input-label common-input-legnth-limit"
    >
      {{ `${length}/${lengthLimit}` }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.common-input {
  &-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  &-label {
    color: var(--vt-c-text-2);
    font-size: 1.2rem;
    margin-bottom: 0.4rem;
  }

  &-length-limit {
    position: absolute;
    bottom: 0;
    right: 0;
    transform: translateY(100%);
    transition: all 0.3s;
    font-size: 1.4rem;
  }
}

.flex-1 {
  flex: 0 0 1;
}
</style>
