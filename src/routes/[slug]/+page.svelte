<script>
    import { getItemBySlug } from '$lib/api';

    export let data;
    const { slug } = data;

    let item = null;
    let error = null;

    async function loadItem() {
        try {
            item = await getItemBySlug(slug);
            if (!item) error = 'Страница не найдена';
        } catch (err) {
            error = `Ошибка загрузки: ${err.message}`;
        }
    }

    loadItem();
</script>

{#if error}
    <p>{error}</p>
{:else}
    {#await item}
        <p>Загрузка...</p>
    {:then}
        {#if item}
            <h1>{item.pagetitle}</h1>
            <p>{item.content}</p>
        {/if}
    {/await}
{/if}