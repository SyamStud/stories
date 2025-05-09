import Stories from '../../data/api.js';
import { generateStoryItemTemplate } from '../../templates.js';
import HomePresenter from './home-presenter.js';

export default class HomePage {
  #presenter;

  async render() {
    return `
          <section class="home-section">
            <h1 class="content-title" style="view-transition-name: title">Story of Students</h1>
            
            <div id="stories" class="stories-container" >
              <div class="loader"></div>
            </div>
          </section>
        `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      model: Stories,
      view: this,
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