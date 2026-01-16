<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue';
import TxtNumInput from './TxtNumInput.vue';
import CommonButton from './CommonButton.vue';
import { updateAllUserDetailsInDB } from '@/userController';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const user = computed(() => userStore.user);

const props = defineProps<{
  modalActive: boolean;
}>();

const { modalActive } = toRefs(props);

watch(
  modalActive,
  (newValue) => {
    if (newValue) showModal.value = newValue;
  },
  { immediate: true }
);

const emit = defineEmits<{
  (e: 'close-modal'): void;
}>();

const showModal = ref(false);
const saveButtonLoading = ref(false);

const updatedDetails = reactive({
  name: user.value.name,
  savings: user.value.savings,
  investments: user.value.investments,
  current: user.value.current,
});

function closeModal() {
  showModal.value = false;
  setTimeout(() => {
    emit('close-modal');
  }, 300);
}

async function onPressEscape(e: KeyboardEvent) {
  if (e.code === 'Escape') {
    e.preventDefault();
    closeModal();
    return;
  }
}

async function saveChanges() {
  saveButtonLoading.value = true;

  await updateAllUserDetailsInDB(user.value.email, {
    user_name: updatedDetails.name,
    current: updatedDetails.current || 0,
    savings: updatedDetails.savings || 0,
    investments: updatedDetails.investments || 0,
  });

  userStore.setUser({
    name: updatedDetails.name,
    email: user.value.email,
    current: updatedDetails.current || 0,
    savings: updatedDetails.savings || 0,
    investments: updatedDetails.investments || 0,
  });

  saveButtonLoading.value = false;

  closeModal();
}

onMounted(async () => {
  window.addEventListener('keydown', onPressEscape);
});

onUnmounted(async () => {
  window.removeEventListener('keydown', onPressEscape);
});
</script>

<template>
  <div
    class="update-user-details-wrapper"
    :class="{ active: props.modalActive }"
  >
    <transition name="fade" appear>
      <div v-if="showModal" class="update-user-details-background"></div>
    </transition>
    <transition name="fade-scale">
      <div v-if="showModal" class="update-user-details-box">
        <h2>Update Profile Details</h2>
        <div class="input-fields-wrapper">
          <TxtNumInput
            v-model="updatedDetails.name"
            input-type="text"
            :label="'Name'"
            :id="'update-name'"
            :placeholder="'Enter Name'"
          />
        </div>
        <div class="input-fields-wrapper">
          <TxtNumInput
            v-model="updatedDetails.current"
            input-type="number"
            :label="'Current Balance'"
            :id="'current-balance'"
            :placeholder="'Enter Current Balance'"
          />
        </div>
        <div class="input-fields-wrapper">
          <TxtNumInput
            v-model="updatedDetails.savings"
            input-type="number"
            :label="'Savings Balance'"
            :id="'savings-balance'"
            :placeholder="'Enter Savings Balance'"
          />
        </div>
        <div class="input-fields-wrapper">
          <TxtNumInput
            v-model="updatedDetails.investments"
            input-type="number"
            :label="'Investments Balance'"
            :id="'investments-balance'"
            :placeholder="'Enter Investments Balance'"
          />
        </div>
        <div class="update-buttons-wrapper">
          <common-button :buttonText="'Cancel'" @click="closeModal" />
          <common-button
            :buttonText="'Save Changes'"
            :loading="saveButtonLoading"
            @click="saveChanges"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
h2 {
  margin-bottom: 1.2rem;
  font-weight: 600;
  color: var(--vt-c-text-1);
}

.update-user-details {
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

  &-box {
    width: 48rem;
    z-index: 10;
    background-color: var(--vt-c-bg);
    border-radius: 8px;
    box-shadow: var(--vt-shadow-4);
    padding: 1.2rem 2rem;

    .update-buttons-wrapper {
      display: flex;
      justify-content: flex-end;
      gap: 1.2rem;
      margin-top: 2rem;

      & > * {
        min-width: 8rem;
      }
    }
  }
}

.input-fields-wrapper {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;

  & > * {
    flex: 1;
  }
}
</style>
