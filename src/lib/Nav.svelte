<script>
    // src/lib/Nav.svelte
    import MenuItem from './MenuItem.svelte';
    export let catalog = [];

    function buildTree(items = [], parentId = null) {
        return items
            .filter(item => item.parent_id === parentId)
            .map(item => ({
                ...item,
                children: buildTree(items, item.id)
            }));
    }

    // Функция для построения полного пути
    function getFullPath(item, items) {
        const segments = [];
        let current = item;
        while (current) {
            segments.unshift(current.slug); // Добавляем slug в начало массива
            current = items.find(i => i.id === current.parent_id);
        }
        return segments.join('/'); // Собираем путь
    }
</script>

<nav>
    {#if catalog.length > 0}
        <ul>
            {#each buildTree(catalog) as item}
                <MenuItem {item} catalog={catalog} />
            {/each}
        </ul>
    {:else}
        <p>Каталог пуст</p>
    {/if}
</nav>

<style>
    ul {
        list-style: none;
        padding: 0;
    }
    ul ul {
        margin-left: 20px;
    }
    a {
        text-decoration: none;
        color: #333;
    }
    a:hover {
        text-decoration: underline;
    }
</style>