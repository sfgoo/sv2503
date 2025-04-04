// src/routes/+layout.server.js
import { getCatalog } from '$lib/api';

export async function load() {
    try {
        const catalog = await getCatalog();
        return { catalog };
    } catch (error) {
        console.error('Ошибка загрузки каталога:', error);
        return { catalog: [] };
    }
}