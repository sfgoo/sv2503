// src/routes/register/+page.server.js
import { fail, redirect } from '@sveltejs/kit';
import { PUBLIC_APIURL } from '$env/static/public';

export const load = async ({ locals }) => {
	if (locals.token) redirect(302, '/profile');
	return {};
}

const register = async ({ cookies, request, url }) => {
	const data = await request.formData();
	const email = data.get('email');
	const password = data.get('password');
	const redirectedFrom = url.searchParams.get('redirectedFrom');

	let signupRequest = await fetch(`${PUBLIC_APIURL}/users/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'user-agent': request.headers.get("user-agent") },
		body: JSON.stringify({ email, password })
	});
	if (signupRequest.status >= 300) return fail(400, { message: await signupRequest.text() });

	let loginRequest = await fetch(`${PUBLIC_APIURL}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'user-agent': request.headers.get("user-agent") },
		body: JSON.stringify({ email, password })
	});
	if (loginRequest.status >= 300) return fail(400, { message: await loginRequest.text() });

	let tokens = await loginRequest.json();
	cookies.set('access_token', tokens.data.access_token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: Math.floor(tokens.data.expires/1000) });
	cookies.set('refresh_token', tokens.data.refresh_token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 30 });

	redirect(302, redirectedFrom ? redirectedFrom : `/profile`);
}

export const actions = { register }