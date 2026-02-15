import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
    },
    {
      path: '/onboarding',
      name: 'Onboarding',
      component: () => import('@/views/Onboarding.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/course',
      name: 'Course',
      component: () => import('@/views/CourseView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      name: 'Welcome',
      component: () => import('@/views/WelcomeView.vue'),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  if (!auth.user && auth.token) {
    await auth.fetchMe();
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next('/login');
  } else if (auth.isLoggedIn && (to.name === 'Login' || to.name === 'Register')) {
    next('/dashboard');
  } else if (auth.isLoggedIn && auth.user?.is_new && to.name !== 'Onboarding' && to.name !== 'Profile') {
    next('/onboarding');
  } else if (auth.isLoggedIn && to.name === 'Welcome') {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
