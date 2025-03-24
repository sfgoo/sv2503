<script>
    // src/routes/+page.svelte
    export let data;
    $: catalog = data.catalog || [];
</script>

<h1>Добро пожаловать!</h1>
{#if catalog.length > 0}
    <p>Выберите категорию из меню выше.</p>
{:else}
    <p>Каталог пуст</p>
{/if}