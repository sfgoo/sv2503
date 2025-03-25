const API_URL = 'https://dir.chishmy.ru/items/items';
const GALLERY_URL = 'https://dir.chishmy.ru/items/gallery';
const GALLERY_FILES_URL = 'https://dir.chishmy.ru/items/gallery_files';
const ASSETS_BASE_URL = 'https://dir.chishmy.ru/assets/';
const USERS_ME_URL = 'https://dir.chishmy.ru/users/me';
const ROLES_URL = 'https://dir.chishmy.ru/roles';

function getAuthHeaders() {
    if (typeof window === 'undefined') return { 'Accept': 'application/json' };
    const token = localStorage.getItem('directus_token');
    return token ? {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
    } : {};
}

export async function getCurrentUser() {
    if (typeof window === 'undefined') return { role: 'anonymous' };

    const token = localStorage.getItem('directus_token');
    if (!token) return { role: 'anonymous' };

    try {
        const response = await fetch(USERS_ME_URL, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            localStorage.removeItem('directus_token');
            return { role: 'anonymous' };
        }

        const { data } = await response.json();
        let roleName = 'anonymous';

        if (data.role) {
            const roleResponse = await fetch(`${ROLES_URL}/${data.role}`, {
                headers: getAuthHeaders()
            });
            if (roleResponse.ok) {
                const roleData = await roleResponse.json();
                roleName = roleData.data.name || 'anonymous';
            }
        }

        return {
            role: roleName,
            id: data.id,
            email: data.email
        };
    } catch (error) {
        console.error('Ошибка получения пользователя:', error);
        return { role: 'anonymous' };
    }
}

export async function getCatalog() {
    try {
        const response = await fetch(`${API_URL}?fields=id,pagetitle,parent_id,slug`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}: ${await response.text()}`);
        }

        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка загрузки каталога:', error);
        return [];
    }
}

export async function getItemBySlug(slug) {
    try {
        const response = await fetch(`${API_URL}?filter[slug][_eq]=${slug}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}: ${await response.text()}`);
        }

        const { data } = await response.json();
        return data[0] || null;
    } catch (error) {
        console.error('Ошибка загрузки элемента:', error);
        return null;
    }
}

export async function getGalleryImages(galleryIds) {
    if (!galleryIds || galleryIds.length === 0) return [];

    try {
        // Загрузка основной галереи
        const galleryResponse = await fetch(
          `${GALLERY_URL}?filter[id][_in]=${galleryIds.join(',')}`,
          { headers: getAuthHeaders() }
        );

        if (!galleryResponse.ok) {
            throw new Error(`Ошибка галереи: ${await galleryResponse.text()}`);
        }

        const { data: galleryData } = await galleryResponse.json();

        // Обработка изображений
        const images = galleryData
          .filter(item => item.image)
          .map(item => ({
              url: `${ASSETS_BASE_URL}${item.image}`,
              alt: item.alt || 'Изображение'
          }));

        // Обработка файлов
        const fileIds = galleryData
          .flatMap(item => item.files || []);

        let files = [];
        if (fileIds.length > 0) {
            const filesResponse = await fetch(
              `${GALLERY_FILES_URL}?filter[id][_in]=${fileIds.join(',')}`,
              { headers: getAuthHeaders() }
            );

            if (filesResponse.ok) {
                const { data: filesData } = await filesResponse.json();
                files = filesData.map(file => ({
                    url: `${ASSETS_BASE_URL}${file.directus_files_id}`,
                    alt: file.title || 'Файл'
                }));
            }
        }

        return [...images, ...files];
    } catch (error) {
        console.error('Ошибка загрузки галереи:', error);
        return [];
    }
}

export async function createItem(collection, itemData) {
    try {
        const response = await fetch(`http://121.127.37.57:8055/items/${collection}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(itemData)
        });

        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}: ${await response.text()}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка создания элемента:', error);
        throw error;
    }
}
