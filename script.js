window.onload = () => {
  // --- Preloader ---
  const preloader = document.getElementById("preloader");
  document.body.classList.remove("opacity-0");
  preloader.classList.add("hidden");

  // --- Initialize AOS ---
  AOS.init({
    duration: 800,
    once: true,
    offset: 50,
  });

  // --- GSAP Hero Animation ---
  const heroTitle = document.getElementById("hero-title");
  if (heroTitle) {
    const chars = heroTitle.textContent.split("");
    heroTitle.innerHTML = chars
      .map(
        (char) =>
          `<span class="g-char">${char === " " ? "&nbsp;" : char}</span>`
      )
      .join("");

    const tl = gsap.timeline();
    tl.to("#hero-image", {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power3.out",
    })
      .to(
        ".g-char",
        {
          visibility: "visible",
          y: 0,
          stagger: 0.03,
          ease: "back.out(1.7)",
        },
        "-=0.5"
      )
      .to(
        "#hero-subtitle",
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.4"
      )
      .to(
        "#hero-socials",
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      )
      .to(
        "#hero-github-btn-container",
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      );
  }

  // --- 3D Skills Sphere Logic ---
  function startTagCanvas() {
    const canvas = document.getElementById("skills-canvas");
    const container = document.getElementById("skills-canvas-container");
    if (!canvas || !container) return;

    const size = Math.min(container.offsetWidth, 500);
    canvas.width = size;
    canvas.height = size;

    try {
      TagCanvas.Start("skills-canvas", "tags", {
        imageMode: "image",
        imageScale: 1.0,
        outlineColour: "transparent",
        reverse: true,
        depth: 0.8,
        maxSpeed: 0.05,
        wheelZoom: false,
        initial: [0.05, -0.01],
        bgColour: null,
        noSelect: true,
        textFont: null,
        pinchZoom: true,
      });
    } catch (e) {
      console.error("TagCanvas failed to start:", e);
      container.style.display = "none";
    }
  }
  startTagCanvas();

  // --- Theme Toggler ---
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = themeToggle.querySelector(".fa-sun");
  const moonIcon = themeToggle.querySelector(".fa-moon");
  const htmlEl = document.documentElement;

  function applyTheme(theme) {
    if (theme === "light") {
      htmlEl.classList.remove("dark");
      htmlEl.classList.add("light");
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
    } else {
      htmlEl.classList.remove("light");
      htmlEl.classList.add("dark");
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
    }
    localStorage.setItem("theme", theme);
    setTimeout(() => {
      try {
        TagCanvas.Reload("skills-canvas");
      } catch (e) {}
      initParticles();
    }, 100);
  }

  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const isCurrentlyDark = htmlEl.classList.contains("dark");
    applyTheme(isCurrentlyDark ? "light" : "dark");
  });

  // --- Dynamic Navbar on Scroll ---
  window.addEventListener("scroll", () => {
    document.body.classList.toggle("scrolled", window.scrollY > 50);
  });

  // --- Typewriter Effect ---
  const typewriterTextEl = document.getElementById("typewriter-text");
  if (typewriterTextEl) {
    const phrases = [
      "modern web applications.",
      "scalable backend systems.",
      "beautiful user interfaces.",
      "innovative tech solutions.",
    ];
    let phraseIndex = 0,
      charIndex = 0,
      isDeleting = false;
    function type() {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        typewriterTextEl.textContent = currentPhrase.substring(0, charIndex--);
      } else {
        typewriterTextEl.textContent = currentPhrase.substring(0, charIndex++);
      }
      let typeSpeed = isDeleting ? 75 : 150;
      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
      }
      setTimeout(type, typeSpeed);
    }
    type();
  }

  // --- GitHub Repo Fetching & Modal Logic ---
  const githubModal = document.getElementById("github-modal");
  const openGitHubBtn = document.getElementById("open-github-modal-btn");
  const closeGitHubBtn = document.getElementById("close-github-modal-btn");
  let hasFetchedRepos = false;

  async function fetchGitHubRepos() {
    if (hasFetchedRepos) return;

    const username = "arghya45-dev";
    const grid = document.getElementById("github-repos-grid");
    const loader = document.getElementById("github-loader");
    loader.style.display = "block";

    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=pushed&per_page=9`
      );
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      const repos = await response.json();

      loader.style.display = "none";
      hasFetchedRepos = true;

      repos.forEach((repo) => {
        const card = document.createElement("div");
        card.className = "repo-card p-6 rounded-lg shadow-lg flex flex-col";
        card.setAttribute("data-aos", "fade-up");

        const link = document.createElement("a");
        link.href = repo.html_url;
        link.target = "_blank";
        link.innerHTML = `
                            <div class="flex items-center mb-4">
                                <i class="far fa-folder-open text-2xl mr-3" style="color: var(--primary-color);"></i>
                                <h3 class="text-xl font-bold truncate">${
                                  repo.name
                                }</h3>
                            </div>
                            <p class="text-sm mb-4 flex-grow" style="color: var(--text-color);">${
                              repo.description || "No description available."
                            }</p>
                            <div class="flex items-center text-sm mt-auto" style="color: var(--text-color);">
                                ${
                                  repo.language
                                    ? `<span class="flex items-center mr-4"><i class="fas fa-circle mr-1 text-xs" style="color: ${getLanguageColor(
                                        repo.language
                                      )};"></i> ${repo.language}</span>`
                                    : ""
                                }
                                <span class="flex items-center mr-4"><i class="far fa-star mr-1"></i> ${
                                  repo.stargazers_count
                                }</span>
                                <span class="flex items-center"><i class="fas fa-code-branch mr-1"></i> ${
                                  repo.forks_count
                                }</span>
                            </div>
                        `;
        card.appendChild(link);
        grid.appendChild(card);
      });
    } catch (error) {
      console.error("Failed to fetch GitHub repos:", error);
      loader.innerHTML =
        "<p>Could not fetch GitHub projects. Please try again later.</p>";
    }
  }

  function openGitHubModal() {
    githubModal.classList.remove("hidden");
    githubModal.classList.add("flex");
    fetchGitHubRepos();
  }

  function closeGitHubModal() {
    githubModal.classList.add("hidden");
    githubModal.classList.remove("flex");
  }

  openGitHubBtn.addEventListener("click", openGitHubModal);
  closeGitHubBtn.addEventListener("click", closeGitHubModal);
  githubModal.addEventListener("click", (e) => {
    if (e.target === githubModal) {
      closeGitHubModal();
    }
  });

  function getLanguageColor(language) {
    const colors = {
      JavaScript: "#f1e05a",
      Python: "#3572A5",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Java: "#b07219",
      "C++": "#f34b7d",
      TypeScript: "#2b7489",
      Shell: "#89e051",
      C: "#555555",
      Ruby: "#701516",
      Go: "#00ADD8",
      PHP: "#4F5D95",
      default: "#cccccc",
    };
    return colors[language] || colors["default"];
  }

  // --- Enhanced Contact Form Logic ---
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(event.target);
      try {
        const response = await fetch(event.target.action, {
          method: form.method,
          body: data,
          headers: { Accept: "application/json" },
        });
        if (response.ok) {
          formStatus.textContent = "Thanks for your submission!";
          formStatus.style.color = "green";
          form.reset();
        } else {
          const data = await response.json();
          formStatus.textContent =
            data.errors?.map((e) => e.message).join(", ") ||
            "Oops! There was a problem.";
          formStatus.style.color = "red";
        }
      } catch (error) {
        formStatus.textContent =
          "Oops! There was a problem submitting your form";
        formStatus.style.color = "red";
      }
    });
  }

  // --- Mobile Menu Logic ---
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const closeMobileMenuBtn = document.getElementById("close-mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  function openMobileMenu() {
    if (mobileMenu) {
      mobileMenu.classList.remove("hidden");
      mobileMenu.classList.add("flex");
    }
  }

  function closeMobileMenu() {
    if (mobileMenu) {
      mobileMenu.classList.add("hidden");
      mobileMenu.classList.remove("flex");
    }
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", openMobileMenu);
  if (closeMobileMenuBtn)
    closeMobileMenuBtn.addEventListener("click", closeMobileMenu);
  mobileLinks.forEach((link) =>
    link.addEventListener("click", closeMobileMenu)
  );

  // --- Video Modal Logic ---
  const videoModal = document.getElementById("video-modal");
  const modalVideo = document.getElementById("modal-video");
  const closeVideoModalBtn = document.getElementById("close-video-modal-btn");
  const openModalBtns = document.querySelectorAll(".open-modal-btn");
  const closeModalVideo = () => {
    videoModal.classList.add("hidden");
    modalVideo.pause();
    modalVideo.src = "";
  };
  openModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const videoSrc = btn.getAttribute("data-video-src");
      if (videoSrc && videoSrc !== "#") {
        modalVideo.src = videoSrc;
        videoModal.classList.remove("hidden");
        videoModal.classList.add("flex");
      }
    });
  });
  if (closeVideoModalBtn)
    closeVideoModalBtn.addEventListener("click", closeModalVideo);
  if (videoModal)
    videoModal.addEventListener(
      "click",
      (e) => e.target === videoModal && closeModalVideo()
    );

  // --- Footer Year ---
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Particles.js Initialization ---
  function initParticles() {
    const isDark = document.documentElement.classList.contains("dark");
    const particleColor = isDark ? "#60a5fa" : "#3b82f6";
    const linkColor = isDark ? "#60a5fa" : "#3b82f6";

    particlesJS("particles-js", {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: particleColor },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: linkColor,
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 1 } },
          push: { particles_nb: 4 },
        },
      },
      retina_detect: true,
    });
  }
  initParticles();
};
