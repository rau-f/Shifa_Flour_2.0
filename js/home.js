// home.js - UPDATED VERSION
// REMOVE ALL theme toggle and mobile menu code (already handled by components-loader.js)

// Scroll Reveal Animation
const revealElements = document.querySelectorAll(".reveal");

const revealOnScroll = () => {
  revealElements.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight - 100) {
      el.classList.add("visible");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);

// BMI Calculator
const bmiForm = document.getElementById("bmiForm");
if (bmiForm) {
  const bmiValue = document.getElementById("bmiValue");
  const bmiCategory = document.getElementById("bmiCategory");

  bmiForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const weight = parseFloat(document.getElementById("weightInput").value);
    const height = parseFloat(document.getElementById("heightInput").value) / 100;

    if (weight && height) {
      const bmi = (weight / (height * height)).toFixed(1);
      bmiValue.textContent = bmi;

      let category;
      if (bmi < 18.5) category = "کم وزن";
      else if (bmi < 25) category = "نارمل";
      else if (bmi < 30) category = "زیادہ وزن";
      else category = "موٹاپا";

      bmiCategory.textContent = category;
    }
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Language Toggle - Wait for components to load
function setupLanguageToggle() {
  const langToggle = document.getElementById("langToggle");
  if (!langToggle) return;

  let currentLang = localStorage.getItem("lang") || "ur";

  function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    langToggle.textContent = lang === "ur" ? "EN" : "UR";
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";

    // Special font handling for English mode
    if (lang === "en") {
      document.body.classList.add("font-english-mode");
    } else {
      document.body.classList.remove("font-english-mode");
    }

    // Update all translatable elements
    document.querySelectorAll("[data-ur]").forEach((el) => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        if (el.children.length === 0) {
          el.textContent = text;
        } else {
          for (let node of el.childNodes) {
            if (node.nodeType === 3 && node.nodeValue.trim() !== "") {
              node.nodeValue = " " + text;
              break;
            }
          }
        }
      }
    });
  }

  langToggle.addEventListener("click", () => {
    updateLanguage(currentLang === "ur" ? "en" : "ur");
  });

  // Initialize Language
  updateLanguage(currentLang);
}

// Wait for components to load before setting up language toggle
document.addEventListener('componentsLoaded', () => {
  setupLanguageToggle();
  revealOnScroll(); // Run reveal once components are loaded
});

// Also try to set up language toggle immediately if components are already loaded
if (document.readyState === 'complete') {
  setupLanguageToggle();
}