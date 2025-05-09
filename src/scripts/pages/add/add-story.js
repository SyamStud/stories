import Stories from '../../data/api.js';
import Camera from '../../utils/camera.js';
import AddStoryPresenter from './add-story-presenter.js';

export default class AddStoryPage {
  #presenter;
  #locationObtained = false;
  #latitude = null;
  #longitude = null;
  #imageFile = null;
  #map = null;
  #marker = null;
  #mediaStream = null;

  async render() {
    return `
      <section style="min-height: 100vh;" class="add-story-section">
        <h1 class="content-title" style="view-transition-name: title">Tambah Cerita Baru</h1>
        
        <div class="add-story-container">
          <form id="add-story-form" class="add-story-form" type="multipart/form-data">
            <div class="form-group">
              <label for="location">Lokasi</label>
              <div class="location-container">
                <div class="location-input">
                  <input type="text" id="latitude" name="latitude" placeholder="Latitude" readonly>
                  <input type="text" id="longitude" name="longitude" placeholder="Longitude" readonly>
                </div>
                <div class="location-buttons">
                  <button type="button" id="show-map-btn" class="btn btn-map">
                    Pilih di Peta
                  </button>
                </div>
              </div>
            </div>
            
            <div id="map-container" class="map-container" style="display: none; height: 300px;"></div>
            
            <div class="form-group">
              <label for="photo">Foto</label>
              <div class="photo-upload-container">
                <div class="photo-buttons">
                  <input type="hidden" id="photo" name="photo" accept="image/*" class="photo-input">
                  <button type="button" id="camera-btn" class="btn btn-camera">
                    <i class="fas fa-camera"></i> Gunakan Kamera
                  </button>
                </div>
                <div id="camera-container" style="display: none; margin-top: 10px;">
                  <video id="camera-preview" style="width: 100%;" autoplay></video>
                  
                  <div class="camera-controls" style="margin-top: 10px;">
                    <button type="button" id="capture-photo" class="btn">Ambil Foto</button>
                    <button type="button" id="close-camera" class="btn">Tutup Kamera</button>
                  </div>
                </div>
                <canvas id="photo-canvas" style="display: none;"></canvas>
              </div>
            </div>
            
            <div class="form-group">
              <label for="description">Deskripsi Cerita</label>
              <textarea class="error" id="description" name="description" rows="6" placeholder="Ceritakan pengalamanmu" required></textarea>
            </div>
            
            <div class="form-actions">
              <button type="submit" id="submit-story">Kirim Cerita</button>
              <a href="#/" id="cancel-btn">Batal</a>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new AddStoryPresenter({
      model: Stories,
      view: this,
    });

    this.#initializeFormElements();
    this.#initializeEventListeners();
  }

  #initializeFormElements() {
    this.getLocationButton = document.getElementById('get-location-btn');
    this.showMapButton = document.getElementById('show-map-btn');
    this.mapContainer = document.getElementById('map-container');
    this.latitudeInput = document.getElementById('latitude');
    this.longitudeInput = document.getElementById('longitude');
    this.photoInput = document.getElementById('photo');
    this.cameraButton = document.getElementById('camera-btn');
    this.cameraContainer = document.getElementById('camera-container');
    this.cameraPreview = document.getElementById('camera-preview');
    this.capturePhotoButton = document.getElementById('capture-photo');
    this.closeCameraButton = document.getElementById('close-camera');
    this.photoCanvas = document.getElementById('photo-canvas');
    this.descriptionInput = document.getElementById('description');
    this.storyForm = document.getElementById('add-story-form');
  }

  #initializeEventListeners() {
    this.showMapButton.addEventListener('click', () => this.toggleMap());
    this.cameraButton.addEventListener('click', () => this.toggleCamera());
    this.capturePhotoButton.addEventListener('click', () => this.capturePhoto());
    this.closeCameraButton.addEventListener('click', () => this.closeCamera());
    this.storyForm.addEventListener('submit', (event) => this.handleSubmit(event));
  }

  toggleMap() {
    if (this.mapContainer.style.display === 'none') {
      this.mapContainer.style.display = 'block';
      this.#initializeMap();
    } else {
      this.mapContainer.style.display = 'none';
    }
  }

  #initializeMap() {
    this.#map = L.map('map-container').setView([-6.1753871, 106.8245779], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.#map);

    this.#map.on('click', (e) => {
      this.#updateMapMarker(e.latlng.lat, e.latlng.lng);
      this.#latitude = e.latlng.lat;
      this.#longitude = e.latlng.lng;
      this.#locationObtained = true;

      this.latitudeInput.value = this.#latitude;
      this.longitudeInput.value = this.#longitude;
    });
  }

  #updateMapMarker(lat, lng) {
    if (this.#marker) {
      this.#map.removeLayer(this.#marker);
    }

    this.#marker = L.marker([lat, lng]).addTo(this.#map);

    this.#map.setView([lat, lng], this.#map.getZoom());
  }

  toggleCamera() {
    if (this.cameraContainer.style.display === 'none') {
      this.openCamera();
    } else {
      this.closeCamera();
    }
  }

  async openCamera() {
    try {
      this.photoInput.value = '';
      this.#imageFile = null;

      this.#mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          aspectRatio: 16 / 9,
          width: 1280,
          height: 720,
        },
      });

      Camera.addNewStream(this.#mediaStream);

      this.cameraPreview.srcObject = this.#mediaStream;
      this.cameraContainer.style.display = 'block';
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Tidak dapat mengakses kamera');
    }
  }

  closeCamera() {
    if (this.#mediaStream) {
      this.#mediaStream.getTracks().forEach(track => track.stop());
      this.#mediaStream = null;
    }

    this.cameraPreview.srcObject = null;
    this.cameraContainer.style.display = 'none';
  }

  async capturePhoto() {
    const width = this.cameraPreview.videoWidth;
    const height = this.cameraPreview.videoHeight;

    this.photoCanvas.width = width;
    this.photoCanvas.height = height;

    const context = this.photoCanvas.getContext('2d');
    context.drawImage(this.cameraPreview, 0, 0, width, height);

    this.photoCanvas.style.display = 'block';

    this.photoCanvas.toBlob((blob) => {
      this.#imageFile = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
    });

    this.closeCamera();
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (!this.#validateForm()) {
      return;
    }

    const newStory = {
      lat: this.#latitude ?? null,
      lon: this.#longitude ?? null,
      description: this.descriptionInput.value,
      photo: this.#imageFile,
    };

    try {
      await this.#presenter.addStory(newStory);

      this.storyForm.reset();
      this.#latitude = null;
      this.#longitude = null;
      this.#locationObtained = false;
      this.#imageFile = null;
      this.latitudeInput.value = '';
      this.longitudeInput.value = '';

      window.location.hash = '#/';
    } catch (error) {
      alert(error.message);
    }
  }

  #validateForm() {
    let isValid = true;

    if (!this.#imageFile) {
      isValid = false;
    }

    if (!this.descriptionInput.value.trim()) {
      isValid = false;
    }

    return isValid;
  }
}