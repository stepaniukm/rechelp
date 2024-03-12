<script lang="ts" setup>
import { object, string, type Input } from "valibot";
import type { FormSubmitEvent } from "#ui/types";

const schema = object({
  name: string(),
});

type CreateOrganization = Input<typeof schema>;

const state = reactive({
  name: "",
});

const onSubmit = async (event: FormSubmitEvent<CreateOrganization>) => {
  const data = await $fetch("/api/organizations", {
    method: "POST",
    body: event.data,
  });

  console.log(data);
};
</script>

<template>
  <div>
    <h1>Organizations</h1>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Name" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>

      <UButton type="submit"> Submit </UButton>
    </UForm>
  </div>
</template>
