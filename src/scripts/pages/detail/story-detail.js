import Stories from '../../data/api.js';
import { parseActivePathname } from '../../routes/url-parser.js';
import {
    generateStoryDetailTemplate,
    initMap,
    generateSavestoryButtonTemplate,
    generateRemovestoryButtonTemplate
} from '../../templates.js';
import StoryDetailPresenter from './story-detail-presenter.js';
import Database from '../../data/database';

export default class StoryDetailPage {
    #presenter;
    #storyDetailElement = null;

    async render() {
        return `
        <section id="story-detail" style="min-height: 100vh;">
            <div class="loading">Loading story details...</div>
        </section>
      `;
    }

    async afterRender() {
        this.#storyDetailElement = document.getElementById('story-detail');
        const { id } = parseActivePathname();

        this.#presenter = new StoryDetailPresenter(id, {
            model: Stories,
            view: this,
            dbModel: Database,
        });

        await this.#presenter.getStoryDetail();
    }

    showStory(story) {
        if (!this.#storyDetailElement) {
            this.#storyDetailElement = document.getElementById('story-detail');
        }

        const html = generateStoryDetailTemplate(story);
        this.#storyDetailElement.innerHTML = html;

        if (story.lat && story.lon) {
            try {
                initMap(story.lat, story.lon, story.name);
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        } else {
            const mapContainer = document.getElementById('map');
            mapContainer.innerText = 'Pengguna tidak membagikan lokasi';
        }
    }

    renderSaveButton() {
        const container = document.getElementById('save-actions-container');
        if (!container) {
            console.error('Save actions container not found');
            return;
        }

        container.innerHTML = generateSavestoryButtonTemplate();

        const saveButton = document.getElementById('story-detail-save');
        if (saveButton) {
            // Remove any existing event listeners first to prevent duplicates
            const newSaveButton = saveButton.cloneNode(true);
            saveButton.parentNode.replaceChild(newSaveButton, saveButton);

            newSaveButton.addEventListener('click', async () => {
                await this.#presenter.saveStory();
            });
        }
    }

    renderRemoveButton() {
        const container = document.getElementById('save-actions-container');
        if (!container) {
            console.error('Save actions container not found');
            return;
        }

        container.innerHTML = generateRemovestoryButtonTemplate();

        const removeButton = document.getElementById('story-detail-remove');
        if (removeButton) {
            // Remove any existing event listeners first to prevent duplicates
            const newRemoveButton = removeButton.cloneNode(true);
            removeButton.parentNode.replaceChild(newRemoveButton, removeButton);

            newRemoveButton.addEventListener('click', async () => {
                await this.#presenter.removeStory();
            });
        }
    }

    saveToBookmarkSuccessfully(message) {
        console.log(message);
        // Optionally show a toast notification to the user
    }

    saveToBookmarkFailed(message) {
        alert(message);
    }

    removeFromBookmarkSuccessfully(message) {
        console.log(message);
        // Optionally show a toast notification to the user
    }

    removeFromBookmarkFailed(message) {
        alert(message);
    }

    showError(message) {
        if (!this.#storyDetailElement) {
            this.#storyDetailElement = document.getElementById('story-detail');
        }

        this.#storyDetailElement.innerHTML = `
            <div class="error">
                <p>Error: ${message}</p>
                <button id="retry-button">Retry</button>
            </div>
        `;

        document.getElementById('retry-button')?.addEventListener('click', () => {
            this.#presenter.getStoryDetail();
        });
    }
}