import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Invite from '@/views/Invite.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Login
    },
    {
      path: '/invite',
      name: 'invite',
      component: Invite
    },
    {
      path: '/',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/invite-user',
          name: 'invite-user',
          component: () => import('@/views/InviteUser.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
        },
        {
          path: 'students/:id',
          name: 'student-details',
          component: () => import('@/views/StudentDetails.vue'),
        },
        {
          path: 'students/:id/invoice-editor',
          name: 'InvoiceEditor',
          component: () => import('@/views/InvoiceEditor.vue'),
          meta: { title: 'Invoice Editor' }
        }
      ]
    }
  ]
})

export default router
