document.addEventListener("DOMContentLoaded", () => {
  console.log("Dokumen berhasil dimuat.");

  // =======================================================
  // LOGIKA HALAMAN MATERI (Sidebar, Navigasi Halaman, dll.)
  // =======================================================
  
  // Cek apakah kita di halaman materi (punya placeholder)
  const isMateriPage = document.getElementById("sidebar-placeholder");

  if (isMateriPage) {
    loadSidebar();
    loadSupportBlock();
    setupPageNavigation();
    setupSidebarToggle();
  }

  // =======================================================
  // LOGIKA HOMEPAGE (Animasi dari Claude)
  // =======================================================
  
  // Cek apakah kita di homepage (punya body class)
  const isHomepage = document.body.classList.contains("homepage-body");

  if (isHomepage) {
    // 1. Setup Parallax (hanya di homepage/level)
    setupParallax();
    
    // 2. Setup Animasi Scroll (hanya di homepage/level)
    setupScrollObserver();

    // 3. Panggil tombol tema untuk homepage (floating)
    setupThemeToggle("theme-toggle-floating");
  }

  // =======================================================
  // LOGIKA GLOBAL (Berjalan di SEMUA Halaman)
  // =======================================================
  setupRippleEffect();
  setupImageZoom();

  // =======================================================
  // DEFINISI FUNGSI
  // =======================================================

  /**
   * Memuat sidebar.html ke dalam placeholder
   */
  function loadSidebar() {
    const sidebarPlaceholder = document.getElementById("sidebar-placeholder");
    if (!sidebarPlaceholder) return;

    fetch("../assets/sidebar.html")
      .then((response) => response.text())
      .then((html) => {
        sidebarPlaceholder.innerHTML = html;
        setupActiveLink();
        // Panggil setup tema untuk tombol di DALAM sidebar
        setupThemeToggle("theme-toggle-sidebar");
      })
      .catch((error) => console.error("Gagal memuat sidebar:", error));
  }

  /**
   * Memuat support-block.html ke dalam placeholder
   */
  function loadSupportBlock() {
    const supportPlaceholder = document.getElementById(
      "support-block-placeholder"
    );
    if (!supportPlaceholder) return;

    fetch("../assets/support-block.html")
      .then((response) => response.text())
      .then((html) => {
        supportPlaceholder.innerHTML = html;
        // Terapkan ripple ke tombol yang baru dimuat
        setupRippleEffect();
      })
      .catch((error) =>
        console.error("Gagal memuat blok dukungan:", error)
      );
  }

  /**
   * Membuat navigasi Halaman (Prev/Next) secara dinamis
   */
  function setupPageNavigation() {
    const navPlaceholder = document.getElementById("page-nav-placeholder");
    if (!navPlaceholder) return;

    const prevUrl = navPlaceholder.dataset.prevUrl;
    const prevTitle = navPlaceholder.dataset.prevTitle;
    const nextUrl = navPlaceholder.dataset.nextUrl;
    const nextTitle = navPlaceholder.dataset.nextTitle;

    let html = "";
    html += '<nav class="page-navigation" aria-label="Navigasi Materi">';

    if (prevUrl && prevTitle) {
      html += `
        <a href="${prevUrl}" class="prev-page ripple-effect">
          &larr; ${prevTitle}
        </a>`;
    }

    if (nextUrl && nextTitle) {
      html += `
        <a href="${nextUrl}" class="next-page ripple-effect">
          ${nextTitle} &rarr;
        </a>`;
    }

    html += "</nav>";
    navPlaceholder.innerHTML = html;
    setupRippleEffect(); // Terapkan ripple ke link nav
  }

  /**
   * Menandai link sidebar yang aktif
   */
  function setupActiveLink() {
    const sidebarPlaceholder = document.getElementById("sidebar-placeholder");
    if (!sidebarPlaceholder) return;
    const sidebarLinks = sidebarPlaceholder.querySelectorAll("nav.sidebar a");
    sidebarLinks.forEach((link) => {
      if (window.location.pathname.endsWith(link.getAttribute("href"))) {
        link.classList.add("active");
      }
    });
  }

  /**
   * Mengatur tombol minimize sidebar
   */
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

  /**
   * Mengatur Tombol Tema (Logika dari Claude, dimodifikasi)
   * Ini akan mencari ID tombol dan mengaturnya.
   */
  function setupThemeToggle(buttonId) {
    const themeToggle = document.getElementById(buttonId);
    const body = document.body;
    if (!themeToggle) return; // Berhenti jika tombol tidak ada di halaman ini

    // 1. Isi tombol dengan SVG
    themeToggle.innerHTML = `
      <span class="sun-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      </span>
      <span class="moon-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      </span>
    `;

    // 2. Atur status awal saat halaman dimuat
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      body.classList.add("dark-mode");
    }

    // 3. Tambahkan event listener untuk klik
    themeToggle.addEventListener("click", (e) => {
      body.classList.toggle("dark-mode");
      if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
      // Tambahkan efek ripple manual (dari Claude)
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      themeToggle.appendChild(ripple);
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }

  /**
   * Efek Parallax (dari Claude, sedikit dimodifikasi)
   */
  function setupParallax() {
    document.addEventListener("mousemove", (e) => {
      // Cek jika pengguna lebih suka mengurangi gerakan
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const cards = document.querySelectorAll(".card");
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      cards.forEach((card, index) => {
        const offsetX = (x - 0.5) * 10 * (index % 2 === 0 ? 1 : -1);
        const offsetY = (y - 0.5) * 10;
        
        // Cek jika kartu sedang di-hover, jangan terapkan parallax Y
        const isHovering = card.matches(":hover");
        const scale = isHovering ? 1.02 : 1;
        const finalOffsetY = isHovering ? -10 : offsetY;

        card.style.transform = `translateY(${finalOffsetY}px) translateX(${offsetX}px) scale(${scale})`;
      });
    });
  }

  /**
   * Efek Animasi saat Scroll (dari Claude)
   */
  function setupScrollObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Ganti style ini agar sesuai dengan keyframes 'fadeInUp'
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    // Amati semua kartu di halaman (termasuk level-1 dan level-2)
    document.querySelectorAll(".card").forEach((card) => {
      // Atur style awal untuk animasi (jika tidak diatur oleh CSS keyframe)
      if (!card.classList.contains('animate-slide-in-left') && !card.classList.contains('animate-slide-in-right')) {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        observer.observe(card);
      }
    });
  }

  /**
   * Efek Ripple (Global)
   */
  function setupRippleEffect() {
    // Style untuk ripple
    const rippleStyle = `
      .ripple-effect {
        position: relative;
        overflow: hidden;
      }
      .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.4);
        width: 100px; /* Ukuran default */
        height: 100px; /* Ukuran default */
        transform: scale(0);
        animation: ripple-anim 0.6s ease-out;
        /* Posisikan dari tengah (bukan kiri atas) */
        margin-left: -50px;
        margin-top: -50px;
        pointer-events: none;
      }
      @keyframes ripple-anim {
        from {
          transform: scale(0);
          opacity: 1;
        }
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    // Tambahkan style ke <head>
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = rippleStyle;
    document.head.appendChild(styleSheet);

    // Terapkan listener
    document
      .querySelectorAll(
        ".support-button, .card, .page-navigation a, .back-to-home"
      )
      .forEach((el) => {
        el.classList.add("ripple-effect");
        el.addEventListener("click", function (e) {
          if (!this.classList.contains("ripple-effect")) return;

          const rect = this.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const ripple = document.createElement("span");
          ripple.classList.add("ripple");
          ripple.style.left = `${x}px`;
          ripple.style.top = `${y}px`;

          ripple.addEventListener("animationend", () => {
            ripple.remove();
          });
          
          this.appendChild(ripple);
        });
      });
  }

  function setupImageZoom() {
    // 1. Buat elemen Modal secara dinamis (hanya sekali)
    const modalHTML = `
      <div id="lightbox-modal" class="lightbox-modal">
        <span class="lightbox-close">&times;</span>
        <img class="lightbox-content" id="lightbox-img">
        <div id="lightbox-caption" class="lightbox-caption"></div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Ambil referensi elemen
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const captionText = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');

    // 2. Tambahkan event listener ke SEMUA gambar di dalam artikel
    // Kita targetkan gambar di dalam .image-wrapper agar logo/icon tidak ikut kena
    const images = document.querySelectorAll('.image-wrapper img');

    images.forEach(img => {
      img.addEventListener('click', function() {
        modal.classList.add('active');
        modalImg.src = this.src;
        // Ambil caption dari alt text atau elemen caption di bawahnya
        const caption = this.nextElementSibling ? this.nextElementSibling.innerText : this.alt;
        captionText.innerText = caption || "";
      });
    });

    // 3. Logika Menutup Modal
    // Tutup saat tombol X diklik
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    // Tutup saat area gelap di luar gambar diklik
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    // Tutup saat tombol ESC ditekan
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
      }
    });
  }
});

