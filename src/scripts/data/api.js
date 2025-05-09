import CONFIG from '../config';
import Auth from './auth';

const ENDPOINTS = {
  ENDPOINT: `${CONFIG.BASE_URL}/stories`,
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

const Stories = {
  async getAllStories() {
    const token = Auth.getAuthToken();
    if (!token) {
      throw new Error('Anda harus login terlebih dahulu');
    }

    const response = await fetch(`${ENDPOINTS.ENDPOINT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    const responseJson = (await response.json()).listStory || [];

    return responseJson;
  },

  async getStoryById(id) {
    const token = Auth.getAuthToken();
    if (!token) {
      throw new Error('Anda harus login terlebih dahulu');
    }

    const response = await fetch(`${ENDPOINTS.ENDPOINT}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    const responseJson = (await response.json()).story || [];

    return responseJson;
  },

  async addStory({ description, photo, lat, lon }) {
    try {
      const token = Auth.getAuthToken();
      if (!token) {
        throw new Error('Anda harus login terlebih dahulu');
      }

      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photo);

      if (lat !== undefined && lat !== null) {
        formData.append('lat', lat);
      }
      if (lon !== undefined && lon !== null) {
        formData.append('lon', lon);
      }

      const response = await fetch(`${ENDPOINTS.ENDPOINT}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      });

      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  
};

export default Stories;


export async function subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
  const accessToken = Auth.getAuthToken();
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function unsubscribePushNotification({ endpoint }) {
  const accessToken = Auth.getAuthToken();
  const data = JSON.stringify({ endpoint });

  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
