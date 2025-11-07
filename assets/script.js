document.addEventListener("DOMContentLoaded", () => {
  console.log("Dokumen berhasil dimuat.");

  // =======================================================
  // FITUR-FITUR DIMUAT DI SINI
  // =======================================================

  // Jalankan fungsi-fungsi ini HANYA jika placeholder-nya ada
  // (Ini tidak akan berjalan di homepage, yang mana itu bagus)
  loadSidebar();
  loadSupportBlock();
  setupPageNavigation();
  setupSidebarToggle();
  
  // Tombol tema ini ada di SEMUA halaman (termasuk homepage)
  setupThemeToggle();

  // =======================================================
  // Definisi Fungsi
  // =======================================================

  function loadSidebar() {
    const sidebarPlaceholder = document.getElementById("sidebar-placeholder");
    if (!sidebarPlaceholder) return; // Berhenti jika tidak ada placeholder

    // Path relatif dari folder 'materi-X'
    fetch("../assets/sidebar.html")
      .then((response) => response.text())
      .then((html) => {
        sidebarPlaceholder.innerHTML = html;
        setupActiveLink();
        // Setup tombol tema sidebar SETELAH dimuat
        setupThemeToggle(false); // 'false' berarti ini bukan tombol floating
      })
      .catch((error) => console.error("Gagal memuat sidebar:", error));
  }

  function loadSupportBlock() {
    const supportPlaceholder = document.getElementById(
      "support-block-placeholder"
    );
    if (!supportPlaceholder) return; // Berhenti jika tidak ada placeholder

    // Path relatif dari folder 'materi-X'
    fetch("../assets/support-block.html")
      .then((response) => response.text())
      .then((html) => {
        supportPlaceholder.innerHTML = html;
      })
      .catch((error) =>
        console.error("Gagal memuat blok dukungan:", error)
      );
  }

  function setupPageNavigation() {
    const navPlaceholder = document.getElementById("page-nav-placeholder");
    if (!navPlaceholder) return; // Berhenti jika tidak ada placeholder

    const prevUrl = navPlaceholder.dataset.prevUrl;
    const prevTitle = navPlaceholder.dataset.prevTitle;
    const nextUrl = navPlaceholder.dataset.nextUrl;
    const nextTitle = navPlaceholder.dataset.nextTitle;

    let html = "";
    html += '<nav class="page-navigation" aria-label="Navigasi Materi">';

    // Path sekarang sederhana, tanpa prefix
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

    html += "</nav>";
    navPlaceholder.innerHTML = html;
  }

  function setupActiveLink() {
    const sidebarPlaceholder = document.getElementById("sidebar-placeholder");
    if (!sidebarPlaceholder) return;

    const sidebarLinks = sidebarPlaceholder.querySelectorAll("nav.sidebar a");

    sidebarLinks.forEach((link) => {
      // Cek jika path link berakhir dengan path halaman saat ini
      // Ini lebih robust daripada '=='
      if (
        window.location.pathname.endsWith(link.getAttribute("href"))
      ) {
        link.classList.add("active");
      }
    });
  }

  function setupThemeToggle(isFloating = true) {
    // Tombol di sidebar punya ID 'theme-toggle'
    // Tombol di homepage punya ID 'theme-toggle-floating'
    // Kita cari keduanya
    const themeToggle =
      document.getElementById("theme-toggle") ||
      document.getElementById("theme-toggle-floating");
      
    const body = document.body;

    if (themeToggle) {
      const savedTheme = localStorage.getItem("theme");

      if (savedTheme === "dark") {
        body.classList.add("dark-mode");
        themeToggle.innerHTML = "☀️";
      } else {
        body.classList.remove("dark-mode");
        themeToggle.innerHTML = "🌙";
      }

      themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {
          localStorage.setItem("theme", "dark");
          themeToggle.innerHTML = "☀️";
        } else {
          localStorage.setItem("theme", "light");
          themeToggle.innerHTML = "🌙";
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
  
  // Panggil setup tombol tema homepage secara eksplisit
  setupThemeToggle(true);

});