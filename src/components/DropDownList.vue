<script lang="ts" setup>
import { toRefs, ref, watch } from 'vue';

type dropDownList = {
  listItems: Array<string>;
  show: boolean;
  readonly?: boolean;
};

const props = withDefaults(defineProps<dropDownList>(), {
  listItems: () => [],
  show: false,
  readonly: false,
});

const { show } = toRefs(props);

const emit = defineEmits(['selected']);

const displayBottom = ref(true);
const listItemWrapper = ref<null | HTMLElement>(null);

watch(show, () => {
  if (!listItemWrapper.value) return;

  const windowHeight = window.innerHeight;
  const { top: listTop } = listItemWrapper.value.getBoundingClientRect();
  // 32px is the height of each item
  const listHeight = props.listItems.length * 32;

  if (listTop + listHeight > windowHeight) displayBottom.value = false;
  else displayBottom.value = true;
});

function onSelect(item: string) {
  if (props.readonly) return;
  emit('selected', item);
}
</script>

<template>
  <div ref="listItemWrapper">
    <div
      v-if="props.show"
      class="drop-down-list-wrapper"
      :class="{
        bottom: displayBottom,
        top: !displayBottom,
      }"
    >
      <ul class="drop-down-list">
        <li
          v-for="(item, itemIdx) of props.listItems"
          :key="`item-${itemIdx}`"
          class="drop-down-list-item"
          :class="{ readonly: props.readonly }"
          @click="onSelect(item)"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.drop-down-list {
  list-style-type: none;
  width: 100%;

  &-item {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0.8rem 1rem;

    &:hover {
      cursor: pointer;
      background: var(--vt-c-bg-mute);
    }

    &.readonly {
      opacity: 0.5;
      background: var(--vt-c-bg-soft);
      cursor: default;
    }
  }

  &-wrapper {
    color: var(--vt-c-text-1);
    background: var(--vt-c-bg-soft);
    font-size: 1.6rem;
    width: 100%;
    position: absolute;
    left: 0;
    border-radius: 0.4rem;
    z-index: 10;
    border: 1px solid var(--vt-c-divider-light);
    overflow: auto;
    max-height: 16rem;

    &.bottom {
      bottom: -0.4rem;
      transform: translateY(100%);
    }

    &.top {
      top: -0.4rem;
      transform: translateY(-100%);
    }
  }
}
</style>
