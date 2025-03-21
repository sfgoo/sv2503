<script>
    export let item;
</script>

<li>
    <a href={`/${item.slug}`}>{item.pagetitle}</a>
    {#if item.children && item.children.length > 0}
        <ul>
            {#each item.children as child}
                <svelte:self item={child} />
            {/each}
        </ul>
    {/if}
</li>