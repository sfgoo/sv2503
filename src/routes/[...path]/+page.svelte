<script>
    export let data;
    $: item = data.item;
    $: error = data.error;
    $: status = data.status;
</script>

{#if error}
    <p>{error} (Статус: {status})</p>
{:else if item}
    <h1>{item.pagetitle}</h1>
    <p>{item.content}</p>
{:else}
    <p>Загрузка...</p>
{/if}