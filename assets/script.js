document.addEventListener("DOMContentLoaded", () => {
  console.log("Dokumen berhasil dimuat.");

  // =======================================================
  // Fitur 3: Muat Sidebar Secara Dinamis
  // =======================================================
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
  
  // =======================================================
  // BARU: Fitur 4: Muat Blok Dukungan Secara Dinamis
  // =======================================================
  const supportPlaceholder = document.getElementById("support-block-placeholder");

  if (supportPlaceholder) {
      // Path '../assets/support-block.html'
      fetch("../assets/support-block.html")
        .then((response) => response.text())
        .then((html) => {
            supportPlaceholder.innerHTML = html;
        })
        .catch((error) => console.error("Gagal memuat blok dukungan:", error));
  }


  // =======================================================
  // Fungsi untuk menandai link sidebar yang aktif
  // =======================================================
  function setupActiveLink() {
    const currentURL = window.location.href;
    // Cari link di dalam placeholder yang sudah dimuat
    const sidebarLinks = sidebarPlaceholder.querySelectorAll("nav.sidebar a"); 
    
    sidebarLinks.forEach((link) => {
      if (link.href === currentURL) {
        link.classList.add("active");
      }
    });
  }
  

  // =======================================================
  // Fitur 1: Toggle Dark/Light Mode
  // =======================================================
  function setupThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    if (themeToggle) {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        body.classList.add("dark-mode");
        themeToggle.textContent = "Mode Terang";
      } else {
        body.classList.remove("dark-mode");
        themeToggle.textContent = "Mode Gelap";
      }

      themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        if (body.classList.contains("dark-mode")) {
          localStorage.setItem("theme", "dark");
          themeToggle.textContent = "Mode Terang";
        } else {
          localStorage.setItem("theme", "light");
          themeToggle.textContent = "Mode Gelap";
        }
      });
    }
  }

  // =======================================================
  // Fitur 2: Toggle Sidebar (Minimize)
  // =======================================================
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
});