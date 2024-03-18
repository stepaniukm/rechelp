<script setup lang="ts">
const { session, clear } = useUserSession();
</script>

<template>
  <div>
    <pre v-if="session?.user">{{ session?.user }}</pre>
    <div class="flex flex-col gap-1 w-40">
      <a href="/auth/github">Login With Github</a>
      <a href="/auth/google">Login With Google</a>
      <UButton size="sm" @click="clear()"> Sign Out </UButton>
    </div>
  </div>
</template>
