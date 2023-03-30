<script lang="ts" setup>
import TransactionCard from '@/components/TransactionCard.vue';
import SelectInput from '@/components/SelectInput.vue';

import { reactive } from 'vue';

const newTransaction = reactive({ transactionType: '' });
</script>

<template>
  <div class="dashboard-view">
    <div class="transactions-wrapper">
      <div class="add-new-transaction">
        <select-input
          :id="'transaction-type'"
          :model-value="newTransaction.transactionType"
          :options-list="['Debit', 'Credit']"
          :label="'Transaction Type'"
        />
      </div>
      <TransactionCard
        :type="'debit'"
        :name="'Dinner at Shalimar'"
        :date="'23rd March 2023'"
        :amount="1050"
        :tag="'Food'"
      />
      <TransactionCard
        :type="'credit'"
        :name="'Salary credited'"
        :date="'28th Feb 2023'"
        :amount="65423"
        :tag="'Salary'"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-view {
  width: 100%;
  display: flex;
  padding: 4rem;
}

.transactions-wrapper {
  display: flex;
  flex-direction: column;
  width: 55%;

  & > * {
    &:not(:last-of-type) {
      margin-bottom: 2rem;
    }
  }
}
</style>
