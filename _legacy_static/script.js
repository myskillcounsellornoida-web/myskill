/* ==========================================================================
   GLOBAL JAVASCRIPT (Ria Jain - My Skill Counsellor)
   ========================================================================== */

// Configuration
const CONFIG = {
    whatsappUrl: "https://wa.me/message/24XQYF3LERXWA1",
    calendlyUrl: "https://calendly.com/ria-myskillcounsellor", // Placeholder: User can update this
    emailAddress: "ria.myskillcounsellor@gmail.com",
    phoneNumber: "+919990004878"
};

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initTestimonialSlider();
    initBookingModal();
    initContactForm();
    initScrollAnimations();
});

/* ==========================================================================
   NAVIGATION FUNCTIONS
   ========================================================================== */
function initNavigation() {
    const header = document.querySelector("header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    
    // Sticky header on scroll
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // Mobile menu toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            
            // Toggle hamburger icon between bars and times (close)
            const icon = menuToggle.querySelector("i");
            if (icon) {
                if (navLinks.classList.contains("active")) {
                    icon.className = "fas fa-times";
                } else {
                    icon.className = "fas fa-bars";
                }
            }
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                const icon = menuToggle.querySelector("i");
                if (icon) icon.className = "fas fa-bars";
            });
        });
    }
}

/* ==========================================================================
   TESTIMONIAL SLIDER
   ========================================================================== */
function initTestimonialSlider() {
    const track = document.querySelector(".testimonials-track");
    const prevBtn = document.querySelector(".control-btn.prev");
    const nextBtn = document.querySelector(".control-btn.next");
    const slides = document.querySelectorAll(".testimonial-slide");
    
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
    }
    
    // Auto play every 6 seconds
    let autoPlayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }, 6000);
    
    // Pause auto play on interaction
    const container = document.querySelector(".testimonials-slider");
    if (container) {
        container.addEventListener("mouseenter", () => clearInterval(autoPlayInterval));
        container.addEventListener("mouseleave", () => {
            autoPlayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateSlider();
            }, 6000);
        });
    }
}

/* ==========================================================================
   BOOKING MODAL (WHATSAPP vs CALENDLY)
   ========================================================================== */
let calendlyScriptLoaded = false;

function initBookingModal() {
    // Dynamically insert modal markup in body if it doesn't exist
    if (!document.getElementById("bookingModal")) {
        const modalHtml = `
            <div id="bookingModal" class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close" aria-label="Close modal"><i class="fas fa-times"></i></button>
                    <div class="modal-title">
                        <h2>Let's Connect</h2>
                        <p>Select how you would like to schedule your guidance session.</p>
                    </div>
                    <div class="modal-options">
                        <button class="modal-option-btn whatsapp" id="modalOptWhatsapp">
                            <i class="fab fa-whatsapp"></i>
                            <div class="modal-option-btn-text">
                                Chat on WhatsApp
                                <span>Connect instantly with Ria for quick queries and chat.</span>
                            </div>
                        </button>
                        <button class="modal-option-btn calendly" id="modalOptCalendly">
                            <i class="far fa-calendar-alt"></i>
                            <div class="modal-option-btn-text">
                                Schedule Consultation
                                <span>Book a structured 1-on-1 audio/video call via Calendly.</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <div id="toastSuccess" class="toast-notification">
                <i class="fas fa-check-circle"></i>
                <span id="toastMessage">Enquiry submitted successfully!</span>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", modalHtml);
    }
    
    const modal = document.getElementById("bookingModal");
    const closeBtn = modal.querySelector(".modal-close");
    const optWhatsapp = document.getElementById("modalOptWhatsapp");
    const optCalendly = document.getElementById("modalOptCalendly");
    
    // Open modal event triggers
    document.querySelectorAll(".trigger-booking").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            modal.classList.add("active");
        });
    });
    
    // Close modal
    const closeModal = () => modal.classList.remove("active");
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Option: WhatsApp click
    optWhatsapp.addEventListener("click", () => {
        closeModal();
        window.open(CONFIG.whatsappUrl, "_blank");
    });
    
    // Option: Calendly click
    optCalendly.addEventListener("click", () => {
        closeModal();
        loadAndTriggerCalendly();
    });
}

function loadAndTriggerCalendly() {
    // Dynamic load of Calendly assets to optimize page performance
    if (!calendlyScriptLoaded) {
        // Load CSS
        const link = document.createElement("link");
        link.href = "https://assets.calendly.com/assets/external/widget.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        
        // Load JS
        const script = document.createElement("script");
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        script.onload = () => {
            calendlyScriptLoaded = true;
            triggerCalendlyPopup();
        };
        document.body.appendChild(script);
    } else {
        triggerCalendlyPopup();
    }
}

function triggerCalendlyPopup() {
    if (typeof Calendly !== 'undefined') {
        Calendly.initPopupWidget({ url: CONFIG.calendlyUrl });
    } else {
        // Fallback if script load fails
        window.open(CONFIG.calendlyUrl, "_blank");
    }
}

/* ==========================================================================
   CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById("enquiryForm");
    if (!form) return;
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = document.getElementById("formName").value;
        const phone = document.getElementById("formPhone").value;
        const email = document.getElementById("formEmail").value;
        const qualification = document.getElementById("formQualification").value;
        const service = document.getElementById("formService").value;
        const message = document.getElementById("formMessage").value;
        
        // Construct pre-filled WhatsApp message for lead capture
        const wsText = `Hello Ria, I have submitted an enquiry on your website.\n\n` +
                       `*Name:* ${name}\n` +
                       `*Phone:* ${phone}\n` +
                       `*Email:* ${email}\n` +
                       `*Qualification:* ${qualification}\n` +
                       `*Service of Interest:* ${service}\n` +
                       `*Brief Message:* ${message}`;
        
        const encodedText = encodeURIComponent(wsText);
        const contactWhatsAppUrl = `https://wa.me/9990004878?text=${encodedText}`;
        
        // Show success Toast
        showToast("Enquiry submitted successfully! Opening WhatsApp chat to connect...");
        
        // Reset form
        form.reset();
        
        // Open WhatsApp chat after 1.5 seconds delay
        setTimeout(() => {
            window.open(contactWhatsAppUrl, "_blank");
        }, 1500);
    });
}

function showToast(message) {
    const toast = document.getElementById("toastSuccess");
    const toastMsg = document.getElementById("toastMessage");
    if (!toast || !toastMsg) return;
    
    toastMsg.textContent = message;
    toast.classList.add("active");
    
    setTimeout(() => {
        toast.classList.remove("active");
    }, 4000);
}

/* ==========================================================================
   SUBTLE SCROLL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll(".service-card, .blog-card, .approach-image-wrapper, .about-block, .timeline-item");
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });
        
        fadeElements.forEach(el => {
            el.style.opacity = 0;
            el.style.transform = 'translateY(25px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }
}
