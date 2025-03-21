<script>
    import { page } from '$app/stores';
    import Nav from '$lib/Nav.svelte';
    import Breadcrumbs from '$lib/Breadcrumbs.svelte';
    export let data;
    $: catalog = data.catalog;
</script>

<header>
    <Nav {catalog} />
</header>

<Breadcrumbs {catalog} currentSlug={$page.params.path?.split('/').pop() || ''} />

<main>
    <slot />
</main>