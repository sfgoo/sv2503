<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { getCurrentUser } from '$lib/api';
    import Nav from '$lib/Nav.svelte';
    import Breadcrumbs from '$lib/Breadcrumbs.svelte';
    export let data;
    $: catalog = data.catalog || [];
    let user = { role: 'anonymous' };

    async function loadUser() {
        try {
            user = await getCurrentUser();
            console.log('Current user:', user);
        } catch (err) {
            console.error('Error loading user:', err);
            user = { role: 'anonymous' };
        }
    }

    function logout() {
        localStorage.removeItem('directus_token');
        localStorage.removeItem('refresh_token');
        user = { role: 'anonymous' };
        goto('/login');
    }

    onMount(() => {
        loadUser();
        window.addEventListener('authChange', loadUser);
    });
</script>

<header>
    <Nav {catalog} />
    <p>Роль: {user.role || 'anonymous'}</p>
    {#if user.role && user.role !== 'anonymous'}
        <button on:click={logout}>Выйти</button>
    {/if}
</header>

<Breadcrumbs {catalog} currentSlug={$page.params.path?.split('/').pop() || ''} />

<main>
    {#if user.role === 'anonymous'}
        <p>Войдите, чтобы получить доступ к дополнительным функциям.</p>
    {/if}
    <slot />
</main>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
    }
    button {
        padding: 5px 10px;
        background-color: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    button:hover {
        background-color: #c82333;
    }
    p {
        margin: 0 10px;
    }
</style>