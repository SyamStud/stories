import Stories from '../../data/api.js';
import { generateStoryItemTemplate } from '../../templates.js';
import BookmarkPresenter from './bookmark-presenter.js';
import Database from '../../data/database';

export default class BookmarkPage {
    #presenter;

    async render() {
        return `
          <section style="min-height: 100vh;" class="bookmark-section">
            <h1 class="content-title" style="view-transition-name: title">Cerita Tersimpan</h1>
            
            <div id="stories" class="stories-container" >
              <div class="loader"></div>
            </div>
          </section>
        `;
    }

    async afterRender() {
        this.#presenter = new BookmarkPresenter({
            view: this,
            model: Database,
        });

        await this.#presenter.showStories();
    }

    showStories(stories) {
        const html = stories.reduce(
            (accumulator, currentValue) => accumulator.concat(generateStoryItemTemplate(currentValue)),
            '',
        );

        document.getElementById('stories').innerHTML = `
          <ul class="stories-list">${html}</ul>
        `;
    }


}