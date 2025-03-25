// This file is used to load data for dynamic pages. It is called before the page component is created.

// src/routes/[...path]/+page.server.js

import { getItemBySlug, getGalleryImages } from '$lib/api';

export async function load({ params }) {
    if (!params.path) return { status: 404 };

    try {
        const item = await getItemBySlug(params.path);
        if (!item) return { status: 404 };

        const galleryImages = item.gallery
          ? await getGalleryImages(item.gallery)
          : [];

        return {
            props: { item, galleryImages }
        };
    } catch (error) {
        return {
            status: 500,
            error: error.message
        };
    }
}
