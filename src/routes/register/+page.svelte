<script>
    // src/routes/register/+page.svelte
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { fetchWithAuth } from '$lib/api'; // Импортируем функцию для работы с API
    let email = '';
    let password = '';
    let error = '';
    let success = '';

    async function register() {
        try {
            const response = await fetchWithAuth('https://dir.chishmy.ru/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    role: '8b4c6865-eeef-412b-8c9e-1b2f02017413', // ID роли Customer
                    status: 'active'
                })
            });

            if (!response.ok) {
                const { errors } = await response.json();
                throw new Error(errors[0]?.message || 'Ошибка регистрации');
            }

            success = 'Регистрация успешна! Войдите в систему.';
            error = '';
            setTimeout(() => goto('/login'), 2000);
        } catch (err) {
            error = err.message;
            success = '';
            console.error('Register error:', err);
        }
    }

    onMount(() => {});
</script>

<h1>Регистрация</h1>
<form on:submit|preventDefault={register}>
    <div>
        <label for="email">Email:</label>
        <input id="email" type="email" bind:value={email} required />
    </div>
    <div>
        <label for="password">Пароль:</label>
        <input id="password" type="password" bind:value={password} required />
    </div>
    <button type="submit">Зарегистрироваться</button>
</form>
{#if error}
    <p style="color: red">{error}</p>
{/if}
{#if success}
    <p style="color: green">{success}</p>
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
    p {
        text-align: center;
        margin-top: 10px;
    }
</style>