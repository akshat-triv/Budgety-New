<script setup lang="ts">
import SelectInput from './SelectInput.vue';
import TxtNumInput from './TxtNumInput.vue';
import DateInput from './DateInput.vue';
import CommonButton from './CommonButton.vue';

import { computed, onMounted, reactive, ref, watch } from 'vue';
import { saveNewTransactionInDB } from '@/transactionsController';
import { useTransactionStore } from '@/stores/transactions';
import type { Transaction } from '@/types/transaction.types';

import { customAlphabet } from 'nanoid';
import { useFocusWithin } from '@vueuse/core';
import { useUserStore } from '@/stores/user';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 13);

const transactionStore = useTransactionStore();
const userStore = useUserStore();
const user = computed(() => userStore.user);

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
    user_id: user.value!.email,
  } as Transaction;

  addButtonLoader.value = true;
  const response = await saveNewTransactionInDB(newTransactionData);
  await updateBalance();
  addButtonLoader.value = false;

  if (!response || !response.data) return;

  transactionStore.addTransactions([response.data]);

  clearTransaction();
}

async function updateBalance() {
  if (newTransaction.type === 'Debited') {
    await userStore.updateUserInfo(
      'current',
      user.value.current - Number(newTransaction.amount)
    );

    if (newTransaction.tag === 'Savings') {
      await userStore.updateUserInfo(
        'savings',
        user.value.savings + Number(newTransaction.amount)
      );
    } else if (newTransaction.tag === 'Investments') {
      await userStore.updateUserInfo(
        'investments',
        user.value.investments + Number(newTransaction.amount)
      );
    }
  } else {
    await userStore.updateUserInfo(
      'current',
      user.value.current + Number(newTransaction.amount)
    );
  }
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
        'Housing',
        'Food',
        'Utilities',
        'Transportation',
        'Insurance',
        'Debt Payments',
        'Personal Care',
        'Entertainment',
        'Drinks & Ciggs',
        'Clothing',
        'Technology',
        'Health Care',
        'Child and Dependent Care',
        'Gifts and Donations',
        'Savings',
        'Investments',
        'Travel',
        'Professional Services',
        'Pet Care',
        'Money',
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
      flex: 0 0 25%;
    }

    &:nth-child(3) {
      flex: 0 0 15%;
    }

    &:nth-child(4) {
      flex: 0 0 15%;
    }

    &:last-child {
      flex: 1;
      margin-left: 1.2rem;
    }
  }
}
</style>
