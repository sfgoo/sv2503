<!-- src/routes/signin/+page.svelte -->
<script>
	import { page } from '$app/stores';
	let email, password;
	export let form;
	const redirectedFrom = $page.url.searchParams.get('redirectedFrom');
</script>

{#if form?.message}
	<p>{form.message}</p>
{/if}

<form action="?/login{redirectedFrom?`&redirectedFrom=${redirectedFrom}`:''}" method="POST">
	<div>
		<label for="email">Email</label>
		<input id="email" name="email" type="text" bind:value={email} required />
	</div>
	<div>
		<label for="password">Password</label>
		<input id="password" name="password" type="password" required bind:value={password} />
	</div>
	<button type="submit">Log in</button>
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 300px;
        margin: 2rem auto;
    }
    div {
        display: flex;
        flex-direction: column;
    }
    label {
        margin-bottom: 0.5rem;
    }
    input {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    button {
        padding: 0.5rem;
        background-color: #1E3A8A;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    button:hover {
        background-color: #2563EB;
    }
</style>