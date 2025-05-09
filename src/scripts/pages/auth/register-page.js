import RegisterPresenter from './register-presenter.js';
import Auth from '../../data/auth.js';

export default class RegisterPage {
  #presenter;

  async render() {
    return `
      <section class="register-section">
        <h1 class="content-title" style="view-transition-name: title">Register</h1>
        
        <div class="form-container">
          <form id="register-form" class="auth-form">
            <div class="form-group">
              <label for="name">Nama</label>
              <input type="text" id="name" name="name" placeholder="Masukkan nama" required>
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Masukkan email" required>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Masukkan password" required>
            </div>
            
            <div class="form-actions">
              <button type="submit" id="register-button">Register</button>
            </div>
            
            <div class="form-link">
              <p>Sudah punya akun? <a href="#/login">Login</a></p>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      model: Auth,
      view: this,
    });

    this.#initializeElements();
    this.#initializeEventListeners();
  }

  #initializeElements() {
    this.registerForm = document.getElementById('register-form');
    this.nameInput = document.getElementById('name');
    this.emailInput = document.getElementById('email');
    this.passwordInput = document.getElementById('password');
    this.registerButton = document.getElementById('register-button');
  }

  #initializeEventListeners() {
    this.registerForm.addEventListener('submit', (event) => this.handleSubmit(event));
  }

  async handleSubmit(event) {
    event.preventDefault();

    this.registerButton.disabled = true;
    this.registerButton.textContent = 'Loading...';

    try {
      const registerData = {
        name: this.nameInput.value,
        email: this.emailInput.value,
        password: this.passwordInput.value,
      };

      await this.#presenter.register(registerData);

      window.location.hash = '#/login';
    } catch (error) {
      alert(error.message || 'Terjadi kesalahan saat registrasi. Silakan coba lagi.');
    } finally {
      this.registerButton.disabled = false;
      this.registerButton.textContent = 'Register';
    }
  }
}