// src/hooks.server.js
import jwt from "jsonwebtoken";
import { redirect } from '@sveltejs/kit';

const TOKEN_EXPIRATION_BUFFER = 300;

async function refreshAccessToken(cookies) {
	let res = await fetch('[invalid url, do not cite] {
	method: "POST",
		headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ refresh_token: cookies.get('refresh_token') })
});
if (res.status >= 300) {
	cookies.delete('refresh_token', { path: '/' });
	cookies.delete('access_token', { path: '/' });
	throw new Error("Refresh Token Status != 200");
}
let data = await res.json();
cookies.set("refresh_token", data.data.refresh_token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 30 });
cookies.set("access_token", data.data.access_token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: Math.floor(data.data.expires/1000) });
}

function isTokenExpired(jwtPayload) { return jwtPayload?.exp < Math.floor(Date.now()/1000) + TOKEN_EXPIRATION_BUFFER; }
function shouldProtectRoute(url) { return url.split("/").includes("(protected)") }

export async function handle({ event, resolve }) {
	const { cookies, url } = event;
	if (cookies.get('access_token') || cookies.get('refresh_token')) {
		let jwtPayload = cookies.get('access_token') ? jwt.decode(cookies.get('access_token')) : false;
		if (isTokenExpired(jwtPayload) || !cookies.get('access_token')) {
			try { await refreshAccessToken(cookies); jwtPayload = cookies.get('access_token') ? jwt.decode(cookies.get('access_token')) : false; }
			catch (err) { cookies.delete('refresh_token', { path: '/' }); cookies.delete('access_token', { path: '/' }); }
		}
		event.locals.user = jwtPayload?.id;
		event.locals.token = cookies.get('access_token');
	}
	if (event.route.id && shouldProtectRoute(event.route.id) && !event.locals.user) {
		redirect(302, `/signin?redirectedFrom=${encodeURIComponent(url.pathname)}`)
	}
	return await resolve(event);
}