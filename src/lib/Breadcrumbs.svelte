<script>
    export let catalog = [];
    export let currentSlug;

    $: breadcrumbs = (() => {
        const result = [];
        let current = catalog.find(item => item.slug === currentSlug);

        while (current) {
            result.unshift({
                title: current.pagetitle,
                path: getFullPath(current)
            });
            current = catalog.find(item => item.id === current.parent_id);
        }

        return result;
    })();

    function getFullPath(item) {
        const segments = [];
        let current = item;
        while (current) {
            segments.unshift(current.slug);
            current = catalog.find(i => i.id === current.parent_id);
        }
        return `/${segments.join('/')}`;
    }
</script>

{#if breadcrumbs.length > 1}
    <nav class="breadcrumbs">
        {#each breadcrumbs as crumb, i}
            {#if i < breadcrumbs.length - 1}
                <a href={crumb.path}>{crumb.title}</a>
                <span class="separator">/</span>
            {:else}
                <span class="current">{crumb.title}</span>
            {/if}
        {/each}
    </nav>
{/if}

<style>
    .breadcrumbs {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 1rem;
        font-size: 0.9rem;
    }

    .breadcrumbs a {
        color: #007bff;
        text-decoration: none;
    }

    .breadcrumbs a:hover {
        text-decoration: underline;
    }

    .separator {
        margin: 0 0.5rem;
        color: #6c757d;
    }

    .current {
        color: #6c757d;
    }
</style>
