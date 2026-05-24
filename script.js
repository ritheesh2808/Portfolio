const root = document.body;
const toggleButton = document.getElementById("themeToggle");
const themeLabel = toggleButton.querySelector(".theme-label");
const cursorGlow = document.getElementById("cursorGlow");
const reveals = document.querySelectorAll(".reveal");
const yearNode = document.getElementById("year");
const particleCanvas = document.getElementById("particleCanvas");
const scrollProgress = document.getElementById("scrollProgress");
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".site-nav a");
const dockLinks = document.querySelectorAll(".section-dock a");
const tiltCards = document.querySelectorAll(".tilt-card");
const magneticItems = document.querySelectorAll(".magnetic");

const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
root.setAttribute("data-theme", savedTheme);
themeLabel.textContent = savedTheme === "light" ? "Light" : "Dark";

toggleButton.addEventListener("click", () => {
  const currentTheme = root.getAttribute("data-theme");
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", nextTheme);
  localStorage.setItem("portfolio-theme", nextTheme);
  themeLabel.textContent = nextTheme === "light" ? "Light" : "Dark";
});

window.addEventListener("mousemove", (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
  root.style.setProperty("--mx", `${event.clientX}px`);
  root.style.setProperty("--my", `${event.clientY}px`);
});

window.addEventListener("mouseout", () => {
  cursorGlow.style.opacity = "0";
});

window.addEventListener("mouseover", () => {
  cursorGlow.style.opacity = "1";
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.12 }
);

reveals.forEach((item) => observer.observe(item));
reveals.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 40, 260)}ms`;
});

const setActiveSection = () => {
  const scrollTop = window.scrollY + window.innerHeight * 0.25;
  let activeId = "home";

  sections.forEach((section) => {
    if (scrollTop >= section.offsetTop) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const match = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("active", match);
  });

  dockLinks.forEach((link) => {
    const match = link.dataset.target === activeId || (activeId === "home" && link.dataset.target === "home");
    link.classList.toggle("active", match);
  });
};

const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  if (scrollProgress) {
    scrollProgress.style.width = `${percent}%`;
  }
  root.style.setProperty("--scrollY", `${window.scrollY}px`);
  setActiveSection();
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((y / rect.height) - 0.5) * -10;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

magneticItems.forEach((item) => {
  item.addEventListener("mousemove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
  });
  item.addEventListener("mouseleave", () => {
    item.style.transform = "";
  });
});

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (particleCanvas) {
  const ctx = particleCanvas.getContext("2d");
  const particles = [];
  const count = 55;

  const setCanvasSize = () => {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  };

  const createParticle = () => ({
    x: Math.random() * particleCanvas.width,
    y: Math.random() * particleCanvas.height,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    size: Math.random() * 1.8 + 0.4,
  });

  const initParticles = () => {
    particles.length = 0;
    for (let i = 0; i < count; i += 1) {
      particles.push(createParticle());
    }
  };

  const drawParticles = () => {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > particleCanvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > particleCanvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 212, 255, 0.55)";
      ctx.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 95) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(122, 140, 255, ${0.14 - dist / 900})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  };

  setCanvasSize();
  initParticles();
  drawParticles();
  window.addEventListener("resize", () => {
    setCanvasSize();
    initParticles();
  });
}
