<script>
    import Nav from '$lib/Nav.svelte';
    export let data;
    $: catalog = data.catalog;
</script>

<header>
    <Nav {catalog} />
</header>
<main>
    <slot />
</main>