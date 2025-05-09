import LoginPresenter from './login-presenter.js';
import Auth from '../../data/auth.js';

export default class LoginPage {
  #presenter;

  async render() {
    return `
      <section class="login-section">
        <h1 class="content-title" style="view-transition-name: title">Login</h1>
        
        <div class="form-container">
          <form id="login-form" class="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Masukkan email" required>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Masukkan password" required>
            </div>
            
            <div class="form-actions">
              <button type="submit" id="login-button">Login</button>
            </div>
            
            <div class="form-link">
              <p>Belum punya akun? <a href="#/register">Register</a></p>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      model: Auth,
      view: this,
    });

    this.#initializeElements();
    this.#initializeEventListeners();
  }

  #initializeElements() {
    this.loginForm = document.getElementById('login-form');
    this.emailInput = document.getElementById('email');
    this.passwordInput = document.getElementById('password');
    this.loginButton = document.getElementById('login-button');
  }

  #initializeEventListeners() {
    this.loginForm.addEventListener('submit', (event) => this.handleSubmit(event));
  }

  async handleSubmit(event) {
    event.preventDefault();

    this.loginButton.disabled = true;
    this.loginButton.textContent = 'Loading...';

    try {
      const loginData = {
        email: this.emailInput.value,
        password: this.passwordInput.value,
      };

      await this.#presenter.login(loginData);

      window.location.hash = '#/';
    } catch (error) {
      alert(error.message || 'Terjadi kesalahan saat login. Silakan coba lagi.');
    } finally {
      this.loginButton.disabled = false;
      this.loginButton.textContent = 'Login';
    }
  }
}