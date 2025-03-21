const API_URL = 'http://121.127.37.57:8055/items/items';

export async function getCatalog() {
    const response = await fetch(`${API_URL}?fields=id,pagetitle,parent_id,slug`);
    if (!response.ok) throw new Error(`Ошибка ${response.status}`);
    const { data } = await response.json();
    console.log('getCatalog response:', data);
    return data;
}

export async function getItemBySlug(slug) {
    const response = await fetch(`${API_URL}?filter[slug][_eq]=${slug}`);
    if (!response.ok) throw new Error(`Ошибка ${response.status}`);
    const { data } = await response.json();
    console.log('getItemBySlug response for', slug, ':', data);
    return data[0] || null;
}