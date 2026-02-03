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
    const feet = parseFloat(document.getElementById("heightFeet").value);
    const inches = parseFloat(document.getElementById("heightInches").value);

    // Convert height to meters: ((feet * 12) + inches) * 0.0254
    const heightInMeters = ((feet * 12) + inches) * 0.0254;

    if (weight && heightInMeters > 0) {
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      bmiValue.textContent = bmi;

      let categoryUr = "";
      let categoryEn = "";
      
      if (bmi < 18.5) {
          categoryUr = "کم وزن";
          categoryEn = "Underweight";
      } else if (bmi < 25) {
          categoryUr = "نارمل";
          categoryEn = "Normal";
      } else if (bmi < 30) {
          categoryUr = "زیادہ وزن";
          categoryEn = "Overweight";
      } else {
          categoryUr = "موٹاپا";
          categoryEn = "Obese";
      }

      bmiCategory.setAttribute('data-ur', categoryUr);
      bmiCategory.setAttribute('data-en', categoryEn);
      
      const currentLang = document.documentElement.lang || 'ur';
      bmiCategory.textContent = currentLang === 'ur' ? categoryUr : categoryEn;
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
// Listen for language changes to update BMI calculator if present
document.addEventListener('languageChanged', (e) => {
    const lang = e.detail.language;
    const bmiCategory = document.getElementById("bmiCategory");
    
    if (bmiCategory && bmiCategory.hasAttribute(`data-${lang}`)) {
         const text = bmiCategory.getAttribute(`data-${lang}`);
         bmiCategory.textContent = text;
    }
});