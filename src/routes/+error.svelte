<script>
	import { page } from '$app/stores';
</script>

<h1>Ошибка {$page.status}</h1>
<p>{$page.error?.message || 'Страница не найдена'}</p>

<a href="/">На главную</a>
