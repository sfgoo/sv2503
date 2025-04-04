<!-- src/lib/Nav.svelte -->
<script>
    export let catalog;
    export let logoText;
    export let logoHref;

    // Функция для построения дерева меню
    function buildMenuTree(items, parentId = null) {
        return items
          .filter(item => item.parent_id === parentId)
          .map(item => ({
              ...item,
              children: buildMenuTree(items, item.id)
          }));
    }

    let menuTree = buildMenuTree(catalog);
</script>

<nav class="navbar">
    <div class="nav-container">
        <a href={logoHref} class="logo">{logoText}</a>
        <ul class="nav-menu">
            {#each menuTree as item}
                <li class="nav-item">
                    <a href={`/${item.slug}`} class="nav-link">{item.pagetitle}</a>
                    {#if item.children.length > 0}
                        <span class="dropdown-icon">▼</span>
                        <ul class="submenu">
                            {#each item.children as child}
                                <li><a href={`/${child.slug}`}>{child.pagetitle}</a></li>
                            {/each}
                        </ul>
                    {/if}
                </li>
            {/each}
        </ul>
    </div>
</nav>

<style>
    /* Ваши стили здесь */
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
</style>