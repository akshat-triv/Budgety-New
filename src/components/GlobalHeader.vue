<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentBalance: number;
  savingsBalance: number;
  investmentsBalance: number;
}>();

const currentBalanceFormatted = computed(() =>
  props.currentBalance.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  })
);

const savingsBalanceFormatted = computed(() =>
  props.savingsBalance.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  })
);

const investmentsBalanceFormatted = computed(() =>
  props.investmentsBalance.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  })
);
</script>

<template>
  <div class="global-header">
    <h1>Wealth Tracker</h1>
    <div class="money-tag-wrapper">
      <div class="money-tag current">
        Current balance: {{ currentBalanceFormatted }}
      </div>
      <div class="money-tag savings">
        Savings balance: {{ savingsBalanceFormatted }}
      </div>
      <div class="money-tag investments">
        Mutual Funds balance: {{ investmentsBalanceFormatted }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.global-header {
  width: 100%;
  height: 6rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--vt-c-divider-light);
  margin-bottom: 3.2rem;
}

.money-tag {
  font-size: 14px;
  border-radius: 2rem;
  padding: 0.4rem 1rem;

  &.current {
    background-color: var(--vt-c-blue-lighter);
  }

  &.savings {
    background-color: var(--vt-c-green-lighter);
  }

  &.investments {
    background-color: var(--vt-c-yellow);
  }

  &-wrapper {
    display: flex;
    gap: 2rem;
    margin-left: auto;
  }
}
</style>
