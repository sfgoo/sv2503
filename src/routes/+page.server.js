import { getCatalog } from '$lib/api';

export async function load() {
    try {
        const catalog = await getCatalog();
        console.log('Server: Loaded catalog:', catalog);
        return { catalog };
    } catch (error) {
        console.error('Server: Error loading catalog:', error);
        return {
            status: 500,
            error: 'Ошибка загрузки каталога'
        };
    }
}