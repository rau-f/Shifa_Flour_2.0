// components-loader.js - COMPLETE NEW VERSION
let componentsLoaded = false;
let componentsLoading = false;

// Load all components
function loadAllComponents() {
    if (componentsLoading) return;
    componentsLoading = true;
    
    // Create a promise that resolves when all components are loaded
    const promises = [];
    
    // Load navbar
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        promises.push(loadComponent('./components/navbar.html', navbarContainer));
    }
    
    // Load footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        promises.push(loadComponent('./components/footer.html', footerContainer));
    }
    
    // Wait for all components to load
    Promise.all(promises)
        .then(() => {
            componentsLoaded = true;
            componentsLoading = false;
            
            // Setup functionality that depends on components
            setupCommonFunctionality();
            
            // Dispatch event that components are loaded
            document.dispatchEvent(new CustomEvent('componentsLoaded'));
        })
        .catch(error => {
            console.error('Error loading components:', error);
            componentsLoading = false;
            // Setup basic functionality anyway
            setupCommonFunctionality();
            document.dispatchEvent(new CustomEvent('componentsLoaded'));
        });
}

// Load individual component
function loadComponent(url, container) {
    return fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${url}`);
            return response.text();
        })
        .then(html => {
            container.innerHTML = html;
            return true;
        })
        .catch(error => {
            console.error(`Error loading ${url}:`, error);
            // Show fallback content
            if (url.includes('navbar')) {
                container.innerHTML = `
                    <nav class="nav">
                        <div class="nav-inner glass">
                            <a href="index.html" class="nav-logo">
                                <img src="assets/logo/logo1.png" alt="Shifa">
                                <span data-ur="شفا فوڈز" data-en="Shifa Foods">شفا فوڈز</span>
                            </a>
                        </div>
                    </nav>
                `;
            }
            return false;
        });
}

// Setup common functionality
function setupCommonFunctionality() {
    // Theme toggle - setup for all pages
    setupThemeToggle();
    
    // Mobile menu - setup for all pages
    // Mobile menu - setup for all pages
    setupMobileMenu();
    
    // Language toggle - setup for all pages
    setupLanguageToggle();
}

// Theme toggle setup
function setupThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");
    const html = document.documentElement;

    if (!themeToggle) return;

    // Check saved preference
    if (localStorage.getItem("theme") === "dark") {
        html.classList.add("dark");
        const icon = themeToggle.querySelector("span");
        if (icon) icon.textContent = "light_mode";
    }

    themeToggle.addEventListener("click", () => {
        html.classList.toggle("dark");
        const isDark = html.classList.contains("dark");
        const icon = themeToggle.querySelector("span");
        if (icon) icon.textContent = isDark ? "light_mode" : "dark_mode";
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}

// Mobile menu setup
function setupMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const menuBackdrop = document.getElementById("menuBackdrop");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        mobileMenu.classList.toggle("open");
        document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
    });

    if (menuBackdrop) {
        menuBackdrop.addEventListener("click", () => {
            menuToggle.classList.remove("active");
            mobileMenu.classList.remove("open");
            document.body.style.overflow = "";
        });
    }

    mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
            menuToggle.classList.remove("active");
            mobileMenu.classList.remove("open");
            document.body.style.overflow = "";
        });
    });
}

// Start loading components when DOM is ready
// Start loading components when DOM is ready
// Helper for safe storage access
function getStorage(key, defaultValue) {
    try {
        return sessionStorage.getItem(key) || defaultValue;
    } catch (e) {
        console.warn("SessionStorage access denied or failed", e);
        return window._tempStorage ? window._tempStorage[key] : defaultValue;
    }
}

function setStorage(key, value) {
    try {
        sessionStorage.setItem(key, value);
    } catch (e) {
        console.warn("SessionStorage write failed", e);
        if (!window._tempStorage) window._tempStorage = {};
        window._tempStorage[key] = value;
    }
}

// Start loading components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadAllComponents();
    // Initialize language immediately if possible to reduce flash
    const savedLang = getStorage("lang", "ur");
    if (document.documentElement.lang !== savedLang) {
        document.documentElement.lang = savedLang;
        document.documentElement.dir = savedLang === "ur" ? "rtl" : "ltr";
        if (savedLang === "en") document.body.classList.add("font-english-mode");
    }
});

// Language Toggle Setup
function setupLanguageToggle() {
    // We use event delegation because the navbar is loaded dynamically
    // and sometimes the event listener might not attach correctly if timing is off.
    document.addEventListener("click", (e) => {
        const toggleBtn = e.target.closest("#langToggle");
        if (toggleBtn) {
            const currentLang = getStorage("lang", "ur");
            const newLang = currentLang === "ur" ? "en" : "ur";
            updateLanguage(newLang);
        }
    });

    let currentLang = getStorage("lang", "ur");

    function updateLanguage(lang) {
        setStorage("lang", lang);
        
        // Always look up the button fresh to ensure we have the current DOM element
        const langToggle = document.getElementById("langToggle");
        if (langToggle) {
            langToggle.textContent = lang === "ur" ? "EN" : "UR";
        }
        
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
                if (el.tagName === 'TITLE') {
                    document.title = text;
                } else if (el.children.length === 0) {
                    el.textContent = text;
                } else {
                    // Start checking from the first child node
                    let updated = false;
                    for (let node of el.childNodes) {
                        if (node.nodeType === 3 && node.nodeValue.trim() !== "") {
                            node.nodeValue = " " + text + " ";
                            updated = true;
                            break;
                        }
                    }
                }
            }
        });
        
        // Dispatch language changed event
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }

    // Initialize Language
    updateLanguage(currentLang);
}