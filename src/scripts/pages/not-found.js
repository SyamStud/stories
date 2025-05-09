const NotFound = {
    async render() {
        return `
      <section class="not-found">
        <div class="content">
          <h1>404</h1>
          <h2>Halaman Tidak Ditemukan</h2>
          <p>Maaf, halaman tidak ditemukan. URL mungkin salah atau halaman sudah tidak tersedia.</p>
          <a href="#/">
            Kembali ke Beranda
          </a>
        </div>
      </section>
    `;
    },
    async afterRender() {
        //
    },
};

export default () => NotFound;