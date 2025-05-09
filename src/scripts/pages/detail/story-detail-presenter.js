export default class StoryDetailPresenter {
    #storyId;
    #model;
    #view;
    #dbModel;

    constructor(storyId, { model, view, dbModel }) {
        this.#storyId = storyId;
        this.#model = model;
        this.#view = view;
        this.#dbModel = dbModel;
    }

    async getStoryDetail() {
        const story = await this.#model.getStoryById(this.#storyId);
        this.#view.showStory(story);

        // Call method to handle save/remove button after fetching story details
        await this.showSaveButton();
    }

    async saveStory() {
        try {
            const story = await this.#model.getStoryById(this.#storyId);
            await this.#dbModel.putStory(story);
            this.#view.saveToBookmarkSuccessfully('Success to save to bookmark');

            // After saving, update the button to show remove button
            this.showSaveButton();
        } catch (error) {
            console.error('saveStory: error:', error);
            this.#view.saveToBookmarkFailed(error.message);
        }
    }

    async removeStory() {
        try {
            await this.#dbModel.deleteStory(this.#storyId);
            this.#view.removeFromBookmarkSuccessfully('Successfully removed from bookmarks');

            // After removing, update the button to show save button
            this.showSaveButton();
        } catch (error) {
            console.error('removeStory: error:', error);
            this.#view.removeFromBookmarkFailed(error.message);
        }
    }

    async showSaveButton() {
        const isStorySaved = await this.#isStorySaved();

        if (isStorySaved) {
            this.#view.renderRemoveButton();
            return;
        }
        this.#view.renderSaveButton();
    }

    async #isStorySaved() {
        try {
            const savedStory = await this.#dbModel.getStoryById(this.#storyId);
            return !!savedStory; // Returns true if story exists in the database
        } catch (error) {
            console.error('Error checking if story is saved:', error);
            return false;
        }
    }
}