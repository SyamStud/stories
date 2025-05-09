export default class RegisterPresenter {
    #model;
    #view;

    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }

    async register(registerData) {
        try {
            this.validateRegisterData(registerData);

            const response = await this.#model.register({
                name: registerData.name,
                email: registerData.email,
                password: registerData.password,
            });

            return response;
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    }

    validateRegisterData(registerData) {
        if (!registerData.name || !registerData.name.trim()) {
            throw new Error('Nama harus diisi');
        }

        if (!registerData.email || !registerData.email.trim()) {
            throw new Error('Email harus diisi');
        }

        if (!registerData.password || registerData.password.trim() === '') {
            throw new Error('Password harus diisi');
        }

        if (registerData.password.length < 8) {
            throw new Error('Password minimal 8 karakter');
        }

        return true;
    }
}