export default class HomePresenter {
    #model;
    #view;

    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }

    async showStories() {
        const stories = await this.#model.getAllStories();
        this.#view.showStories(stories);
    }
}