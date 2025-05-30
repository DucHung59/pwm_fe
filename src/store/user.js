import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    workspace: null,
    role: null
  }),
  persist: {
    enabled: true,
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    async fetchUser() {
      this.isLoading = true;
      try {
        const res = await api.get('/user');
        this.user = res.data;

        if (res.data) {
          const resWorkspace = await api.get('/workspace');
          this.workspace = resWorkspace.data.workspace;
          this.role = resWorkspace.data.role;
        }
      } catch {
        this.user = null;
      } finally {
        this.isLoading = false;
      }
    },
    async logout() {
      const token = localStorage.getItem('token');
      try {
        await api.post('/auth/signout', {}, {
          headers: {
            Authorization:`Bearer ${token}`
          }
        });
        this.user = null;
        this.workspace = null;
        this.role = null;
        localStorage.removeItem('token');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  },
});