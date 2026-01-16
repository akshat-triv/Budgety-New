import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/views/DashboardView.vue';
import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('@/views/LoginSignupView.vue'),
    },
  ],
});

router.beforeEach(async (to, _, next) => {
  // Add any global navigation guards here if needed
  const userStore = useUserStore();
  const userDetails = await userStore.loadUserSessionAndDetails();

  if (userDetails === null && to.name !== 'signin') {
    return next({ name: 'signin' });
  } else if (userDetails !== null && to.name === 'signin') {
    return next({ name: 'dashboard' });
  }

  next();
});

export default router;
