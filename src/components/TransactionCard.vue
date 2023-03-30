<script setup lang="ts">
import { computed } from 'vue';

import FoodIcon from './icons/FoodIcon.vue';

type Transaction = {
  name: string;
  type: 'credit' | 'debit';
  date: string;
  amount: number;
  tag: string;
};

const props = defineProps<Transaction>();

const formattedAmount = computed(() =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
    props.amount
  )
);
</script>

<template>
  <div class="transaction-card">
    <div class="transaction-card-items-wrapper">
      <div class="transaction-card-icon-wrapper">
        <FoodIcon title="Food" class="transaction-card-icon" />
      </div>
      <div class="transaction-card-text-wrapper">
        <h3>{{ props.name }}</h3>
        <span>{{ props.tag }}</span>
      </div>
    </div>
    <div class="transaction-card-text-wrapper">
      <span> {{ props.date }} </span>
    </div>
    <div class="transaction-card-text-wrapper">
      <h4>{{ formattedAmount }}</h4>
    </div>
    <div
      class="transaction-card-type"
      :class="{
        debited: props.type === 'debit',
        credited: props.type === 'credit',
      }"
    >
      <span> {{ props.type === 'debit' ? 'Debited' : 'Credited' }} </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.transaction-card {
  width: 100%;
  padding: 2rem 2.4rem;
  border-radius: 0.8rem;
  background-color: var(--vt-c-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

  &-type {
    color: var(--vt-c-bg);
    padding: 1.2rem 1.6rem;
    border-radius: 5rem;

    &.credited {
      background: var(--vt-c-green);
    }

    &.debited {
      background: var(--vt-c-red);
    }
  }

  &-icon {
    width: 100%;
    height: 100%;

    &-wrapper {
      background: var(--vt-c-bg-soft);
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--vt-c-text-1);

      width: 4.8rem;
      height: 4.8rem;
      padding: 1.2rem;

      margin-right: 2rem;
    }
  }

  &-items-wrapper {
    display: flex;
    align-items: center;
  }

  &-text-wrapper {
    h3,
    h4 {
      color: var(--vt-c-text-1);
    }

    h3 {
      font-size: 1.8rem;
    }

    h4 {
      font-size: 1.6rem;
    }

    span {
      color: var(--vt-c-text-2);
      font-size: 1.4rem;
    }
  }
}
</style>
