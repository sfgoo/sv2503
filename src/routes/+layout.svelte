<!-- src/routes/+layout.svelte -->
<script>
    //src/routes/+layout.svelte
    import Nav from '$lib/Nav.svelte';
    import Footer from '$lib/Footer.svelte';
    import { getCurrentUser } from '$lib/api';
    import { onMount } from 'svelte';

    let user = { role: 'anonymous' };

    onMount(async () => {
        user = await getCurrentUser();
    });
    export let data;
</script>

<div class="layout">
    <header>
        <Nav catalog={data.catalog} logoText="Мой Каталог" logoHref="/" />
    </header>
    <main>
        <slot />
    </main>
    <footer>
        <Footer />
    </footer>
</div>


<style>
    .layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }
    main {
        flex: 1;
        padding: 2rem 1rem;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
    }
</style>