// Load Header and Footer Fragments
async function loadFragments() {
  try {
    // Load Header
    const headerResponse = await fetch("fragments/header.html");
    const headerHTML = await headerResponse.text();
    document.getElementById("header").innerHTML = headerHTML;

    // Load Footer
    const footerResponse = await fetch("fragments/footer.html");
    const footerHTML = await footerResponse.text();
    document.getElementById("footer").innerHTML = footerHTML;

    // Initialize navigation after loading
    initializeNavigation();

    // Initialize back to top button with delay
    setTimeout(() => {
      initializeBackToTop();
    }, 100);
  } catch (error) {
    console.error("Error loading fragments:", error);
  }
}

// Initialize Navigation
function initializeNavigation() {
  const navToggle = document.getElementById("navToggle");
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  const mobileClose = document.getElementById("mobileClose");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      mobileMenuOverlay.classList.toggle("active");
      document.body.style.overflow = mobileMenuOverlay.classList.contains(
        "active"
      )
        ? "hidden"
        : "";
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener("click", () => {
      navToggle.classList.remove("active");
      mobileMenuOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // Close mobile menu when clicking on a link
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      mobileMenuOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Close mobile menu when clicking outside
  mobileMenuOverlay.addEventListener("click", (e) => {
    if (e.target === mobileMenuOverlay) {
      navToggle.classList.remove("active");
      mobileMenuOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

// Back to Top Button
function initializeBackToTop() {
  const backToTopBtn = document.getElementById("backToTop");

  if (backToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    });

    // Scroll to top when clicked
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

// Updated Preloader for Apple-style timing
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");

  // 3000ms matches the CSS animation 'appleProgress'
  setTimeout(() => {
    preloader.style.opacity = "0";
    preloader.style.transition = "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)";

    setTimeout(() => {
      preloader.style.display = "none";
    }, 800);
  }, 3200);
});

// Navbar Scroll Effect
const navbar = document.getElementById("navbar");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    navbar?.classList.add("scrolled");
  } else {
    navbar?.classList.remove("scrolled");
  }

  lastScroll = currentScroll;
});

// Smooth Scroll for Anchor Links
document.addEventListener("click", (e) => {
  const target = e.target.closest('a[href^="#"]');
  if (target) {
    e.preventDefault();
    const targetId = target.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  }
});

// Simple Scroll Animation with Intersection Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements with data-aos attribute - DISABLED per user request
function initializeScrollAnimations() {
  // Entrance animations removed for cleaner, faster feeling
}

// Contact Form Handling
function initializeContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;

      // Show loading state
      submitBtn.innerHTML = "<span>Sending...</span>";
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";

      // Simulate form submission (replace with actual form handling)
      setTimeout(() => {
        submitBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7 10L9 12L13 8M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Message Sent!</span>
                `;
        submitBtn.style.background =
          "linear-gradient(135deg, #10B981 0%, #059669 100%)";

        // Reset form
        setTimeout(() => {
          contactForm.reset();
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
          submitBtn.style.opacity = "1";
          submitBtn.style.background = "";
        }, 3000);
      }, 1500);
    });
  }
}

// Add parallax effect to hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const heroVisual = document.querySelector(".hero-visual");

  if (heroVisual) {
    heroVisual.style.transform = `translateY(${scrolled * 0.2}px)`;
  }
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const isNumber = !isNaN(target);

  if (!isNumber) return;

  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll(".stat-number");
        statNumbers.forEach((stat) => {
          const target = stat.textContent.trim();
          if (!isNaN(target)) {
            animateCounter(stat, parseInt(target));
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

// Initialize stats observer
function initializeStatsObserver() {
  const heroStats = document.querySelector(".hero-stats");
  if (heroStats) {
    statsObserver.observe(heroStats);
  }
}

// Add active state to navigation based on scroll position
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute("id");
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (
      navLink &&
      scrollY > sectionTop &&
      scrollY <= sectionTop + sectionHeight
    ) {
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.style.color = "";
      });
      navLink.style.color = "var(--color-primary)";
    }
  });
});

// Liquid text animation enhancement
function initializeLiquidText() {
  const liquidTexts = document.querySelectorAll(".liquid-text");
  liquidTexts.forEach((text) => {
    text.addEventListener("mouseenter", () => {
      text.style.animationDuration = "1.5s";
    });
    text.addEventListener("mouseleave", () => {
      text.style.animationDuration = "3s";
    });
  });
}

// Glass card hover effect enhancement
function initializeGlassCards() {
  const glassCards = document.querySelectorAll(".glass-card");
  glassCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}

// Initialize all functions when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadFragments();
  initializeScrollAnimations();
  initializeContactForm();
  initializeStatsObserver();
  initializeLiquidText();
  initializeGlassCards();
});

// Smooth page transitions
window.addEventListener("beforeunload", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.3s ease";
});

// Add custom cursor effect (optional enhancement)
const cursor = document.createElement("div");
cursor.className = "custom-cursor";
document.body.appendChild(cursor);

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

document.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
});

// Stripe Checkout Handler
function initiateStripeCheckout(planName, price) {
  /*
  // Define Stripe Payment Links implementation
  // IMPORTANT: Replace these placeholder URLs with your actual LIVE Stripe Payment Links from your Dashboard
  const paymentLinks = {
    // Format: 'Plan Name': 'https://buy.stripe.com/...'
    Consultation: "https://book.stripe.com/test_consultation", // Replace with real link
    "AI Training": "https://book.stripe.com/test_ai_training", // Replace with real link
    Starter: "https://book.stripe.com/test_starter", // Replace with real link
    Business: "https://book.stripe.com/test_business", // Replace with real link
    Enterprise:
      "mailto:khushaankgupta@gmail.com?subject=Enterprise%20Plan%20Inquiry", // Enterprise usually needs custom quote
  };

  const link = paymentLinks[planName];

  if (link) {
    if (link.startsWith("http")) {
      // For secure payment links, we simply redirect the user
      window.location.href = link;
    } else if (link.startsWith("mailto")) {
      window.location.href = link;
    }
  } else {
    // Fallback if link not found
    console.warn(`Payment link for ${planName} not configured.`);
    alert(
      `Checkout for ${planName} is currently being updated. Please contact support.`
    );
  }
  */

  // Redirect to contact form instead for now
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    const offsetTop = contactSection.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });

    // Optional: Pre-fill subject based on plan
    const subjectInput = document.getElementById("subject");
    if (subjectInput) {
      subjectInput.value = `Inquiry about ${planName} Plan`;
    }
  }
}
