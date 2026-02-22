<script setup lang="ts">
import { computed, ref } from 'vue';
import SettingsIcon from './icons/SettingsIcon.vue';
import LogoutIcon from './icons/logoutIcon.vue';
import { onClickOutside } from '@vueuse/core';
import VisibilityOffIcon from './icons/VisibilityOffIcon.vue';
import VisibilityOnIcon from './icons/VisibilityOnIcon.vue';

const props = defineProps<{
  currentBalance: number;
  savingsBalance: number;
  investmentsBalance: number;
  userName: string;
  userEmail: string;
}>();

const emit = defineEmits<{
  (e: 'logout'): void;
  (e: 'update-profile'): void;
}>();

const userProfileDetails = ref<HTMLElement | null>(null);

const showUserProfileOptions = ref(false);
const showBalanceDetails = ref(false);

const currentBalanceFormatted = computed(() => {
  if (!showBalanceDetails.value) {
    return 'XXXXXXX';
  }

  return props.currentBalance.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  });
});

const savingsBalanceFormatted = computed(() => {
  if (!showBalanceDetails.value) {
    return 'XXXXXXX';
  }

  return props.savingsBalance.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  });
});

const investmentsBalanceFormatted = computed(() => {
  if (!showBalanceDetails.value) {
    return 'XXXXXXX';
  }

  return props.investmentsBalance.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  });
});

const userInitials = computed(() => {
  const names = props.userName.split(' ');
  return names.map((n) => n.charAt(0).toUpperCase()).join('');
});

onClickOutside(userProfileDetails, () => {
  showUserProfileOptions.value = false;
});
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
      <VisibilityOffIcon
        v-if="showBalanceDetails"
        class="visibility-icon"
        :title="'Hide Balance'"
        @click="showBalanceDetails = false"
      />
      <VisibilityOnIcon
        v-else
        class="visibility-icon"
        :title="'Show Balance'"
        @click="showBalanceDetails = true"
      />
    </div>
    <div
      class="user-profile"
      @click="showUserProfileOptions = !showUserProfileOptions"
    >
      <div class="user-profile-icon">
        {{ userInitials }}
      </div>
      <div
        v-show="showUserProfileOptions"
        class="user-profile-details"
        ref="userProfileDetails"
      >
        <h2>{{ userName }}</h2>
        <span>{{ userEmail }}</span>
        <span class="divider"></span>
        <div class="update-details-wrapper" @click="emit('update-profile')">
          <SettingsIcon class="icon" title="Settings Icon" />
          Update Profile Details
        </div>
        <span class="divider"></span>
        <div class="logout-button-wrapper" @click="emit('logout')">
          <LogoutIcon class="icon" title="Logout Icon" />
          Logout
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.visibility-icon {
  width: 2.4rem;
  height: 2.4rem;
  margin-left: 1.6rem;
  color: var(--vt-c-text-1);
  stroke: currentColor;
  fill: currentColor;

  &:hover {
    cursor: pointer;
    color: var(--vt-c-text-2);
  }
}

.user-profile {
  position: relative;
}

.update-details-wrapper,
.logout-button-wrapper {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 1.2rem 0;
  color: var(--vt-c-text-1);

  &:hover {
    cursor: pointer;
  }

  .icon {
    width: 2.4rem;
    height: 2.4rem;
    margin-right: 0;
  }
}

.logout-button-wrapper {
  border: 1px solid var(--vt-c-divider-light);
  padding: 0.8rem 1.2rem;
  border-radius: 4px;
  width: 60%;
  margin: 1.2rem auto 0;

  &:hover {
    background-color: var(--vt-c-bg-soft);
  }
}

.user-profile-details {
  display: flex;
  flex-direction: column;
  width: 24rem;
  position: absolute;
  bottom: -2rem;
  right: 0.4rem;
  background-color: var(--vt-c-bg);
  transform: translateY(100%);
  padding: 1.2rem 1.6rem;
  border-radius: 8px;
  z-index: 10;
  box-shadow: var(--vt-shadow-2);

  &::before {
    content: '';
    position: absolute;
    top: -0.8rem;
    right: 1.6rem;
    border-left: 0.8rem solid transparent;
    border-right: 0.8rem solid transparent;
    border-bottom: 0.8rem solid var(--vt-c-bg);
  }

  h2 {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--vt-c-text-1);
  }

  span {
    font-size: 1.2rem;
    color: var(--vt-c-text-2);
  }

  .divider {
    width: 100%;
    height: 1px;
    background-color: var(--vt-c-divider-light);
    margin: 0.4rem 0;
  }
}

.user-profile-icon {
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  background-color: var(--vt-c-brand);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.4rem;
  margin-left: 2rem;

  &:hover {
    cursor: pointer;
  }
}

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
    align-items: center;
    gap: 2rem;
    margin-left: auto;
  }
}
</style>
