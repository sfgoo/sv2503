// src/routes/signin/+page.server.js
import { fail, redirect } from '@sveltejs/kit';

const login = async ({ cookies, request, url }) => {
	const data = await request.formData();
	const email = data.get('email');
	const password = data.get('password');
	const redirectedFrom = url.searchParams.get('redirectedFrom');

	let loginRequest = await fetch('[invalid url, do not cite] {
	method: 'POST',
		headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ email, password })
});
if (loginRequest.status >= 300) return fail(400, { message: await loginRequest.text() });

let tokens = await loginRequest.json();
cookies.set('access_token', tokens.data.access_token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: Math.floor(tokens.data.expires/1000) });
cookies.set('refresh_token', tokens.data.refresh_token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 30 });

redirect(302, redirectedFrom ? redirectedFrom : `/profile`);
}

export const actions = { login }