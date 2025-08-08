document.addEventListener("DOMContentLoaded", () => {
  // --- Initialize AOS ---
  AOS.init({
    duration: 800,
    once: true,
    offset: 50,
  });

  // --- Theme Toggler ---
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = themeToggle.querySelector(".fa-sun");
  const moonIcon = themeToggle.querySelector(".fa-moon");
  const htmlEl = document.documentElement;

  const savedTheme = localStorage.getItem("theme") || "dark";
  htmlEl.classList.add(savedTheme);
  if (savedTheme === "light") {
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
  } else {
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
  }

  themeToggle.addEventListener("click", () => {
    const isCurrentlyDark = htmlEl.classList.contains("dark");
    if (isCurrentlyDark) {
      htmlEl.classList.remove("dark");
      htmlEl.classList.add("light");
      localStorage.setItem("theme", "light");
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
    } else {
      htmlEl.classList.remove("light");
      htmlEl.classList.add("dark");
      localStorage.setItem("theme", "dark");
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
    }
    TagCanvas.Delete("skills-canvas");
    startTagCanvas();
  });

  // --- Dynamic Navbar on Scroll ---
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      document.body.classList.add("scrolled");
    } else {
      document.body.classList.remove("scrolled");
    }
  });

  // --- Typewriter Effect ---
  const typewriterTextEl = document.getElementById("typewriter-text");
  const phrases = [
    "modern web applications.",
    "scalable backend systems.",
    "beautiful user interfaces.",
    "innovative tech solutions.",
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      typewriterTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 150;

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

  // --- 3D Skills Sphere Logic ---
  function startTagCanvas() {
    const canvas = document.getElementById("skills-canvas");
    const container = document.getElementById("skills-canvas-container");

    // Make canvas responsive
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
      });
    } catch (e) {
      console.error("TagCanvas failed to start:", e);
      container.style.display = "none";
    }
  }
  startTagCanvas();

  // --- Enhanced Contact Form Logic ---
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          formStatus.textContent = "Thanks for your submission!";
          formStatus.style.color = "green";
          form.reset();
        } else {
          response.json().then((data) => {
            if (Object.hasOwn(data, "errors")) {
              formStatus.textContent = data["errors"]
                .map((error) => error["message"])
                .join(", ");
            } else {
              formStatus.textContent =
                "Oops! There was a problem submitting your form";
            }
            formStatus.style.color = "red";
          });
        }
      })
      .catch((error) => {
        formStatus.textContent =
          "Oops! There was a problem submitting your form";
        formStatus.style.color = "red";
      });
  }
  form.addEventListener("submit", handleSubmit);

  // --- Mobile Menu Logic ---
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const closeMobileMenuBtn = document.getElementById("close-mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("hidden");
    mobileMenu.classList.add("flex");
  });

  const closeMenu = () => {
    mobileMenu.classList.add("hidden");
    mobileMenu.classList.remove("flex");
  };

  closeMobileMenuBtn.addEventListener("click", closeMenu);
  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // --- Video Modal Logic ---
  const videoModal = document.getElementById("video-modal");
  const modalVideo = document.getElementById("modal-video");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const openModalBtns = document.querySelectorAll(".open-modal-btn");

  openModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const videoSrc = btn.getAttribute("data-video-src");
      modalVideo.src = videoSrc;
      videoModal.classList.remove("hidden");
      videoModal.classList.add("flex");
    });
  });

  const closeModalVideo = () => {
    videoModal.classList.add("hidden");
    videoModal.classList.remove("flex");
    modalVideo.pause();
    modalVideo.src = ""; // Unload the video
  };

  closeModalBtn.addEventListener("click", closeModalVideo);
  videoModal.addEventListener("click", (e) => {
    if (e.target === videoModal) {
      closeModalVideo();
    }
  });

  // --- Footer Year ---
  document.getElementById("year").textContent = new Date().getFullYear();
});
