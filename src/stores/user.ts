import { getUserDetailsFromDB, updateUserDetailsInDB } from '@/userController';
import { Session } from '@supabase/supabase-js';
import { defineStore } from 'pinia';
import { ref } from 'vue';

type User = {
  name: string;
  email: string;
  current: number;
  savings: number;
  investments: number;
} | null;

export const useUserStore = defineStore('user', () => {
  const user = ref<User>(null);
  const userSession = ref<Session | null>(null);

  function setUser(newUser: User) {
    user.value = newUser;
  }

  function setUserSession(session: Session | null) {
    userSession.value = session;

    localStorage.setItem('userSession', JSON.stringify(session));
  }

  async function updateUserInfo(
    infoType: 'savings' | 'investments' | 'current',
    amount: number
  ) {
    if (!user.value) return;

    user.value[infoType] = amount;

    await updateUserDetailsInDB(user.value?.email || '', infoType, amount);
  }

  async function loadUserSessionAndDetails() {
    const sessionData = localStorage.getItem('userSession');
    if (!sessionData) return null;

    const parsedSessionData: Session = JSON.parse(sessionData);

    if (parsedSessionData.expires_at * 1000 > Date.now()) {
      userSession.value = parsedSessionData;
    } else {
      userSession.value = null;
    }

    if (userSession.value === null) return null;

    const userEmail = userSession.value.user.email || '';

    const userDetails = await getUserDetailsFromDB(userEmail);
    if (userDetails) {
      user.value = {
        name: userDetails.user_name,
        email: userEmail,
        current: userDetails.current,
        savings: userDetails.savings,
        investments: userDetails.investments,
      };
    } else {
      user.value = null;
    }

    return user.value;
  }

  return {
    user,
    setUser,
    userSession,
    setUserSession,
    loadUserSessionAndDetails,
    updateUserInfo,
  };
});
