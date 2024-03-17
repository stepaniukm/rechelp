<script setup lang="ts">
import type { MonacoEditor } from "#build/components";

const { session, clear } = useUserSession();
const editorRef = ref<InstanceType<typeof MonacoEditor>>();

onMounted(() => {
  console.log("Editor", editorRef.value);
});
</script>

<template>
  <div>
    <pre v-if="session?.user">{{ session?.user }}</pre>
    <div class="flex flex-col gap-1 w-40">
      <a href="/auth/github">Login With Github</a>
      <a href="/auth/google">Login With Google</a>
      <UButton size="sm" @click="clear()"> Sign Out </UButton>
    </div>
    <MonacoEditor class="p-10" lang="typescript" ref="editorRef" />
  </div>
</template>
