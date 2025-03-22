const API_URL = 'https://dir.chishmy.ru/items/items';
const GALLERY_URL = 'https://dir.chishmy.ru/items/gallery';
const GALLERY_FILES_URL = 'https://dir.chishmy.ru/items/gallery_files';
const ASSETS_BASE_URL = 'https://dir.chishmy.ru/assets/';

function getAuthHeaders() {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('directus_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function getCurrentUser() {
    if (typeof window === 'undefined') return { role: 'anonymous' };
    const token = localStorage.getItem('directus_token');
    console.log('Checking token:', token);
    if (!token) return { role: 'anonymous' };

    const response = await fetch('https://dir.chishmy.ru/users/me', {
        headers: getAuthHeaders()
    });
    console.log('User response status:', response.status);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка ${response.status}: ${errorText}`);
    }
    const { data } = await response.json();
    console.log('Full user data:', JSON.stringify(data, null, 2));

    let roleName = 'anonymous';
    if (data.role) {
        // Если role — строка (ID), запрашиваем имя роли
        const roleResponse = await fetch(`https://dir.chishmy.ru/roles/${data.role}`, {
            headers: getAuthHeaders()
        });
        console.log('Role response status:', roleResponse.status);
        if (roleResponse.ok) {
            const roleData = await roleResponse.json();
            roleName = roleData.data.name || 'anonymous';
        }
    }
    return { role: roleName, id: data.id };
}

export async function getCatalog() {
    console.log('Fetching catalog with headers:', getAuthHeaders());
    const response = await fetch(`${API_URL}?fields=id,pagetitle,parent_id,slug`, {
        headers: getAuthHeaders()
    });
    console.log('Catalog response status:', response.status);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка ${response.status}: ${errorText}`);
    }
    const { data } = await response.json();
    console.log('Catalog data:', data);
    return data;
}
// Остальной код без изменений

// Остальной код без изменений
// Остальной код без изменений




export async function getItemBySlug(slug) {
    const response = await fetch(`${API_URL}?filter[slug][_eq]=${slug}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка ${response.status}: ${errorText}`);
    }
    const { data } = await response.json();
    return data[0] || null;
}

export async function getGalleryImages(galleryIds) {
    if (!galleryIds || galleryIds.length === 0) return [];

    const galleryResponse = await fetch(`${GALLERY_URL}?filter[id][_in]=${galleryIds.join(',')}`, {
        headers: getAuthHeaders()
    });
    if (!galleryResponse.ok) {
        const errorText = await galleryResponse.text();
        throw new Error(`Ошибка ${galleryResponse.status}: ${errorText}`);
    }
    const { data: galleryData } = await galleryResponse.json();

    const imageIds = galleryData
        .filter(item => item.image)
        .map(item => ({
            url: `${ASSETS_BASE_URL}${item.image}`,
            alt: item.alt || 'Изображение'
        }));

    const filesIds = galleryData
        .filter(item => item.files && item.files.length > 0)
        .flatMap(item => item.files);

    let filesImages = [];
    if (filesIds.length > 0) {
        const filesResponse = await fetch(`${GALLERY_FILES_URL}?filter[id][_in]=${filesIds.join(',')}`, {
            headers: getAuthHeaders()
        });
        if (!filesResponse.ok) {
            const errorText = await filesResponse.text();
            throw new Error(`Ошибка ${filesResponse.status}: ${errorText}`);
        }
        const { data: filesData } = await filesResponse.json();
        filesImages = filesData.map(file => ({
            url: `${ASSETS_BASE_URL}${file.directus_files_id}`,
            alt: galleryData.find(g => g.files.includes(file.id))?.alt || 'Изображение'
        }));
    }

    return [...imageIds, ...filesImages].filter(image => image.url);
}

export async function createItem(collection, itemData) {
    const response = await fetch(`http://121.127.37.57:8055/items/${collection}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(itemData)
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка ${response.status}: ${errorText}`);
    }
    const { data } = await response.json();
    return data;
}