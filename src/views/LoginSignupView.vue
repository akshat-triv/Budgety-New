<script setup lang="ts">
import TxtNumInput from '@/components/TxtNumInput.vue';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import CommonButton from '@/components/CommonButton.vue';
import MountainAnimation from '@/components/icons/MountainAnimation.vue';
import {
  saveUserDetailsToDB,
  signinNewUser,
  loginExistingUser,
  getUserDetailsFromDB,
} from '@/userController';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';

const userStore = useUserStore();
const appStore = useAppStore();

const router = useRouter();

const formData = reactive({
  email: '',
  password: '',
  name: '',
  savings: null,
  investments: null,
  current: null,
});

const loading = ref(false);

const formMode = ref<'login' | 'signup'>('login');

function resetFormData() {
  formData.email = '';
  formData.password = '';
  formData.name = '';
  formData.savings = null;
  formData.investments = null;
  formData.current = null;
}

async function loginUser() {
  const userData = await loginExistingUser(formData.email, formData.password);

  appStore.addNotification(userData.message, userData.type);

  const userDetails = await getUserDetailsFromDB(formData.email);

  if (!userDetails) {
    appStore.addNotification('Error fetching user details', 'error');
    return;
  } else {
    appStore.addNotification('User details fetched successfully.', 'success');
  }

  userStore.setUser({
    name: userDetails.user_name,
    email: userDetails.user_id,
    current: userDetails.current,
    savings: userDetails.savings,
    investments: userDetails.investments,
  });

  userStore.setUserSession(userData.data?.session || null);

  router.push({ name: 'dashboard' });
}

async function signupUser() {
  // Similar to loginUser but for signing up
  const newUserData = await signinNewUser(formData.email, formData.password);

  appStore.addNotification(newUserData.message, newUserData.type);

  await saveUserDetailsToDB(
    formData.name,
    formData.email,
    formData.savings,
    formData.investments,
    formData.current
  );

  appStore.addNotification(
    'Verification email sent. Please verify your email before logging in.',
    'success'
  );
  formMode.value = 'login';
  resetFormData();
}

async function handleFormSubmit() {
  loading.value = true;
  try {
    if (formMode.value === 'login') {
      await loginUser();
    } else {
      await signupUser();
    }
  } catch (error) {
    console.error('Error during form submission:', error);
  } finally {
    loading.value = false;
  }
}

async function onPressEnter(e: KeyboardEvent) {
  if (e.code === 'Enter') {
    e.preventDefault();
    handleFormSubmit();
    return;
  }
}

onMounted(async () => {
  window.addEventListener('keydown', onPressEnter);
});

onUnmounted(async () => {
  window.removeEventListener('keydown', onPressEnter);
});
</script>

<template>
  <div class="login-signup-screen">
    <div class="login-signup-artwork-wrapper">
      <MountainAnimation />
    </div>
    <div class="login-signup-form-wrapper">
      <h1 class="hero">Wealth Tracker</h1>
      <div class="login-signup-wrapper">
        <h1>
          {{
            formMode === 'login' ? 'Login to continue' : 'Sign up to continue'
          }}
        </h1>
        <div class="form-wrapper">
          <div v-if="formMode === 'signup'" class="input-fields-wrapper">
            <TxtNumInput
              v-model="formData.name"
              input-type="text"
              :label="'Name'"
              :id="'name'"
              :placeholder="'Enter Name'"
            />
          </div>
          <div class="input-fields-wrapper">
            <TxtNumInput
              v-model="formData.email"
              input-type="text"
              :label="'Email'"
              :id="'email'"
              :placeholder="'Enter Email'"
            />
          </div>
          <div class="input-fields-wrapper">
            <TxtNumInput
              v-model="formData.password"
              input-type="password"
              :label="'Password'"
              :id="'password'"
              :placeholder="'Enter Password'"
            />
          </div>
          <template v-if="formMode === 'signup'">
            <div class="input-fields-wrapper">
              <TxtNumInput
                v-model="formData.current"
                input-type="number"
                :label="'Current Balance'"
                :id="'current-balance'"
                :placeholder="'Enter Current Balance'"
              />
            </div>
            <div class="input-fields-wrapper">
              <TxtNumInput
                v-model="formData.savings"
                input-type="number"
                :label="'Savings Balance'"
                :id="'savings-balance'"
                :placeholder="'Enter Savings Balance'"
              />
            </div>
            <div class="input-fields-wrapper">
              <TxtNumInput
                v-model="formData.investments"
                input-type="number"
                :label="'Investments Balance'"
                :id="'investments-balance'"
                :placeholder="'Enter Investments Balance'"
              />
            </div>
          </template>
        </div>
        <common-button
          class="login-button"
          :button-text="formMode === 'login' ? 'Login' : 'Sign Up'"
          :loading="loading"
          :disable="!formData.email || !formData.password"
          @click="handleFormSubmit"
        />

        <span class="form-message">
          <template v-if="formMode === 'login'">
            Don't have an account?
            <span class="action" @click="formMode = 'signup'">Sign up</span>
          </template>
          <template v-else>
            Already have an account?
            <span class="action" @click="formMode = 'login'">Login</span>
          </template>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-signup {
  &-screen {
    width: 100%;
    height: 100%;
    display: flex;

    & > * {
      flex: 0 0 50%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--vt-c-bg);
    }
  }

  &-form-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .hero {
      font-size: 2.8rem;
      margin-bottom: 2.4rem;
      color: var(--vt-c-text-1);
      text-align: center;
      width: 100%;
    }
  }

  &-wrapper {
    width: 70%;
    box-shadow: var(--vt-shadow-2);
    margin: 0 auto;
    padding: 2rem;
    border-radius: 8px;
    border: 4px solid var(--vt-c-blue);

    h1 {
      margin-bottom: 1.4rem;
      letter-spacing: normal;
    }
  }
}

.input-fields-wrapper {
  margin-bottom: 1.6rem;
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;

  & > * {
    flex: 1;
  }
}

.form-wrapper {
  margin-bottom: 2.4rem;
  position: relative;
}

.login-button {
  outline: none;
  border: none;
  font-size: 1.4rem;
  border-radius: 20rem;
  width: 50%;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 2rem;
}

.form-message {
  font-size: 1.2rem;
  color: var(--vt-c-text-2);
  width: 100%;
  display: inline-block;
  text-align: right;
  margin-top: 1.2rem;

  .action {
    color: var(--vt-c-blue);
    cursor: pointer;
  }
}
</style>
