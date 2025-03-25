<script>
    // src/routes/login/+page.svelte
        import { goto } from '$app/navigation';
        let email = '';
        let password = '';
        let error = '';

        async function handleLogin() {
        try {
        const res = await fetch('https://dir.chishmy.ru/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, mode: 'json' })
    });

        if (!res.ok) throw new Error(await res.text());

        const { data } = await res.json();
        localStorage.setItem('directus_token', data.access_token);
        await goto('/');
    } catch (err) {
        error = err.message;
    }
    }
</script>

<form on:submit|preventDefault={handleLogin}>
    <input type="email" bind:value={email} placeholder="Email" required>
    <input type="password" bind:value={password} placeholder="Password" required>
    <button type="submit">Войти</button>
    {#if error}<p class="error">{error}</p>{/if}
</form>

<style>
    form {
        max-width: 400px;
        margin: 2rem auto;
    }
    .error { color: red; }
</style>
