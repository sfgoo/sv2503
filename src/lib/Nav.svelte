<script>
    import { onMount } from 'svelte';
    import { getCatalog } from './api';

    export let logoText = "Каталог";
    export let logoHref = "/";

    let catalog = [];
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            catalog = await getCatalog();
        } catch (err) {
            error = err.message;
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

<nav class="navbar">
    <div class="nav-container">
        <a href={logoHref} class="logo">
            {logoText}
        </a>

        {#if loading}
            <div class="loading">Загрузка меню...</div>
        {:else if error}
            <div class="error">{error}</div>
        {:else}
            <ul class="nav-menu">
                {#each buildTree() as item}
                    <li class="nav-item">
                        <a href={getFullPath(item)} class="nav-link">
                            {item.pagetitle}
                            {#if item.children.length > 0}
                                <span class="dropdown-icon">▼</span>
                            {/if}
                        </a>

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
    </div>
</nav>

<style>
    .navbar {
        background: #f8f9fa;
        padding: 1rem 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .nav-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
    }

    .logo {
        font-size: 1.5rem;
        font-weight: bold;
        text-decoration: none;
        color: #333;
        margin-right: 2rem;
    }

    .nav-menu {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 1rem;
    }

    .nav-item {
        position: relative;
    }

    .nav-link {
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem;
        text-decoration: none;
        color: #333;
        transition: all 0.3s ease;
    }

    .nav-link:hover {
        color: #007bff;
    }

    .dropdown-icon {
        margin-left: 0.3rem;
        font-size: 0.6rem;
    }

    .submenu {
        position: absolute;
        top: 100%;
        left: 0;
        background: white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        min-width: 200px;
        list-style: none;
        padding: 0.5rem 0;
        margin: 0;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 100;
    }

    .nav-item:hover .submenu {
        opacity: 1;
        visibility: visible;
    }

    .submenu li {
        padding: 0;
    }

    .submenu a {
        display: block;
        padding: 0.5rem 1rem;
        color: #333;
        text-decoration: none;
    }

    .submenu a:hover {
        background: #f8f9fa;
    }

    .loading, .error {
        padding: 0.5rem 1rem;
    }

    .error {
        color: #dc3545;
    }
</style>
