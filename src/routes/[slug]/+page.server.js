import { getItemBySlug } from '$lib/api';

export async function load({ params }) {
    const { slug } = params;
    console.log('Loading page for slug:', slug);
    try {
        const item = await getItemBySlug(slug);
        console.log('Item loaded:', item);
        if (!item) {
            console.log('No item found for slug:', slug);
            throw { status: 404, message: 'Страница не найдена' };
        }
        return { item };
    } catch (error) {
        console.error('Error loading page:', error);
        return {
            status: error.status || 500,
            error: error.message || 'Ошибка загрузки'
        };
    }
}