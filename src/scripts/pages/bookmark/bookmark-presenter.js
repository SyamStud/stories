export default class BookmarkPresenter {
    #model;
    #view;

    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }

    async showStories() {
        const stories = await this.#model.getAllStories();
        console.log('stories', stories);
        this.#view.showStories(stories);
    }
}