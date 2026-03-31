// GSAP Vertical Scroll Logic
gsap.registerPlugin(ScrollTrigger);

// --- Loading Screen ---
window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");
    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.display = "none";
            ScrollTrigger.refresh();

            // *** Fire all hero animations AFTER loader is gone ***
            runHeroAnimations();

        }, 1000);
    }, 1000);

    // --- Smooth Scroll Nav Links ---
    document.querySelectorAll(".nav-link, .glitch-btn").forEach(link => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (href && href.startsWith("#")) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        });
    });

    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll(".panel[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute("id");
            }
        });
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("active");
            }
        });
    });
});

// --- All Hero Animations (called after loader disappears) ---
function runHeroAnimations() {

    // 1) Animate hero content (everything EXCEPT subtitle)
    gsap.from(".hero-content > *:not(.subtitle)", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });

    // 2) Animate the cyber cube
    gsap.from(".cyber-cube-container", {
        scale: 0,
        rotation: 720,
        duration: 1.5,
        ease: "back.out(1.7)",
        delay: 0.2
    });

    // 3) Typewriter effect for FULL-STACK DEVELOPER
    const subtitle = document.querySelector(".subtitle");
    if (subtitle) {
        const fullText = subtitle.textContent.trim();
        subtitle.textContent = "";
        subtitle.style.borderRight = "2px solid var(--accent-cyan)";
        subtitle.style.display = "inline-block";
        let charIndex = 0;

        function typeNextChar() {
            if (charIndex < fullText.length) {
                subtitle.textContent += fullText[charIndex];
                charIndex++;
                setTimeout(typeNextChar, 120);
            } else {
                // Blink the cursor a few times then remove
                let blinks = 0;
                const blinkInterval = setInterval(() => {
                    subtitle.style.borderRight = blinks % 2 === 0
                        ? "2px solid transparent"
                        : "2px solid var(--accent-cyan)";
                    blinks++;
                    if (blinks > 6) {
                        clearInterval(blinkInterval);
                        subtitle.style.borderRight = "none";
                    }
                }, 400);
            }
        }

        // Start typing after other hero elements appear
        setTimeout(typeNextChar, 800);
    }
}

// --- Scroll-Triggered Section Animations ---
gsap.utils.toArray(".panel").forEach((panel, i) => {
    if (i === 0) return;

    const title = panel.querySelector(".panel-title");
    if (title) {
        gsap.from(title, {
            x: -40,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: panel,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    }

    const items = panel.querySelectorAll(
        ".glass-card, .skill-category, .project-card, .contact-info, .contact-form, .stat-box"
    );
    if (items.length) {
        gsap.from(items, {
            y: 50,
            opacity: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
                trigger: panel,
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });
    }
});

// --- Skill Bar Fill Animation ---
ScrollTrigger.create({
    trigger: ".skills-section",
    start: "top 70%",
    onEnter: () => {
        document.querySelectorAll(".skill-fill").forEach(bar => {
            const targetWidth = bar.getAttribute("data-width");
            bar.style.width = targetWidth + "%";
        });
    },
    onLeaveBack: () => {
        document.querySelectorAll(".skill-fill").forEach(bar => {
            bar.style.width = "0%";
        });
    }
});

// --- Parallax Stars ---
gsap.to(".stars", {
    yPercent: -15,
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
    }
});

// --- Progress Bar ---
gsap.to(".progress-bar", {
    width: "100%",
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3
    }
});

// --- Contact Form Submission (AJAX Upgrade) ---
const contactForm = document.getElementById("contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        // Change button state to sending
        submitBtn.disabled = true;
        submitBtn.textContent = "TRANSMITTING...";
        submitBtn.style.opacity = "0.7";

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        fetch(contactForm.action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                submitBtn.textContent = "TRANSMISSION SUCCESSFUL";
                submitBtn.style.background = "var(--accent-cyan)";
                submitBtn.style.color = "#000";
                contactForm.reset();

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    submitBtn.style.background = "";
                    submitBtn.style.color = "";
                    submitBtn.style.opacity = "1";
                }, 5000);
            } else {
                throw new Error("Transmission Failed");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            submitBtn.textContent = "UPLINK FAILED";
            submitBtn.style.background = "#ff0000";

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                submitBtn.style.background = "";
                submitBtn.style.opacity = "1";
            }, 3000);
        });
    });
}
