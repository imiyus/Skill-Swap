import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    async login(email, password) {
      const response = await api.post('/auth', { email, password });
      this.token = response.data.token;
      this.user = response.data.data;
      localStorage.setItem('token', this.token);
    },
    async register(userData) {
      const response = await api.post('/register', userData);
      this.token = response.data.token;
      this.user = response.data.data;
      localStorage.setItem('token', this.token);
    },
    async fetchMe() {
      if (!this.token) return;
      try {
        const response = await api.get('/auth_me');
        this.user = response.data;
      } catch (e) {
        this.logout();
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },
    async updateUser(data) {
      if (!this.user?.id) return;
      const response = await api.patch(`/users/${this.user.id}`, data);
      this.user = response.data;
    }
  },
});
