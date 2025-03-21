const API_URL = 'http://121.127.37.57:8055/items/items';
const GALLERY_URL = 'http://121.127.37.57:8055/items/gallery';
const GALLERY_FILES_URL = 'http://121.127.37.57:8055/items/gallery_files';
const ASSETS_BASE_URL = 'http://121.127.37.57:8055/assets/';

export async function getCatalog() {
    const response = await fetch(`${API_URL}?fields=id,pagetitle,parent_id,slug`);
    if (!response.ok) throw new Error(`Ошибка ${response.status}`);
    const { data } = await response.json();
    return data;
}

export async function getItemBySlug(slug) {
    const response = await fetch(`${API_URL}?filter[slug][_eq]=${slug}`);
    if (!response.ok) throw new Error(`Ошибка ${response.status}`);
    const { data } = await response.json();
    return data[0] || null;
}

export async function getGalleryImages(galleryIds) {
    if (!galleryIds || galleryIds.length === 0) return [];

    const galleryResponse = await fetch(`${GALLERY_URL}?filter[id][_in]=${galleryIds.join(',')}`);
    if (!galleryResponse.ok) throw new Error(`Ошибка ${galleryResponse.status}`);
    const { data: galleryData } = await galleryResponse.json();

    // Изображения из поля image
    const imageIds = galleryData
        .filter(item => item.image)
        .map(item => ({
            url: `${ASSETS_BASE_URL}${item.image}`,
            alt: item.alt || 'Изображение'
        }));

    // Изображения из поля files через gallery_files
    const filesIds = galleryData
        .filter(item => item.files && item.files.length > 0)
        .flatMap(item => item.files);

    let filesImages = [];
    if (filesIds.length > 0) {
        const filesResponse = await fetch(`${GALLERY_FILES_URL}?filter[id][_in]=${filesIds.join(',')}`);
        if (!filesResponse.ok) throw new Error(`Ошибка ${filesResponse.status}`);
        const { data: filesData } = await filesResponse.json();
        filesImages = filesData.map(file => ({
            url: `${ASSETS_BASE_URL}${file.directus_files_id}`,
            alt: galleryData.find(g => g.files.includes(file.id))?.alt || 'Изображение'
        }));
    }

    return [...imageIds, ...filesImages].filter(image => image.url);
}