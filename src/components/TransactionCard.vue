<script setup lang="ts">
import { computed } from 'vue';

import FoodIcon from './icons/FoodIcon.vue';
import ShopCartIcon from './icons/ShopCartIcon.vue';
import HouseIcon from './icons/HouseIcon.vue';
import WineIcon from './icons/WineIcon.vue';
import WalletIcon from './icons/WalletIcon.vue';
import TaxiIcon from './icons/TaxiIcon.vue';
import UnknownIcon from './icons/UnknownIcon.vue';
import MedicalIcon from './icons/MedicalIcon.vue';

import DeleteIcon from './icons/DeleteIcon.vue';

export type Transaction = {
  type: 'Credited' | 'Debited';
  description: string;
  amount: number | null;
  tag: string;
  date: string;
};

const props = defineProps<Transaction>();
const emit = defineEmits(['delete']);

const TransactionIcon = computed(() => {
  if (props.tag === 'Food') return FoodIcon;
  if (props.tag === 'Shop') return ShopCartIcon;
  if (props.tag === 'Rent') return HouseIcon;
  if (props.tag === 'Party') return WineIcon;
  if (props.tag === 'Money') return WalletIcon;
  if (props.tag === 'Travel') return TaxiIcon;
  if (props.tag === 'Medical') return MedicalIcon;
  if (props.tag === 'Miscellaneous') return UnknownIcon;
  return null;
});

const formattedAmount = computed(() => {
  if (!props.amount) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(props.amount);
});

const formattedDate = computed(() => {
  return new Date(props.date).toDateString();
});
</script>

<template>
  <div class="transaction-card">
    <div class="transaction-card-items-wrapper">
      <div class="transaction-card-icon-wrapper">
        <template v-if="TransactionIcon">
          <component
            :is="TransactionIcon"
            :title="props.tag"
            class="transaction-card-icon"
          />
        </template>
      </div>
      <div class="transaction-card-text-wrapper">
        <h3>{{ props.description }}</h3>
        <span>{{ props.tag }}</span>
      </div>
    </div>
    <div class="transaction-card-text-wrapper">
      <span> {{ formattedDate }} </span>
    </div>
    <div class="transaction-card-text-wrapper">
      <h4>{{ formattedAmount }}</h4>
    </div>
    <div
      class="transaction-card-type"
      :class="{
        debited: props.type === 'Debited',
        credited: props.type === 'Credited',
      }"
    >
      <span> {{ props.type }} </span>
    </div>
    <div class="transaction-card-items-wrapper">
      <div
        class="transaction-card-icon-wrapper secondary"
        @click="emit('delete')"
      >
        <delete-icon class="transaction-card-icon" />
      </div>
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

      &:not(:last-child) {
        margin-right: 2rem;
      }

      &.secondary {
        background: none;
        padding: 1.2rem;

        .transaction-card-icon {
          color: var(--vt-c-text-3);
          &:hover {
            cursor: pointer;
          }
        }
      }
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
      width: 20rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
