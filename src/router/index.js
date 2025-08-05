import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '../components/layout/AdminLayout.vue'
import ClientLayout from '../components/layout/ClientLayout.vue'
import { useUserStore } from '@/store/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/workspace',
      name: 'client',
      component: ClientLayout,
      meta: {
        requiresAuth: true,
        requiresWorkspace: true
      },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('../views/client/workspace/dashboard.vue'),
        },
        {
          path: 'members',
          name: 'Members',
          component: () => import('../views/client/workspace/members.vue'),
        },
        {
          path: 'project/:project_key',
          name: 'Project',
          component: () => import('../views/client/project/index.vue'),
          props: true,
        },
        {
          path: 'add/:project_key',
          name: 'Add Project',
          component: () => import('../views/client/project/add.vue'),
          props: true,
        },
        {
          path: 'task/:project_key',
          name: 'Task',
          component: () => import('../views/client/project/task.vue'),
          props: true,
        },
        {
          path: 'file/:project_key',
          name: 'Document',
          component: () => import('../views/client/project/document.vue'),
          props: true,
        },
        {
          path: 'reports/:project_key',
          name: 'Reports',
          component: () => import('../views/client/project/reports.vue'),
          props: true,
        },
        {
          path: 'view/:task_key',
          name: 'View task',
          component: () => import('../views/client/task/index.vue'),
          props: true,
        },
        {
          path: 'settings/:project_key',
          name: 'Project Settings',
          component: () => import('../views/client/project/settings.vue'),
          props: true,
        },
        {
          path: 'settings',
          name: 'Workspace Setting',
          component: () => import('../views/client/workspace/settings.vue'),
        },
        {
          path: 'activity/:user_id/:username',
          name: 'User Activity',
          component: () => import('../views/client/workspace/activity.vue'),
          props: true,
        }
      ],
    },
    {
      path: '/',
      name: 'Trang chủ',
      component: () => import('../views/client/index.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/client/login.vue'),
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/client/signup.vue'),
    },
    {
      path: '/profile',
      name: 'My Profile',
      component: () => import('../views/client/user/profile.vue')
    },
    { 
      path: '/:pathMatch(.*)*', 
      name: 'NotFound', 
      component: () => import('../views/client/notfound.vue') 
    },
    {
      path: '/create_workspace',
      name: 'Create workspace',
      component: () => import('../views/client/workspace/create.vue'),
    },
    {
      path: '/invite/:inviteToken',
      name: 'Accept',
      component: () => import('../views/client/accept.vue'),
      props: true,
    }
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  
  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!userStore.isLoggedIn) {
      return next('/login');
    }
  }

  // Check if route requires workspace
  if (to.matched.some(record => record.meta.requiresWorkspace)) {
    if (!userStore.workspace) {
      return next('/profile');
    }
  }

  next();
});

export default router
