<script lang="ts" setup>
import TransactionCard from '@/components/TransactionCard.vue';
import PieChart from '@/components/PieChart.vue';
import BarGraph from '@/components/BarGraph.vue';
import AddNewTransaction from '@/components/AddNewTransaction.vue';

import { reactive, computed, onMounted, ref, watch } from 'vue';

import type { Transaction } from '@/types/transaction.types';
import { useTransactionStore } from '@/stores/transactions';
import CommonChartWrapper from '@/components/CommonChartWrapper.vue';

import {
  getAllTransactions,
  deleteTransactionFromDB,
} from '@/transactionsController';

import { useInfiniteScroll } from '@vueuse/core';

const transactionStore = useTransactionStore();

const transactions = computed(() => transactionStore.visibleTransactions);

async function deleteTransaction(transactionId: string) {
  await deleteTransactionFromDB(transactionId);
  transactionStore.deleteTransaction(transactionId);
}

// ---------------- Expense ratio chart data ------------

const expenseRatioPreset = ref<'Last 7 days' | 'This month' | 'Custom date'>(
  'Last 7 days'
);

const expenseRatioDates = reactive({ toDate: '', fromDate: '' });

watch(
  expenseRatioPreset,
  (newValue) => {
    if (newValue !== 'Custom date')
      expenseRatioDates.toDate = new Date().toISOString().split('T')[0];

    if (newValue === 'Last 7 days')
      expenseRatioDates.fromDate = new Date(
        new Date().setDate(new Date().getDate() - 7)
      )
        .toISOString()
        .split('T')[0];

    if (newValue === 'This month')
      expenseRatioDates.fromDate = new Date(
        new Date().setDate(new Date().getDate() - (new Date().getDate() - 1))
      )
        .toISOString()
        .split('T')[0];
  },
  { immediate: true }
);

const pieChartData = computed(() => {
  const transactions = transactionStore.getTransactions(
    expenseRatioDates.fromDate,
    expenseRatioDates.toDate
  );

  const labelsAndData = new Map<string, number>();
  const data = [] as Array<number>;
  const labels = [] as Array<string>;

  for (const transaction of transactions) {
    if (labelsAndData.has(transaction.tag) && transaction.type === 'Debited') {
      let groupAmount = Number(labelsAndData.get(transaction.tag));
      labelsAndData.set(transaction.tag, groupAmount + transaction.amount);
    } else if (transaction.type === 'Debited')
      labelsAndData.set(transaction.tag, transaction.amount);
  }

  for (const [label, amount] of labelsAndData.entries()) {
    labels.push(label);
    data.push(amount);
  }

  return { labels, data };
});

// ----------------- Expenses bar graph ----------------

const expensesPreset = ref<'In Months' | 'In Years'>('In Months');

const expensesDates = reactive({ toDate: '', fromDate: '' });

expensesDates.toDate = new Date().toISOString().split('T')[0];
expensesDates.fromDate = `${new Date().getFullYear()}-01-01`;

const barGraphData = computed(() => {
  const transactions = transactionStore.getTransactions(
    expensesDates.fromDate,
    expensesDates.toDate
  );

  if (!transactions.length) return { labels: [], data: [] };

  const debitData = new Map<string, number>();
  const creditData = new Map<string, number>();

  for (const transaction of transactions) {
    const month = new Date(transaction.date).toDateString().split(' ')[1];
    if (transaction.type === 'Debited') {
      if (debitData.has(month)) {
        const groupAmount = Number(debitData.get(month));
        debitData.set(month, groupAmount + transaction.amount);
      } else debitData.set(month, transaction.amount);
    } else if (transaction.type === 'Credited') {
      if (creditData.has(month)) {
        const groupAmount = Number(creditData.get(month));
        creditData.set(month, groupAmount + transaction.amount);
      } else creditData.set(month, transaction.amount);
    }
  }

  return {
    labels: Array.from(debitData.keys()),
    data: [Array.from(debitData.values()), Array.from(creditData.values())],
  };
});

// Load from local storage

async function loadFromSupabese() {
  const transactions = await getAllTransactions();
  transactionStore.addTransactions(
    transactions as unknown as Array<Transaction>,
    true
  );
}

const transactionsWrapper = ref<HTMLElement | null>(null);

useInfiniteScroll(
  transactionsWrapper,
  () => {
    transactionStore.showMoreTransactions();
  },
  { distance: 10 }
);

onMounted(() => {
  loadFromSupabese();
});
</script>

<template>
  <div class="dashboard-view">
    <div class="transactions-view">
      <add-new-transaction />
      <div class="transaction-divider">
        <span class="text">Transactions</span>
      </div>
      <div ref="transactionsWrapper" class="transactions-wrapper">
        <TransactionCard
          v-for="(transactionDetail, transactionIdx) of transactions"
          :key="`transaction-${transactionIdx}`"
          :type="transactionDetail.type"
          :description="transactionDetail.description"
          :date="transactionDetail.date"
          :amount="transactionDetail.amount"
          :tag="transactionDetail.tag"
          @delete="deleteTransaction(transactionDetail.transaction_id)"
        />
      </div>
    </div>
    <div class="analytics-view">
      <common-chart-wrapper
        :title="'Expense Ratio'"
        :date-preset-value="expenseRatioPreset"
        :to-date="expenseRatioDates.toDate"
        :from-date="expenseRatioDates.fromDate"
        :date-preset-options="['Last 7 days', 'This month', 'Custom date']"
        :readonly="expenseRatioPreset !== 'Custom date'"
        @update:date-preset-value="expenseRatioPreset = $event"
        @update:from-date="expenseRatioDates.fromDate = $event"
        @update:to-date="expenseRatioDates.toDate = $event"
      >
        <pie-chart
          :data-label="'Expense Distribution'"
          :data="pieChartData.data"
          :labels="pieChartData.labels"
        />
      </common-chart-wrapper>
      <common-chart-wrapper
        :title="'Expenses'"
        :date-preset-value="expensesPreset"
        :to-date="expensesDates.toDate"
        :from-date="expensesDates.fromDate"
        :date-preset-options="['In Months', 'In Years']"
        :readonly="false"
        @update:date-preset-value="expensesPreset = $event"
        @update:from-date="expensesDates.fromDate = $event"
        @update:to-date="expensesDates.toDate = $event"
      >
        <bar-graph
          :data-label="['Expenses', 'Income']"
          :data="barGraphData.data"
          :labels="barGraphData.labels"
        />
      </common-chart-wrapper>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-view {
  width: 100%;
  height: 100%;
  display: flex;
  padding-top: 4rem;
  justify-content: space-between;
  overflow: hidden;
}

.transactions-wrapper {
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
  overflow-y: auto;
  flex: 1;

  & > * {
    &:not(:last-of-type) {
      margin-bottom: 2rem;
    }
  }
}

.analytics-view {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  overflow-y: auto;
  flex: 1;

  & > * {
    &:not(:last-of-type) {
      margin-bottom: 2rem;
    }
  }
}
.transaction-divider {
  height: 2px;
  background-color: var(--vt-c-bg-soft);
  width: 100%;
  position: relative;
  margin: 3.2rem 0 2.2rem;

  .text {
    display: block;
    position: absolute;
    font-size: 1.4rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--vt-c-bg);
    color: var(--vt-c-text-2);
    padding: 0.4rem 0;
  }
}

.transactions-view {
  display: flex;
  flex-direction: column;
  width: calc(75% - 1rem);
  margin-right: 1rem;
}
</style>
