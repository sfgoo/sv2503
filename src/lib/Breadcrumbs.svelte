<script>
    // src/lib/Breadcrumbs.svelte
    export let catalog = [];
    export let currentSlug;

    // Функция для поиска элемента по slug
    function findItemBySlug(slug) {
        return catalog.find(item => item.slug === slug);
    }

    // Построение пути для хлебных крошек
    function buildBreadcrumbs(slug) {
        const breadcrumbs = [];
        let current = findItemBySlug(slug);
        while (current) {
            breadcrumbs.unshift({
                pagetitle: current.pagetitle,
                slug: current.slug,
                path: getFullPath(current)
            });
            current = catalog.find(item => item.id === current.parent_id);
        }
        return breadcrumbs;
    }

    // Функция для построения полного пути (аналогично Nav.svelte)
    function getFullPath(item) {
        const segments = [];
        let current = item;
        while (current) {
            segments.unshift(current.slug);
            current = catalog.find(i => i.id === current.parent_id);
        }
        return segments.join('/');
    }

    $: breadcrumbs = buildBreadcrumbs(currentSlug);
    $: isTopLevel = findItemBySlug(currentSlug)?.parent_id === null;
</script>

{#if !isTopLevel && breadcrumbs.length > 0}
    <nav class="breadcrumbs">
        {#each breadcrumbs as crumb, index}
            {#if index < breadcrumbs.length - 1}
                <a href={`/${crumb.path}`}>{crumb.pagetitle}</a>
                <span> > </span>
            {:else}
                <span>{crumb.pagetitle}</span>
            {/if}
        {/each}
    </nav>
{/if}

<style>
    .breadcrumbs {
        margin: 10px 0;
        font-size: 14px;
    }
    a {
        text-decoration: none;
        color: #007bff;
    }
    a:hover {
        text-decoration: underline;
    }
    span {
        color: #333;
    }
</style>