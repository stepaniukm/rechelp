<script setup lang="ts">
import { type SuperJSONResult, deserialize } from "superjson";
import type { Counter } from "~/app/counter";
const route = useRoute("counters-streamId");
const { streamId } = route.params;
const { data: counterData } = await useFetch<SuperJSONResult>(
  `/api/counter/${streamId}`,
  {
    key: `counter_${streamId}`,
  },
);

const counter = computed(() => {
  if (counterData.value) {
    return deserialize<{ currentStreamVersion: number; state: Counter }>(
      counterData.value,
    );
  }

  return {
    currentStreamVersion: 0,
    state: { status: "opened", value: 0 } satisfies Counter,
  };
});

const { execute: increment } = useFetch(`/api/counter/${streamId}/increment`, {
  method: "POST",
  immediate: false,
  onResponse() {
    refreshNuxtData(`counter_${streamId}`);
  },
});
const { execute: decrement } = useFetch(`/api/counter/${streamId}/decrement`, {
  method: "POST",
  immediate: false,
  onResponse() {
    refreshNuxtData(`counter_${streamId}`);
  },
});
const { execute: submit } = useFetch(`/api/counter/${streamId}/submit`, {
  method: "POST",
  immediate: false,
  onResponse() {
    refreshNuxtData(`counter_${streamId}`);
  },
});

const prevPage = Number(streamId) - 1;
const nextPage = Number(streamId) + 1;

definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <div>
    <div>
      <NuxtLink :to="`/counters/${prevPage}`"
        ><Icon size="30" name="ant-design:left-outlined"
      /></NuxtLink>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink :to="`/counters/${nextPage}`"
        ><Icon size="30" name="ant-design:right-outlined"
      /></NuxtLink>
    </div>
    <div>
      <div v-if="counter?.state?.status == 'opened'">
        <span>Counter opened for increment/decrement</span>
        <span>Current value: {{ counter?.state?.value }}</span>
      </div>
      <div v-else-if="counter?.state?.status === 'submitted'">
        <span>Counter submitted</span>
        <span>Current final value: {{ counter?.state?.value }}</span>
      </div>
      <div v-else>
        <span>No counter yet</span>
      </div>
      <UButton size="sm" @click="increment()">+1</UButton>
      <UButton size="sm" color="red" @click="decrement()">-1</UButton>
      <UButton size="sm" @click="submit()">Submit</UButton>
      <UButton size="sm" @click="refreshNuxtData()">Refresh nuxt data</UButton>
    </div>
  </div>
</template>
