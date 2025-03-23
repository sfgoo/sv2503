import { json } from '@sveltejs/kit';
import { createHmac, createHash } from 'crypto';

export async function POST({ request }) {
    console.log('Running telegram-auth server with ID: 789123456');
    const telegramData = await request.json();
    const { id, first_name, last_name, username, photo_url, auth_date, hash } = telegramData;
    console.log('Received Telegram data:', telegramData);

    const botToken = '8194887035:AAGkhsjzdgeqi6Y2l4v3h6cmayGaIRMlciY';
    const secretKey = createHash('sha256').update(botToken).digest();

    const payload = { id, auth_date, first_name, last_name, username, photo_url };
    const dataCheckString = Object.keys(payload)
        .filter(key => payload[key] !== undefined)
        .map(key => `${key}=${payload[key]}`)
        .sort()
        .join('\n');

    console.log('Data check string (raw):', JSON.stringify(dataCheckString));
    console.log('Data check string length:', dataCheckString.length);
    console.log('Data check string bytes before HMAC:', Buffer.from(dataCheckString, 'utf8').toString('hex'));
    const computedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    console.log('Computed hash:', computedHash);
    console.log('Received hash:', hash);

    if (computedHash !== hash) {
        console.error('Invalid Telegram hash:', { computedHash, hash });
        return json({ success: false, error: 'Неверный hash' }, { status: 401 });
    }

    const now = Math.floor(Date.now() / 1000);
    if (now - auth_date > 86400) {
        console.error('Telegram auth data expired:', { auth_date, now });
        return json({ success: false, error: 'Данные авторизации устарели' }, { status: 401 });
    }

    const directusUrl = 'https://dir.chishmy.ru';
    const telegramEmail = `${id}@telegram.com`;
    const password = 'telegram_default'; // Пароль хранится только в переменной
    let accessToken;

    try {
        console.log('Checking if user exists:', { email: telegramEmail });
        const checkUserResponse = await fetch(`${directusUrl}/users?filter[email][_eq]=${telegramEmail}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const checkUserData = await checkUserResponse.json();
        console.log('Check user response status:', checkUserResponse.status);
        console.log('Check user response body:', checkUserData);

        if (checkUserData.data && checkUserData.data.length > 0) {
            console.log('User exists, attempting login');
            const loginResponse = await fetch(`${directusUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: telegramEmail,
                    password
                })
            });

            console.log('Login response status:', loginResponse.status);
            const loginResponseText = await loginResponse.text();
            console.log('Login response body:', loginResponseText);
            if (!loginResponse.ok) {
                console.error('Login failed:', loginResponseText);
                return json({ success: false, error: `Ошибка входа: ${loginResponseText}` }, { status: 500 });
            }

            const { data } = JSON.parse(loginResponseText);
            accessToken = data.access_token;
            console.log('Telegram user logged in:', { id, accessToken });
        } else {
            console.log('Creating new user with:', {
                email: telegramEmail,
                first_name: first_name || username || 'Telegram User',
                role: '8b4c6865-eeef-412b-8c9e-1b2f02017413',
                password
            });
            const createUserResponse = await fetch(`${directusUrl}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: telegramEmail,
                    password, // Пробуем записать в password
                    first_name: first_name || username || 'Telegram User',
                    last_name: last_name || '',
                    role: '8b4c6865-eeef-412b-8c9e-1b2f02017413',
                    status: 'active',
                    provider: 'telegram',
                    external_identifier: id.toString()
                })
            });

            console.log('Create user response status:', createUserResponse.status);
            const createUserText = await createUserResponse.text();
            console.log('Create user response body:', createUserText);
            if (!createUserResponse.ok) {
                console.error('Failed to create user:', createUserText);
                return json({ success: false, error: `Ошибка создания пользователя: ${createUserText}` }, { status: 500 });
            }

            console.log('Logging in after user creation');
            const loginResponse = await fetch(`${directusUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: telegramEmail,
                    password // Используем ту же переменную
                })
            });

            console.log('Login response status:', loginResponse.status);
            const loginResponseText = await loginResponse.text();
            console.log('Login response body:', loginResponseText);
            if (!loginResponse.ok) {
                console.error('Login failed after creation:', loginResponseText);
                return json({ success: false, error: `Ошибка входа после создания: ${loginResponseText}` }, { status: 500 });
            }

            const { data } = JSON.parse(loginResponseText);
            accessToken = data.access_token;
            console.log('Telegram user created and logged in:', { id, accessToken });
        }

        try {
            const messageResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: id,
                    text: 'Добро пожаловать в наше приложение!'
                })
            });

            console.log('Send message response status:', messageResponse.status);
            if (!messageResponse.ok) {
                console.error('Failed to send Telegram message:', await messageResponse.text());
            } else {
                console.log('Welcome message sent to Telegram user:', id);
            }
        } catch (err) {
            console.error('Error sending Telegram message:', err);
        }

        return json({ success: true, access_token: accessToken });
    } catch (err) {
        console.error('Server error during Telegram auth:', err);
        return json({ success: false, error: 'Ошибка сервера' }, { status: 500 });
    }
}