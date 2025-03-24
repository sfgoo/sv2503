<script>
    // src/routes/accept-invite/+page.svelte
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    let password = '';
    let error = '';

    async function acceptInvite() {
        const token = $page.url.searchParams.get('token');
        if (!token) {
            error = 'Неверная ссылка';
            return;
        }

        try {
            const response = await fetch('http://121.127.37.57:8055/users/invite/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });

            if (!response.ok) {
                throw new Error('Ошибка активации');
            }

            alert('Учетная запись активирована! Войдите в систему.');
            goto('/login');
        } catch (err) {
            error = err.message;
            console.error('Accept invite error:', err);
        }
    }
</script>

<h1>Активация аккаунта</h1>
<form on:submit|preventDefault={acceptInvite}>
    <div>
        <label for="password">Задайте пароль:</label>
        <input id="password" type="password" bind:value={password} required />
    </div>
    <button type="submit">Активировать</button>
</form>
{#if error}
    <p style="color: red">{error}</p>
{/if}

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 300px;
        margin: 20px auto;
    }
    button {
        padding: 10px;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    button:hover {
        background-color: #218838;
    }
</style>