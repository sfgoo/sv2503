<script>
    import { goto } from '$app/navigation';
    import { getCurrentUser } from '$lib/api';
    import { onMount } from 'svelte';
    let email = '';
    let password = '';
    let error = '';

    async function login() {
        try {
            console.log('Login attempt:', { email, password });
            const response = await fetch('https://dir.chishmy.ru/auth/login', {
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

            await getCurrentUser();
            window.dispatchEvent(new Event('authChange'));
            goto('/');
        } catch (err) {
            error = err.message;
            console.error('Login error:', err);
        }
    }

    // Callback для Telegram Login
    function handleTelegramResponse(user) {
        console.log('Telegram auth response:', user);
        fetch('/api/telegram-auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Telegram auth server response:', data);
                if (data.success) {
                    localStorage.setItem('directus_token', data.access_token);
                    window.dispatchEvent(new Event('authChange'));
                    goto('/');
                } else {
                    error = 'Ошибка авторизации через Telegram: ' + (data.error || 'Неизвестная ошибка');
                }
            })
            .catch(err => {
                error = 'Ошибка сервера при авторизации через Telegram';
                console.error('Telegram auth fetch error:', err);
            });
    }

    onMount(() => {
        // Делаем handleTelegramResponse глобальной для Telegram Widget
        window.handleTelegramResponse = handleTelegramResponse;
    });
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

<!-- Telegram Login Widget -->
<div id="telegram-login" style="margin-top: 20px; text-align: center;">
    <script
            async
            src="https://telegram.org/js/telegram-widget.js?22"
            data-telegram-login="PublitaBot"
            data-size="large"
            data-onauth="handleTelegramResponse(user)"
            data-request-access="write"
    ></script>
</div>

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