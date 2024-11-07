<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from 'vue-clerk'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { createClerkClient } from '@clerk/backend'

import Button from '@/components/shared/Button.vue'

const clerkClient = createClerkClient({ secretKey: import.meta.env.VITE_CLERK_SECRET_KEY })

const router = useRouter()
const { isSignedIn } = useAuth()

const email = ref('')
const role = ref('basic_member')
const isLoading = ref(false)

const sendInvitation = async () => {
  if (!email.value) {
    toast.error('Please enter an email address')
    return
  }

  try {
    isLoading.value = true
    await clerkClient.invitations.createInvitation({
      emailAddress: email.value,
      redirectUrl: `${window.location.origin}/dashboard`,
      publicMetadata: {
        role: role.value
        
      }
    })
    
    toast.success('Invitation sent successfully!')
    email.value = '' // Reset form
  } catch (error: any) {
    toast.error(error.message || 'Failed to send invitation')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (!isSignedIn.value) {
    router.push('/')
  }
})
</script>

<template>
  <div class="min-h-screen bg-white text-gray-800 flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
      <div>
        <h2 class="text-3xl font-bold text-center text-gray-900">Invite User</h2>
        <p class="mt-2 text-center text-gray-600">
          Send an invitation to join your organization
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="sendInvitation">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-100"
            placeholder="user@example.com"
          />
        </div>

        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="role"
            v-model="role"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-100"
          >
            <option value="basic_member">Basic Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Button
          @click="sendInvitation"
          :disabled="isLoading"
          :showIcon="isLoading ? 'loading' : 'send'"
          buttonClass="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
        >
          {{ isLoading ? 'Sending...' : 'Send Invitation' }}
        </Button>
      </form>

      <div class="mt-4">
        <Button
          showIcon="return"
          iconPosition="left"
          @click="router.push('/dashboard')"
          buttonClass="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  </div>
</template>