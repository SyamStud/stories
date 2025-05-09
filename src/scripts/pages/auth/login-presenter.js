export default class LoginPresenter {
    #model;
    #view;

    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }

    async login(loginData) {
        try {
            this.validateLoginData(loginData);

            const response = await this.#model.login(loginData);

            return response;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

    validateLoginData(loginData) {
        if (!loginData.email || !loginData.email.trim()) {
            throw new Error('Email harus diisi');
        }

        if (!loginData.password || loginData.password.trim() === '') {
            throw new Error('Password harus diisi');
        }

        if (loginData.password.length < 8) {
            throw new Error('Password minimal 8 karakter');
        }

        return true;
    }
}