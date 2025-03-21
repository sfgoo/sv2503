import { getCatalog } from '$lib/api';

export async function load() {
    console.log('Loading catalog...');
    try {
        const catalog = await getCatalog();
        console.log('Catalog loaded:', catalog);
        return { catalog };
    } catch (error) {
        console.error('Error loading catalog:', error);
        return { catalog: [] };
    }
}