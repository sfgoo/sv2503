import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export async function POST({ cookies }) {
    try {
        // Verify JWT_REFRESH_SECRET is set
        if (!process.env.JWT_REFRESH_SECRET) {
            throw new Error('JWT_REFRESH_SECRET not configured');
        }

        const refreshToken = cookies.get('refreshToken');
        
        if (!refreshToken) {
            return json({ error: 'Refresh token missing' }, { status: 401 });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET || process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1h' }
        );

        return json({ 
            accessToken: newAccessToken 
        }, {
            status: 200,
            headers: {
                'Set-Cookie': `accessToken=${newAccessToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60}` // 1 hour
            }
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        return json({ 
            error: error.message || 'Invalid refresh token' 
        }, { 
            status: error.message.includes('not configured') ? 500 : 401 
        });
    }
}