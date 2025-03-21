import { getItemBySlug } from '$lib/api';

export async function load({ params }) {
    const { slug } = params;
    console.log('Loading slug:', slug); // Логируем slug для проверки
    try {
        const item = await getItemBySlug(slug);
        console.log('Item loaded:', item); // Логируем полученные данные
        if (!item) {
            return {
                status: 404,
                error: 'Страница не найдена'
            };
        }
        return { item };
    } catch (error) {
        console.error('Error in load:', error);
        return {
            status: 500,
            error: `Ошибка загрузки: ${error.message}`
        };
    }
}