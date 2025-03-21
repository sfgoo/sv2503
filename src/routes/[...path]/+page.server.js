import { getItemBySlug } from '$lib/api';

export async function load({ params }) {
    const path = params.path.split('/'); // Разделяем путь на сегменты
    const slug = path[path.length - 1]; // Берем последний сегмент как slug
    console.log('Loading page for path:', params.path, 'slug:', slug);
    try {
        const item = await getItemBySlug(slug);
        if (!item || !item.content) {
            console.log('No content found for slug:', slug);
            throw { status: 404, message: 'Страница не найдена или нет содержимого' };
        }
        console.log('Item loaded:', item);
        return { item };
    } catch (error) {
        console.error('Error loading page:', error);
        return {
            status: error.status || 500,
            error: error.message || 'Ошибка загрузки'
        };
    }
}