<script setup lang="ts">
import SelectInput from './SelectInput.vue';
import TxtNumInput from './TxtNumInput.vue';
import DateInput from './DateInput.vue';
import CommonButton from './CommonButton.vue';

import { onMounted, reactive, ref, watch } from 'vue';
import { saveNewTransactionInDB } from '@/transactionsController';
import { useTransactionStore } from '@/stores/transactions';
import type { Transaction } from '@/types/transaction.types';

import { customAlphabet } from 'nanoid';
import { useFocusWithin } from '@vueuse/core';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 13);

const transactionStore = useTransactionStore();

const newTransaction = reactive({
  type: 'Debited',
  description: '',
  amount: '',
  tag: '',
  date: '',
  transaction_id: '',
});

function clearTransaction() {
  newTransaction.type = 'Debited';
  newTransaction.description = '';
  newTransaction.amount = '';
  newTransaction.tag = '';
  newTransaction.date = '';
}

const addButtonLoader = ref(false);

async function addNewTransaction() {
  const newTransactionData = {
    type: newTransaction.type,
    description: newTransaction.description,
    amount: Number(newTransaction.amount),
    tag: newTransaction.tag,
    transaction_id: nanoid(),
    date: newTransaction.date,
  } as Transaction;

  addButtonLoader.value = true;
  const response = await saveNewTransactionInDB(newTransactionData);
  addButtonLoader.value = false;

  if (!response || !response.data) return;

  transactionStore.addTransactions([response.data]);

  clearTransaction();
}

const amountInputEl = ref<HTMLElement>();

const { focused } = useFocusWithin(amountInputEl);

onMounted(() => {
  window.addEventListener('keyup', (ev) => {
    if (ev.key === 'Enter' && focused.value) {
      newTransaction.amount = `${eval(newTransaction.amount)}`;
    }
  });
});
</script>

<template>
  <div class="add-new-transaction">
    <select-input
      :id="'transaction-type'"
      v-model="newTransaction.type"
      :options-list="['Debited', 'Credited']"
      :label="'Transaction Type'"
      :placeholder="'Select'"
    />
    <txt-num-input
      :id="'transaction-name'"
      v-model="newTransaction.description"
      :label="'Name'"
      :placeholder="'Enter Description'"
      :input-type="'text'"
    />
    <txt-num-input
      ref="amountInputEl"
      :id="'transaction-amount'"
      v-model="newTransaction.amount"
      :label="'Amount'"
      :placeholder="'Enter Amount'"
      :input-type="'text'"
    />
    <select-input
      :id="'transaction-tag'"
      v-model="newTransaction.tag"
      :options-list="[
        'Food',
        'Rent',
        'Party',
        'Shop',
        'Money',
        'Travel',
        'Medical',
        'Miscellaneous',
      ]"
      :label="'Tag'"
      :placeholder="'Select'"
    />
    <DateInput
      :id="'transaction-date'"
      v-model="newTransaction.date"
      :label="'Date'"
    />
    <CommonButton
      :button-text="'Add'"
      :loading="addButtonLoader"
      @click="addNewTransaction"
    />
  </div>
</template>

<style lang="scss" scoped>
.add-new-transaction {
  display: flex;
  align-items: flex-end;

  & > *:not(:last-child) {
    margin-right: 1.2rem;
  }

  & > * {
    &:nth-child(1) {
      flex: 0 0 12%;
    }

    &:nth-child(2) {
      flex: 0 0 30%;
    }

    &:nth-child(3) {
      flex: 0 0 15%;
    }

    &:nth-child(4) {
      flex: 0 0 12%;
    }

    &:last-child {
      flex: 1;
      margin-left: 1.2rem;
    }
  }
}
</style>
