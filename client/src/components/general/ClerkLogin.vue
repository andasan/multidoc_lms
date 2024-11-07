<script setup lang="ts">
import { SignedIn, SignedOut, UserButton, SignIn, SignUp } from 'vue-clerk'

const props = withDefaults(defineProps<{
  isCollapsed?: boolean
  isInvite?: boolean
}>(), {
  isInvite: false,
  isCollapsed: false
})
</script>


<template>
  <div class="flex flex-col items-center justify-center !text-white">
    <SignedOut>
      <template v-if="!props.isInvite">
        <SignIn :appearance="{
          elements: {
            userButtonOuterIdentifier: 'text-gray-200',
            footer: 'hidden'
          }
        }" />
      </template>
      <SignUp v-if="props.isInvite" :appearance="{
        elements: {
          userButtonOuterIdentifier: 'text-gray-200',
          footer: 'hidden'
        }
      }" />
    </SignedOut>
    <SignedIn>
      <UserButton :show-name="!props.isCollapsed" :appearance="{
        elements: {
          userButtonOuterIdentifier: 'text-gray-200',
          userButtonPopoverFooter: 'hidden'
        }
      }" />
    </SignedIn>
  </div>
</template>

<style scoped>
.elegant-button {
  position: relative;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

.elegant-button::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  transition: all 0.3s ease;
}

.elegant-button:hover::after {
  inset: -3px;
  border-color: rgba(255, 255, 255, 0.3);
}

.elegant-button:active::after {
  inset: 0;
  border-color: rgba(255, 255, 255, 0.5);
}
</style>
