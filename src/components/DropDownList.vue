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
      class="dark:bg-gray-700 bg-gray-200 dark:text-white text-slate-700 shadow-md w-100 absolute left-0 rounded z-10 border border-solid dark:border-gray-600 border-gray-100 overflow-auto max-h-40 scroll-bar"
      :class="{
        '-bottom-1 translate-y-full': displayBottom,
        '-top-1 -translate-y-full': !displayBottom,
      }"
    >
      <ul class="list w-100 list-none">
        <li
          v-for="(item, itemIdx) of props.listItems"
          :key="`item-${itemIdx}`"
          class="w-100 h-8 flex items-center px-2"
          :class="{
            'hover:bg-slate-100/10 hover:cursor-pointer': !props.readonly,
            'opacity-50': props.readonly,
          }"
          @click="onSelect(item)"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>
