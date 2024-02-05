import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

import type { Transaction } from '@/types/transaction.types';

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref<Array<Transaction>>([]);

  const pageNo = ref(1);
  const transactionsPerPage = ref(10);

  const visibleTransactions = computed(() => {
    return transactions.value.slice(
      0,
      pageNo.value * transactionsPerPage.value
    );
  });

  function showMoreTransactions() {
    pageNo.value = pageNo.value + 1;
  }

  function getTransactions(fromDate: string, toDate: string) {
    const fromDateParsed = new Date(fromDate);
    const toDateParsed = new Date(toDate);

    const transactionsInRange = transactions.value.filter((curr) => {
      const currentTransactionDate = new Date(curr.date);
      return (
        currentTransactionDate >= fromDateParsed &&
        currentTransactionDate <= toDateParsed
      );
    });

    return transactionsInRange;
  }

  function addTransactions(
    newTransactions: Array<Transaction>,
    replace = false
  ) {
    if (replace) {
      transactions.value = newTransactions;
      return;
    }
    transactions.value.unshift(...newTransactions);
    localStorage.setItem('transactions', JSON.stringify(transactions.value));
  }

  function deleteTransaction(transactionId: string) {
    const index = transactions.value.findIndex(
      (curr) => curr.transaction_id === transactionId
    );
    transactions.value.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions.value));
  }

  return {
    transactions,
    addTransactions,
    deleteTransaction,
    getTransactions,
    visibleTransactions,
    showMoreTransactions,
  };
});
