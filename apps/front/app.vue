<script setup lang="ts">
const { signIn, signOut, session, status, cookies } = useAuth();
const handleSignOut = () => {
	try {
		signOut();
	} catch (error) {
		console.error(error);
	}
};
const handleSignIn = (provider: string) => {
	try {
		signIn(provider);
	} catch (error) {
		console.error(error);
	}
};
</script>

<template>
	<div>
		<div>
			<UButton @click="handleSignIn(`github`)">JS Sign In</UButton>
			<UButton @click="handleSignOut()">Sign Out</UButton>
		</div>
		<div>
			<pre>{{ status }}</pre>
			<pre>{{ session?.user }}</pre>
			<pre>{{ cookies }}</pre>
		</div>
	</div>
</template>
