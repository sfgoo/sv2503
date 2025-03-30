<script>
    // src/routes/login/+page.svelte
    import { goto } from '$app/navigation';
    import { getCurrentUser } from '$lib/api';
    import { fetchWithAuth } from '$lib/api'; // Импортируем функцию для работы с API
    let email = '';
    let password = '';
    let error = '';

    async function login() {
        try {
            console.log('Login attempt:', { email, password });
            const response = await fetchWithAuth('https://dir.chishmy.ru/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            console.log('Login response status:', response.status);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка ${response.status}: ${errorText}`);
            }

            const { data } = await response.json();
            console.log('Login data:', data);
            localStorage.setItem('directus_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            console.log('Token saved:', localStorage.getItem('directus_token'));

            // Проверяем пользователя сразу после входа
            await getCurrentUser();
            // Отправляем событие для немедленного обновления
            window.dispatchEvent(new Event('authChange'));

            goto('/'); // Переход на главную
        } catch (err) {
            error = err.message;
            console.error('Login error:', err);
        }
    }
</script>

<h1>Вход</h1>
<form on:submit|preventDefault={login}>
    <div>
        <label for="email">Email:</label>
        <input id="email" type="email" bind:value={email} required />
    </div>
    <div>
        <label for="password">Пароль:</label>
        <input id="password" type="password" bind:value={password} required />
    </div>
    <button type="submit">Войти</button>
    <a href="/register">Зарегистрироваться</a>
</form>
<div id="telegram-login" style="margin-top: 20px; text-align: center;"></div>
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
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    button:hover {
        background-color: #0056b3;
    }
    a {
        text-align: center;
        margin-top: 10px;
    }
    p {
        text-align: center;
        margin-top: 10px;
    }
</style>