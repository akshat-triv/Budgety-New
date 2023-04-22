<script lang="ts" setup>
import SelectInput from './SelectInput.vue';
import DateInput from './DateInput.vue';

import { computed } from 'vue';

type CommonChartWrapperProps = {
  title: string;
  datePresetValue: string;
  datePresetOptions: Array<string>;
  toDate: string;
  fromDate: string;
  readonly?: boolean;
};

const props = defineProps<CommonChartWrapperProps>();

const emit = defineEmits([
  'update:datePresetValue',
  'update:toDate',
  'update:fromDate',
]);

const datePresetValue = computed({
  get() {
    return props.datePresetValue;
  },
  set(value) {
    emit('update:datePresetValue', value);
  },
});

const fromDate = computed({
  get() {
    return props.fromDate;
  },
  set(value) {
    emit('update:fromDate', value);
  },
});

const toDate = computed({
  get() {
    return props.toDate;
  },
  set(value) {
    emit('update:toDate', value);
  },
});
</script>

<template>
  <div class="common-chart-wrapper">
    <div class="common-chart-header">{{ props.title }}</div>
    <slot></slot>
    <div class="common-chart-controller">
      <select-input
        :id="'common-chart-preset'"
        v-model="datePresetValue"
        :options-list="props.datePresetOptions"
        :label="'Time Period'"
        :palceholder="'Select'"
      />
      <div class="date-input-wrapper">
        <DateInput
          :id="'common-chart-from-date'"
          v-model="fromDate"
          :label="'From Date'"
          :readonly="props.readonly"
        />
        <DateInput
          :id="'common-chart-to-date'"
          v-model="toDate"
          :label="'To Date'"
          :readonly="props.readonly"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.common-chart {
  &-wrapper {
    border: 1px solid var(--vt-c-divider-light-1);
    border-radius: 0.4rem;
    padding-bottom: 1.2rem;
  }

  &-header {
    padding: 0.8rem 1.2rem;
    background: var(--vt-c-bg-soft);
    margin-bottom: 1.2rem;
  }

  &-controller {
    padding: 0.8rem;

    .date-input-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  & > *:not(:last-child) {
    margin-right: 0.8rem;
  }
}
</style>
