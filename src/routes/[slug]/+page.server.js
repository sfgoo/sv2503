import { getItemBySlug } from '$lib/api';

export async function load({ params }) {
    const { slug } = params;
    return { slug };
}