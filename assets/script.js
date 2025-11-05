document.addEventListener("DOMContentLoaded", () => {
  console.log("Dokumen berhasil dimuat.");

  // =======================================================
  // Fitur 1: Toggle Dark/Light Mode
  // =======================================================
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Cek jika tombolnya ada di halaman ini
  if (themeToggle) {
    // 1. Cek preferensi tema yang tersimpan
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      body.classList.add("dark-mode");
      themeToggle.textContent = "Mode Terang";
    } else {
      body.classList.remove("dark-mode");
      themeToggle.textContent = "Mode Gelap";
    }

    // 2. Tambahkan event listener
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode");

      // 3. Simpan preferensi baru
      if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "Mode Terang";
      } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "Mode Gelap";
      }
    });
  }

  // =======================================================
  // Fitur 2: Toggle Sidebar (Minimize)
  // =======================================================
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const container = document.querySelector(".container");

  // Cek jika tombolnya ada di halaman ini
  if (sidebarToggle && container) {
    sidebarToggle.addEventListener("click", () => {
      container.classList.toggle("sidebar-collapsed");

      // Ubah ikon tombol dan title-nya
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