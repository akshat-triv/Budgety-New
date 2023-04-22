<script setup lang="ts">
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

import { computed } from 'vue';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

type PieChartProps = {
  dataLabel: string;
  data: Array<number>;
  labels: Array<string>;
};

const props = defineProps<PieChartProps>();

const data = computed(() => {
  return {
    labels: props.labels,
    datasets: [
      {
        label: props.dataLabel,
        data: props.data,
        backgroundColor: [
          '#42b883',
          '#3b8eed',
          '#ffc517',
          '#ed3c50',
          '#de41e0',
          '#34495e',
          '#6D214F',
        ],
        hoverOffset: 4,
      },
    ],
  };
});
</script>

<template>
  <div class="chart-wrapper">
    <Pie :data="data" />
    <span v-if="!props.data.length" class="no-data-message">
      No data available
    </span>
  </div>
</template>

<style lang="scss" scoped>
.chart-wrapper {
  position: relative;

  .no-data-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--vt-c-text-2);
    font-style: italic;
  }
}
</style>
