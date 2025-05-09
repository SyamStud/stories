import { openDB } from 'idb';

const DATABASE_NAME = 'story-app';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'saved-stories';

let dbPromise;

const initDatabase = async () => {
    if (!dbPromise) {
        dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
            upgrade(database) {
                if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
                    database.createObjectStore(OBJECT_STORE_NAME, {
                        keyPath: 'id',
                    });
                }
            },
        });
    }
    return dbPromise;
};

const Database = {
    async putStory(story) {
        if (!Object.hasOwn(story, 'id')) {
            throw new Error('`id` is required to save.');
        }

        const db = await initDatabase();
        return db.put(OBJECT_STORE_NAME, story);
    },

    async getStoryById(id) {
        if (!id) {
            throw new Error('`id` is required.');
        }

        const db = await initDatabase();
        return db.get(OBJECT_STORE_NAME, id);
    },

    async getAllStories() {
        const db = await initDatabase();
        return db.getAll(OBJECT_STORE_NAME);
    },

    async deleteStory(id) {
        if (!id) {
            throw new Error('`id` is required to delete.');
        }

        const db = await initDatabase();
        return db.delete(OBJECT_STORE_NAME, id);
    }
};

export default Database;