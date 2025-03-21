const API_URL = 'http://121.127.37.57:8055/items/items';

export async function getItems() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Ошибка ${response.status}`);
    const { data } = await response.json();
    return data;
}

export async function getCatalog() {
    const response = await fetch(`${API_URL}?fields=id,pagetitle,parent_id,slug`);
    if (!response.ok) throw new Error(`Ошибка ${response.status}`);
    const { data } = await response.json();
    return data;
}

export async function getItemBySlug(slug) {
    const response = await fetch(`http://121.127.37.57:8055/items/items?filter[slug][_eq]=${slug}`);
    if (!response.ok) throw new Error(`Ошибка ${response.status}`);
    const { data } = await response.json();
    return data[0] || null;
}