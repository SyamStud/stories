export default class AddStoryPresenter {
    #model;
    #view;

    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }

    async addStory(storyData) {
        try {
            this.validateStoryData(storyData);

            await this.#model.addStory(storyData);

            return true;
        } catch (error) {
            console.error('Error adding story:', error);
            throw error;
        }
    }

    validateStoryData(storyData) {
        if (!storyData.photo) {
            throw new Error('Foto diperlukan');
        }

        if (!storyData.description || storyData.description.trim() === '') {
            throw new Error('Deskripsi cerita diperlukan');
        }

        return true;
    }
}