// This file is used to load data for dynamic pages. It is called before the page component is created.

// src/routes/[...path]/+page.server.js

import { getItemBySlug, getGalleryImages } from '$lib/api';

export async function load({ params }) {
    const path = params.path.split('/');
    const slug = path[path.length - 1];
    console.log('Loading page for path:', params.path, 'slug:', slug);
    try {
        const item = await getItemBySlug(slug);
        if (!item || !item.content) {
            console.log('No content found for slug:', slug);
            throw { status: 404, message: 'Страница не найдена или нет содержимого' };
        }
        const gallery = item.gallery ? await getGalleryImages(item.gallery) : [];
        console.log('Item loaded:', item, 'Gallery:', gallery);
        return { item, gallery };
    } catch (error) {
        console.error('Error loading page:', error);
        return {
            status: error.status || 500,
            error: error.message || 'Ошибка загрузки'
        };
    }
}