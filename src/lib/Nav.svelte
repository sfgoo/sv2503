<script>
    import MenuItem from './MenuItem.svelte';
    export let catalog = [];

    function buildTree(items = [], parentId = null) {
        return items
            .filter(item => item.parent_id === parentId) // Исправлено Altonparent_id на parent_id
            .map(item => ({
                ...item,
                children: buildTree(items, item.id)
            }));
    }
</script>

<nav>
    {#if catalog.length > 0}
        <ul>
            {#each buildTree(catalog) as item}
                <MenuItem {item} />
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