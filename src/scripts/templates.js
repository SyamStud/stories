import escapeHTML from ".";

export function generateStoryItemTemplate({ id, photoUrl, name, description, createdAt }) {
  const date = new Date(createdAt);

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);

  const shortDesc = description.length > 100
    ? `${escapeHTML(description.substring(0, 100))}...`
    : escapeHTML(description);

  return `
    <li class="stories-item" style="view-transition-name: story-item-${escapeHTML(id)}">
      <a href="#/story/${escapeHTML(id)}" class="stories-item-link" aria-labelledby="story-name-${escapeHTML(id)}" aria-describedby="story-desc-${escapeHTML(id)}">
        <figure class="stories-item-image-container">
          <img
            class="stories-item-image"
            src="${escapeHTML(photoUrl)}"
            alt="Foto kucing: ${escapeHTML(name)}"
            loading="lazy"
             style="view-transition-name: story-image-${escapeHTML(id)}"
          >
        </figure>

        <article class="stories-item-content">
          <h2 class="stories-item-title" id="story-name-${escapeHTML(id)}" style="view-transition-name: story-title-${escapeHTML(id)}">${escapeHTML(name)}</h2>
          <p class="stories-item-description" id="story-desc-${escapeHTML(id)}" style="view-transition-name: story-desc-${escapeHTML(id)}">${shortDesc}</p>
          <div class="stories-item-date" style="view-transition-name: story-date-${escapeHTML(id)}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
            </svg>
            <span>${formattedDate} pukul ${formattedTime}</span>
          </div>
        </article>
      </a>
    </li>
  `;
}


export function generateStoryDetailTemplate({ id, photoUrl, name, description, createdAt }) {
  const date = new Date(createdAt);
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
  const formattedTime = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);

  return `
    <section class="story-detail">
      <section style="margin-bottom: 15px;" class="story-detail__body__actions__container">
        <div class="story-detail__actions__buttons">
          <div id="save-actions-container"></div>
        </div>
      </section>

      <figure class="story-detail-image-container">
        <img
          class="story-detail-image"
          src="${escapeHTML(photoUrl)}"
          alt="Foto ${escapeHTML(name)}"
          style="view-transition-name: story-image"
        >
      </figure>
      
      <section class="stories-item-date" style="view-transition-name: story-date">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
        </svg>
        <span>${formattedDate} pukul ${formattedTime}</span>
      </section>

      <h1 class="story-detail-title" style="view-transition-name: story-title">${escapeHTML(name)}</h1>
      
      <section class="story-detail-description" style="view-transition-name: story-desc">
        <p>${escapeHTML(description)}</p>
      </section>

      <section>
        <h2 class="story-detail-location">Lokasi Pengguna</h2>
        <div id="map" style="height: 300px; border-radius: 8px;"></div>
      </section>

      
    </section>
  `;
}

export function initMap(lat, lon, name) {
  if (!lat || !lon) {
    const map = L.map('map').setView([-6.1753871, 106.8245779], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var popup = L.popup()
      .setLatLng([-6.1753871, 106.8245779])
      .setContent("Pengguna tidak membagikan lokasi")
      .openOn(map);
  } else {
    const map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var marker = L.marker([lat, lon]).addTo(map);

    marker.bindPopup(`<b>${name}</b> berada di sini`).openPopup();
  }
}

export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" class="btn subscribe-button" tabindex="0">
      Subscribe <i class="fas fa-bell"></i>
    </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" class="btn unsubscribe-button" tabindex="0">
      Unsubscribe <i class="fas fa-bell-slash"></i>
    </button>
  `;
}

export function generateSavestoryButtonTemplate() {
  return `
    <button id="story-detail-save" class="btn btn-transparent">
      Simpan cerita <i class="far fa-bookmark"></i>
    </button>
  `;
}

export function generateRemovestoryButtonTemplate() {
  return `
    <button id="story-detail-remove" class="btn btn-transparent">
      Buang cerita <i class="fas fa-bookmark"></i>
    </button>
  `;
}
