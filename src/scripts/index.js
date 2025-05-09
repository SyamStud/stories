// CSS imports
import '../styles/styles.css';
import Auth from './data/auth';

import App from './pages/app';
import Camera from './utils/camera';
import { registerServiceWorker } from './utils';
import { isCurrentPushSubscriptionAvailable } from './utils/notification-helper';

const updateNavigation = async () => {
  const loginButton = document.querySelector('#login-link');
  const logoutButton = document.querySelector('#logout-link');
  const homeButton = document.querySelector('#home-link');
  const addStoryButton = document.querySelector('#add-story-link');
  const bookmarkButton = document.querySelector('#bookmark-link');
  const isSubscribed = await isCurrentPushSubscriptionAvailable();
  const pushNotificationTools = document.getElementById('push-notification-tools');

  try {
    if (navigator.serviceWorker.controller) {
      console.log('Push notification subscription status:', isSubscribed);
    }
  } catch (error) {
    console.error('Error checking push notification status:', error);
  }

  if (Auth.isLoggedIn()) {
    loginButton.classList.add('hidden');
    logoutButton.classList.remove('hidden');
    homeButton.classList.remove('hidden');
    addStoryButton.classList.remove('hidden');
    bookmarkButton.classList.remove('hidden');
  } else {
    loginButton.classList.remove('hidden');
    logoutButton.classList.add('hidden');
    homeButton.classList.add('hidden');
    addStoryButton.classList.add('hidden');
    bookmarkButton.classList.add('hidden');

    if (pushNotificationTools) {
      pushNotificationTools.innerHTML = '';
    }
  }
};

const checkAuthAndRedirect = () => {
  const protectedRoutes = ['#/', '#/add-story'];

  const currentRoute = window.location.hash || '#/';

  if (protectedRoutes.includes(currentRoute) && !Auth.isLoggedIn()) {
    alert('You need to login first.');
    window.location.hash = '#/login';
    return false;
  }

  if (currentRoute === '#/login' && Auth.isLoggedIn()) {
    console.log('User already logged in. Redirecting to home.');
    window.location.hash = '#/';
    return false;
  }

  return true;
};

document.addEventListener('DOMContentLoaded', async () => {
  await registerServiceWorker();

  updateNavigation();
  checkAuthAndRedirect();

  const app = new App({
    content: document.querySelector('#content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
    loginButton: document.querySelector('#login-link'),
    logoutButton: document.querySelector('#logout-link'),
    subscribeButton: document.querySelector('#subscribe-button'),
    unsubscribeButton: document.querySelector('#unsubscribe-button'),
  });

  const logoutButton = document.querySelector('#logout-link');

  logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    Auth.logout();
    updateNavigation();
    window.location.href = '#/login';
  });

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    updateNavigation();

    const routeAllowed = checkAuthAndRedirect();

    if (routeAllowed) {
      await app.renderPage();
    }

    Camera.stopAllStreams();
  });
});

export default function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}