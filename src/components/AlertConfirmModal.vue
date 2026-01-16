<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

import CommonButton from './CommonButton.vue';
// import CheckIcon from '@/components/icons/CheckIcon.vue';
// import CrossIcon from '@/components/icons/CrossIcon.vue';

// To show the confirm modal
const showConfirm = ref(false);
// For controlling the z-index of the confirm modal
const modalActive = ref(false);
// Resolve promise function
const resolvePromise = ref<(value: number | PromiseLike<number>) => void>();
// Reject promise function
const rejectPromise = ref<(value: number | PromiseLike<number>) => void>();

const alertConfirmMessage = ref<string | null>(null);
const modalType = ref<'confirm' | 'alert'>('confirm');

const trueBtnText = computed(() =>
  modalType.value === 'confirm' ? 'Yes' : 'Okay'
);
const falseBtnText = ref('No');

function openModal(message: string, alertModal: boolean = false) {
  alertConfirmMessage.value = message;
  alertModal ? (modalType.value = 'alert') : (modalType.value = 'confirm');

  showConfirm.value = true;
  modalActive.value = true;

  return new Promise<number>((resolve, reject) => {
    resolvePromise.value = resolve;
    rejectPromise.value = reject;
  });
}

function handleUserInput(value: number) {
  if (!resolvePromise.value) return;

  resolvePromise.value(value);
  showConfirm.value = false;

  setTimeout(() => {
    modalActive.value = false;
  }, 300);
}

defineExpose({ openModal });

async function onPressEscape(e: KeyboardEvent) {
  if (e.code === 'Escape') {
    e.preventDefault();
    handleUserInput(0);
    return;
  }
}

onMounted(async () => {
  window.addEventListener('keydown', onPressEscape);
});

onUnmounted(async () => {
  window.removeEventListener('keydown', onPressEscape);
});
</script>

<template>
  <div class="alert-box-wrapper" :class="{ active: modalActive }">
    <transition name="fade" appear>
      <div v-if="showConfirm" class="alert-box-background"></div>
    </transition>
    <transition name="fade-scale" appear>
      <div v-if="showConfirm" class="alert-box">
        <div class="alert-box-header">{{ alertConfirmMessage }}</div>
        <div class="alert-box-buttons">
          <common-button
            :buttonText="trueBtnText"
            :primary="true"
            @click="handleUserInput(1)"
          />
          <common-button
            v-if="modalType === 'confirm'"
            :buttonText="falseBtnText"
            @click="handleUserInput(0)"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
// Scale fade being used in modal

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  transform: scale(1.1);
  opacity: 0;
}

// A normal fade, being used in modal backdrop

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style lang="scss" scoped>
.alert-box {
  width: 60rem;
  z-index: 10;
  background-color: var(--vt-c-bg);
  border-radius: 4px;
  box-shadow: var(--vt-shadow-4);
  padding: 1rem 0;

  &-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -10;
    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
      z-index: 10;
    }
  }

  &-background {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }

  &-header {
    font-size: 1.6rem;
    padding: 0.8rem 1.6rem;
    border-bottom: 1px solid var(--vt-c-divider);
    margin-bottom: 1.2rem;
  }

  &-buttons {
    display: flex;
    align-items: center;
    padding: 0 1.6rem;
    width: 100%;

    & > * {
      width: 8rem;
      &:first-child {
        margin-left: auto;
      }
      &:not(:last-child) {
        margin-right: 1.2rem;
      }
    }
  }
}
</style>
