document.addEventListener("DOMContentLoaded", () => {
  console.log("Dokumen berhasil dimuat.");

  // =======================================================
  // FITUR-FITUR DIMUAT DI SINI
  // =======================================================
  
  // 1. Muat sidebar (jika ada)
  loadSidebar();
  
  // 2. Muat blok dukungan (jika ada)
  loadSupportBlock();
  
  // 3. (BARU) Buat navigasi halaman (jika ada)
  setupPageNavigation();
  
  // 4. Setup tombol minimize (jika ada)
  setupSidebarToggle();
  
  // 5. Setup tombol tema (dijalankan dari dalam loadSidebar atau di homepage)
  // (Tidak perlu dipanggil di sini, dipanggil oleh loadSidebar)
  
  // =======================================================
  // Definisi Fungsi
  // =======================================================

  function loadSidebar() {
    const sidebarPlaceholder = document.getElementById("sidebar-placeholder");

    if (sidebarPlaceholder) {
      fetch("../assets/sidebar.html")
        .then((response) => response.text())
        .then((html) => {
          sidebarPlaceholder.innerHTML = html;
          setupActiveLink();
          setupThemeToggle(); // Panggil setup tema SETELAH sidebar dimuat
        })
        .catch((error) => console.error("Gagal memuat sidebar:", error));
    } else {
      // Jika kita di homepage, panggil setup tema langsung
      setupThemeToggle();
    }
  }

  function loadSupportBlock() {
    const supportPlaceholder = document.getElementById("support-block-placeholder");

    if (supportPlaceholder) {
      fetch("../assets/support-block.html")
        .then((response) => response.text())
        .then((html) => {
          supportPlaceholder.innerHTML = html;
        })
        .catch((error) =>
          console.error("Gagal memuat blok dukungan:", error)
        );
    }
  }

  // =======================================================
  // BARU: Fitur 4: Membuat Navigasi Halaman (Prev/Next)
  // =======================================================
  function setupPageNavigation() {
    const navPlaceholder = document.getElementById("page-nav-placeholder");
    
    // Jika placeholder tidak ada di halaman ini, berhenti
    if (!navPlaceholder) return;

    // Baca data dari atribut data-* di placeholder HTML
    const prevUrl = navPlaceholder.dataset.prevUrl;
    const prevTitle = navPlaceholder.dataset.prevTitle;
    const nextUrl = navPlaceholder.dataset.nextUrl;
    const nextTitle = navPlaceholder.dataset.nextTitle;

    let html = '';

    // Membuat HTML (a11y: pakai <nav> dan aria-label)
    html += '<nav class="page-navigation" aria-label="Navigasi Materi">';

    if (prevUrl && prevTitle) {
      html += `
        <a href="${prevUrl}" class="prev-page">
          &larr; ${prevTitle}
        </a>`;
    }

    if (nextUrl && nextTitle) {
      html += `
        <a href="${nextUrl}" class="next-page">
          ${nextTitle} &rarr;
        </a>`;
    }

    html += '</nav>';

    // Masukkan HTML yang sudah jadi ke placeholder
    navPlaceholder.innerHTML = html;
  }
  // =======================================================
  // AKHIR FITUR BARU
  // =======================================================


  function setupActiveLink() {
    const currentURL = window.location.href;
    const sidebarPlaceholder = document.getElementById("sidebar-placeholder");
    if (!sidebarPlaceholder) return;

    const sidebarLinks = sidebarPlaceholder.querySelectorAll("nav.sidebar a");

    sidebarLinks.forEach((link) => {
      if (link.href === currentURL) {
        link.classList.add("active");
      }
    });
  }

  function setupThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    if (themeToggle) {
      const savedTheme = localStorage.getItem("theme");
      
      // Atur ikon saat halaman dimuat
      if (savedTheme === "dark") {
        body.classList.add("dark-mode");
        themeToggle.innerHTML = "☀️"; // Tampilkan ikon matahari di dark mode
      } else {
        body.classList.remove("dark-mode");
        themeToggle.innerHTML = "🌙"; // Tampilkan ikon bulan di light mode
      }

      // Tambahkan event listener untuk klik
      themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");

        // Atur ikon dan simpan preferensi saat diklik
        if (body.classList.contains("dark-mode")) {
          localStorage.setItem("theme", "dark");
          themeToggle.innerHTML = "☀️"; // Tampilkan ikon matahari
        } else {
          localStorage.setItem("theme", "light");
          themeToggle.innerHTML = "🌙"; // Tampilkan ikon bulan
        }
      });
    }
  }

  function setupSidebarToggle() {
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const container = document.querySelector(".container");

    if (sidebarToggle && container) {
      sidebarToggle.addEventListener("click", () => {
        container.classList.toggle("sidebar-collapsed");
        if (container.classList.contains("sidebar-collapsed")) {
          sidebarToggle.innerHTML = "&raquo;";
          sidebarToggle.title = "Buka Sidebar";
        } else {
          sidebarToggle.innerHTML = "&laquo;";
          sidebarToggle.title = "Tutup Sidebar";
        }
      });
    }
  }
});