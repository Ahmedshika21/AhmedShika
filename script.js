document.addEventListener('DOMContentLoaded', function() {

    // --- Splash Screen ---
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        // Disable scrolling while splash is visible
        document.body.style.overflow = 'hidden';
        
        // Hide splash screen after 2.5 seconds
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            document.body.style.overflow = 'auto'; // Re-enable scrolling
            
            // Remove from DOM after transition completes to save resources
            setTimeout(() => {
                splashScreen.remove();
            }, 800);
        }, 2500);
    }

    // --- Language Setup ---
    let currentLang = localStorage.getItem('portfolio_lang') || 'en';
    let typedInstance = null;

    const setLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem('portfolio_lang', lang);

        // Update Document Direction & Language
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);

        // Update Toggle Button Text
        const langToggle = document.getElementById('lang-toggle');
        if(langToggle) {
            langToggle.textContent = lang === 'en' ? 'AR' : 'EN';
        }

        // Translate Text Elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if(translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key]; 
            }
        });

        // Re-initialize Typed.js for the dynamic hero text based on language
        const typedTextSpan = document.querySelector(".typed-text");
        if(typedTextSpan) {
            if(typedInstance) {
                typedInstance.destroy(); // Destroy previous instance before creating a new one
            }
            
            const strings = lang === 'en' 
                ? ['Web Development.', 'IT Infrastructure.', 'Database Systems.', 'IoT Applications.']
                : ['تطوير الويب.', 'تكنولوجيا المعلومات.', 'قواعد البيانات.', 'إنترنت الأشياء.'];
            
            typedInstance = new Typed('.typed-text', {
                strings: strings,
                typeSpeed: 60,
                backSpeed: 40,
                backDelay: 2000,
                loop: true,
                showCursor: false
            });
        }
    };

    // Initialize with saved language or default English
    if (typeof translations !== 'undefined') {
        setLanguage(currentLang);
    }

    // Language toggle event listener
    const langToggleBtn = document.getElementById('lang-toggle');
    if(langToggleBtn) {
        langToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            setLanguage(currentLang === 'en' ? 'ar' : 'en');
        });
    }

    // --- 1. Initialize Particles.js background ---
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 40, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#3b82f6" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.3, "random": false },
            "size": { "value": 3, "random": true },
            "line_linked": { "enable": true, "distance": 150, "color": "#8b5cf6", "opacity": 0.2, "width": 1 },
            "move": { "enable": true, "speed": 1.5, "direction": "none", "random": true, "out_mode": "out" }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
            "modes": { "grab": { "distance": 200, "line_linked": { "opacity": 0.6 } }, "push": { "particles_nb": 3 } }
        },
        "retina_detect": true
    });

    // --- 3. Initialize AOS (Animate On Scroll) ---
    AOS.init({
        duration: 900,
        once: true,
        offset: 50,
        easing: 'ease-out-cubic',
    });

    // --- 4. Sticky Header Effect on Scroll ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 5. Update Footer Year Automatically ---
    const yearSpan = document.getElementById('year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- 6. Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if(target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    // --- 7. Form Submission Handler ---
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('.btn-submit');
            const originalText = btn.innerHTML;
            
            // Show loading state
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            btn.style.opacity = '0.8';
            
            // Simulate API call delay
            setTimeout(() => {
                const isAr = currentLang === 'ar';
                btn.innerHTML = isAr ? '<i class="fas fa-check"></i> تم الإرسال!' : '<i class="fas fa-check"></i> Message Sent!';
                btn.style.background = '#10b981'; // Success green
                this.reset();
                
                // Revert button after 3 seconds
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.opacity = '1';
                }, 3000);
            }, 1500);
        });
    }
});
