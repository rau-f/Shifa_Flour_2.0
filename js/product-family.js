// product-family.js - UPDATED VERSION
// Scroll Reveal only
const revealElements = document.querySelectorAll(".reveal");
const revealOnScroll = () => {
  revealElements.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100)
      el.classList.add("visible");
  });
};
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);