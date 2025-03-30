// src/routes/api/auth/refresh.js
import jwt from 'jsonwebtoken';

export async function post({ request }) {
    try {
        const refreshToken = request.cookies.get('refreshToken');
        
        if (!refreshToken) {
            return new Response(JSON.stringify({ error: 'Refresh token missing' }), {
                status: 401
            });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return new Response(JSON.stringify({ accessToken: newAccessToken }), {
            status: 200,
            headers: {
                'Set-Cookie': `accessToken=${newAccessToken}; Path=/; HttpOnly; SameSite=Strict`
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid refresh token' }), {
            status: 401
        });
    }
}