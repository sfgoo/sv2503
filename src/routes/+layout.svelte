<script>
    // filepath src/routes/+layout.svelte
    import '../app.css';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { getCurrentUser } from '$lib/api';
    import NavBar from '$lib/NavBar.svelte';
    import Nav from '$lib/Nav.svelte';
    import Breadcrumbs from '$lib/Breadcrumbs.svelte';
    import Footer from '$lib/Footer.svelte';
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
        // Слушаем событие authChange
        window.addEventListener('authChange', loadUser);
    });
</script>

<div class="min-h-screen flex flex-col">
    <NavBar {catalog} />
    
    <div class="mt-16">
        <div class="container mx-auto px-4 py-2">
            <div class="flex justify-end items-center">
                <div class="flex items-center space-x-4">
                    <p class="text-sm text-gray-600">Роль: {user.role || 'anonymous'}</p>
                    {#if user.role && user.role !== 'anonymous'}
                        <button
                            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            on:click={logout}
                        >
                            Выйти
                        </button>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <Breadcrumbs {catalog} currentSlug={$page.params.path?.split('/').pop() || ''} />

    <main class="flex-grow container mx-auto px-4 py-4">
        {#if user.role === 'anonymous'}
            <p class="text-gray-600 mb-4">Войдите, чтобы получить доступ к дополнительным функциям.</p>
        {/if}
        <slot />
    </main>

    <Footer />
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
</style>
