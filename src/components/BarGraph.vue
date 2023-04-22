<script lang="ts" setup>
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { computed } from 'vue';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

type BarGraphProps = {
  dataLabel: Array<string>;
  data: Array<Array<number>>;
  labels: Array<string>;
};

const props = defineProps<BarGraphProps>();

const chartData = computed(() => {
  const datasets = [];

  console.log(props.data);

  if (props.data.length)
    datasets.push({
      label: props.dataLabel[0],
      data: props.data[0],
      backgroundColor: '#42b883',
      hoverOffset: 4,
    });

  if (props.data.length === 2)
    datasets.push({
      label: props.dataLabel[1],
      data: props.data[1],
      backgroundColor: '#3489db',
      hoverOffset: 4,
    });

  return {
    labels: props.labels,
    datasets,
  };
});
const chartOptions = {
  responsive: true,
};
</script>

<template>
  <div class="chart-wrapper">
    <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
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
