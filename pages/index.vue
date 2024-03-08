<script setup lang="ts">
import { deserialize, type SuperJSONResult } from "superjson";
import type { Counter } from "~/app/counter";
const { data: counterData } = useFetch<SuperJSONResult>("/counter/1", {
  key: "counter",
});

const counter = computed(() => {
  if (counterData.value)
    return deserialize<{ currentStreamVersion: number; state: Counter }>(
      counterData.value,
    );

  return {
    currentStreamVersion: 0,
    state: { status: "opened", value: 0 } satisfies Counter,
  };
});

const { execute: increment } = useFetch("/counter/1/increment", {
  method: "POST",
  immediate: false,
  onResponse() {
    refreshNuxtData("counter");
  },
});
const { execute: decrement } = useFetch("/counter/1/decrement", {
  method: "POST",
  immediate: false,
  onResponse() {
    refreshNuxtData("counter");
  },
});
const { execute: submit } = useFetch("/counter/1/submit", {
  method: "POST",
  immediate: false,
  onResponse() {
    refreshNuxtData("counter");
  },
});
const { session, clear } = useUserSession();
</script>

<template>
  <div>
    <div class="flex flex-col gap-1 w-40">
      <a href="/auth/github">Login With Github</a>
      <a href="/auth/google">Login With Google</a>
      <UButton size="sm" @click="clear()"> Sign Out </UButton>
    </div>
    <div>
      <pre>{{ session?.user }}</pre>
      <div v-if="counter?.state?.status == 'opened'">
        <span>Counter opened for increment/decrement</span>
        <span>Current value: {{ counter?.state?.value }}</span>
      </div>
      <div v-else>
        <span>Counter submitted</span>
        <span>Current final value: {{ counter?.state?.value }}</span>
      </div>
      <UButton size="sm" @click="increment()">+1</UButton>
      <UButton size="sm" color="red" @click="decrement()">-1</UButton>
      <UButton size="sm" @click="submit()">Submit</UButton>
      <UButton size="sm" @click="refreshNuxtData()">Refresh nuxt data</UButton>
    </div>
  </div>
</template>
