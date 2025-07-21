import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    workspace: null,
    workspaces: [],
    role: null
  }),
  persist: {
    enabled: true,
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
    isSystemAdmin: (state) => state.user?.username === "admin"
  },
  actions: {
    async fetchUser() {
      this.isLoading = true;
      try {
        const res = await api.get('/user');
        this.user = res.data;

        if (res.data) {
          if(this.user.username === 'admin') {
            const resWorkspaces = await api.get('/getAllWorkspace');
            this.workspaces = resWorkspaces.data.workspaces.data;
            this.workspace = this.workspaces[0] || null;
          } else {
            const resWorkspace = await api.get('/workspace');
            this.workspace = resWorkspace.data.workspace;
            this.role = resWorkspace.data.role;
          }
        }
      } catch {
        this.user = null;
      } finally {
        this.isLoading = false;
      }
    },
    async getWorkspaceById(id) {
      try {
        this.isLoading = true;
        const resWorkspace = await api.get('/getWorkspaceById', {
          params: {
            workspace_id: id,
          }
        });
        this.workspace = resWorkspace.data.workspace;
        this.role = resWorkspace.data.role;
        console.log(this.workspace);
        
      } catch (error) {
        console.log(error.message);
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
    },
  },
});