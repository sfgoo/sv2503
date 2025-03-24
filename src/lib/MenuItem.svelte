<script>
    // src/lib/MenuItem.svelte
    export let item;
    export let catalog; // Передаем весь каталог для поиска родителей

    // Функция для построения полного пути (можно вынести в утилиту, если используется в нескольких местах)
    function getFullPath(item, items) {
        const segments = [];
        let current = item;
        while (current) {
            segments.unshift(current.slug);
            current = items.find(i => i.id === current.parent_id);
        }
        return segments.join('/');
    }
</script>

<li>
    <a href={`/${getFullPath(item, catalog)}`}>{item.pagetitle}</a>
    {#if item.children && item.children.length > 0}
        <ul>
            {#each item.children as child}
                <svelte:self item={child} catalog={catalog} />
            {/each}
        </ul>
    {/if}
</li>