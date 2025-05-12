import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    exp: number;
    [key: string]: any;
}

export const isTokenExpired = (token: string | undefined): boolean => {
    if (!token) return true;

    try {
        const decoded = jwtDecode(token) as DecodedToken;
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch {
        return true;
    }
};

export const refreshAccessToken = async (refreshToken: string): Promise<string | null> => {
    try {
        const response = await fetch('https://ecotonicserp.pythonanywhere.com/api/auth/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            throw new Error('Token refresh failed');
        }

        const data = await response.json();
        const oneDay = 24 * 60 * 60;
        document.cookie = `token=${data.access}; path=/; max-age=${oneDay}`;
        
        return data.access;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
};
