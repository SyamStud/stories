import Auth from '../data/auth';
import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import {
  generateSubscribeButtonTemplate,
  generateUnsubscribeButtonTemplate,
} from '../templates';

import {
  isServiceWorkerAvailable,
} from '../utils';

import { isCurrentPushSubscriptionAvailable, subscribe, unsubscribe } from '../utils/notification-helper';
import NotFound from './not-found';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      })
    });
  }

  async #setupPushNotification() {
    try {
      const pushNotificationTools = document.getElementById('push-notification-tools');
      if (!pushNotificationTools) {
        console.log('Push notification tools element not found');
        return;
      }

      const isSubscribed = await isCurrentPushSubscriptionAvailable();

      console.log(Auth.isLoggedIn());

      if (Auth.isLoggedIn()) {
        if (isSubscribed) {
          pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate();
          const unsubButton = document.getElementById('unsubscribe-button');
          if (unsubButton) {
            unsubButton.addEventListener('click', () => {
              unsubscribe().finally(() => {
                this.#setupPushNotification();
              });
            });
          }
          return;
        }

        pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();
        const subButton = document.getElementById('subscribe-button');
        if (subButton) {
          subButton.addEventListener('click', () => {
            subscribe().finally(() => {
              this.#setupPushNotification();
            });
            console.log('subscribe button clicked');
          });
        }
      }
    } catch (error) {
      console.error('Error setting up push notifications:', error);
    }
  }

  async renderPage() {
    window.scrollTo(0, 0);
    const routeName = getActiveRoute();
    const route = routes[routeName] || NotFound;

    const page = route();

    if (!document.startViewTransition) {
      this.#content.innerHTML = await page.render();
      await page.afterRender();

      if (isServiceWorkerAvailable()) {
        await this.#setupPushNotification();
      }
      return;
    }

    document.startViewTransition(async () => {
      this.#content.innerHTML = await page.render();
      await page.afterRender();

      if (isServiceWorkerAvailable()) {
        await this.#setupPushNotification();
      }
    });
  }
}

export default App;