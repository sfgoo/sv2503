<script>
    import { getCatalog } from '$lib/api';
    let catalog = [];

    async function loadCatalog() {
        try {
            catalog = await getCatalog();
        } catch (error) {
            console.error('Ошибка загрузки каталога:', error);
            catalog = [];
        }
    }

    function buildTree(items = [], parentId = null) {
        return items
            .filter(item => item.parent_id === parentId)
            .map(item => ({
                ...item,
                children: buildTree(items, item.id)
            }));
    }

    loadCatalog();
</script>

<nav>
    {#await catalog}
        <p>Загрузка...</p>
    {:then items}
        {#if items.length > 0}
            <ul>
                {#each buildTree(items) as item}
                    <li>
                        <a href={`/${item.slug}`}>{item.pagetitle}</a>
                        {#if item.children.length > 0}
                            <ul>
                                {#each item.children as child}
                                    <li><a href={`/${child.slug}`}>{child.pagetitle}</a></li>
                                {/each}
                            </ul>
                        {/if}
                    </li>
                {/each}
            </ul>
        {:else}
            <p>Каталог пуст</p>
        {/if}
    {:catch error}
        <p>Ошибка: {error.message}</p>
    {/await}
</nav>