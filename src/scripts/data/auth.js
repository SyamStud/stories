import CONFIG from '../config';

const ENDPOINTS = {
    REGISTER: `${CONFIG.BASE_URL}/register`,
    LOGIN: `${CONFIG.BASE_URL}/login`,
};

class Auth {
    static async register({ name, email, password }) {
        try {
            const response = await fetch(ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const responseJson = await response.json();

            if (responseJson.error) {
                throw new Error(responseJson.message);
            }

            return responseJson;
        } catch (error) {
            throw new Error(error.message || 'Terjadi kesalahan saat mendaftar');
        }
    }

    static async login({ email, password }) {
        try {
            const response = await fetch(ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const responseJson = await response.json();

            if (responseJson.error) {
                throw new Error(responseJson.message);
            }

            this.setAuthToken(responseJson.loginResult.token);

            return responseJson;
        } catch (error) {
            throw new Error(error.message || 'Terjadi kesalahan saat login');
        }
    }

    static logout() {
        localStorage.removeItem(CONFIG.AUTH_TOKEN_KEY);

        window.location.href = '#/login';
    }

    static setAuthToken(token) {
        localStorage.setItem(CONFIG.AUTH_TOKEN_KEY, token);
    }

    static getAuthToken() {
        return localStorage.getItem(CONFIG.AUTH_TOKEN_KEY) || null;
    }

    static isLoggedIn() {
        return !!this.getAuthToken();
    }
}

export default Auth;