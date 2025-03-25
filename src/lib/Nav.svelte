<script>
    import { onMount } from 'svelte';
    import { getCatalog } from './api';

    // Добавляем проп для логотипа
    export let logoUrl = '/';
    export let logoText = 'Логотип';

    let catalog = [];
    let loading = true;

    onMount(async () => {
        try {
            catalog = await getCatalog();
        } finally {
            loading = false;
        }
    });

    function buildTree(parentId = null) {
        return catalog
          .filter(item => item.parent_id === parentId)
          .map(item => ({
              ...item,
              children: buildTree(item.id)
          }));
    }

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

<nav class="nav">
    <!-- Логотип с переходом на корень -->
    <a href="/" class="logo">{logoText}</a>

    {#if loading}
        <p>Загрузка...</p>
    {:else}
        <ul>
            {#each buildTree() as item}
                <li>
                    <!-- Ссылка на верхний уровень -->
                    <a href={getFullPath(item)} class="nav-link">
                        {item.pagetitle}
                        {#if item.children.length > 0}
                            <span class="dropdown-icon">▼</span>
                        {/if}
                    </a>

                    <!-- Подменю -->
                    {#if item.children.length > 0}
                        <ul class="submenu">
                            {#each item.children as child}
                                <li>
                                    <a href={getFullPath(child)}>{child.pagetitle}</a>
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </li>
            {/each}
        </ul>
    {/if}
</nav>

<style>
    .nav {
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    .logo {
        font-weight: bold;
        font-size: 1.5rem;
        text-decoration: none;
        color: inherit;
    }

    .nav ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        gap: 1rem;
    }

    .nav li {
        position: relative;
    }

    .nav-link {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        padding: 0.5rem 1rem;
    }

    .dropdown-icon {
        font-size: 0.6rem;
    }

    .submenu {
        position: absolute;
        top: 100%;
        left: 0;
        background: white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        display: none;
        flex-direction: column;
        min-width: 200px;
    }

    li:hover .submenu {
        display: flex;
    }
</style>
