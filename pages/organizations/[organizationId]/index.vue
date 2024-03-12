<script lang="ts" setup>
import { type Organization } from "~/app/db/schema";
const route = useRoute("organizations-organizationId");
const { organizationId } = route.params;
const { data: organization } = await useFetch<Organization>(
  `/api/organizations/${organizationId}`,
  {
    key: `organizations_${organizationId}`,
  },
);
if (!organization.value) {
  showError({
    statusCode: 404,
    statusMessage: "Organization not found",
  });
}
const { execute, data } = useFetch<string>(
  `/api/organizations/${organizationId}/invite-url`,
  { immediate: false },
);
</script>

<template>
  <div>
    <h1>{{ organization!.name }}</h1>
    <button @click="() => execute()">Generate invite url</button>
    <span v-if="data">{{ data }}</span>
  </div>
</template>
