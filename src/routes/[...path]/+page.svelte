<script>
    // src/routes/%5B...path%5D/+page.svelte
    export let data;
    $: item = data.item;
    $: gallery = data.gallery || [];
    $: error = data.error;
    $: status = data.status;
    console.log('Gallery data on page:', gallery);
</script>

{#if error}
    <p>{error} (Статус: {status})</p>
{:else if item}
    <h1>{item.pagetitle}</h1>
    <p>{item.content}</p>
    {#if gallery.length > 0}
        <div class="gallery">
            {#each gallery as image}
                <figure>
                    <img src={image.url} alt="" />
                    <figcaption>{image.alt}</figcaption>
                </figure>
            {/each}
        </div>
    {/if}
{:else}
    <p>Загрузка...</p>
{/if}

<style>
    .gallery {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-top: 20px;
    }
    figure {
        margin: 0;
        text-align: center;
    }
    img {
        max-width: 200px;
        height: auto;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    figcaption {
        font-size: 12px;
        color: #666;
        margin-top: 5px;
    }
</style>