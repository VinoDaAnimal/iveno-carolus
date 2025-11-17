// Global variables
let navDots;
let currentSection = 'hero';

let navObserver;

// Timeline animation on scroll
function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    timelineItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const itemTop = rect.top + scrollY;

        if (scrollY > itemTop - windowHeight + 100) {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 200); // Staggered animation
        }
    });
}

// Intersection Observer for nav tracking

function initNavTracking() {
    navDots = document.querySelectorAll('.nav-dot');

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section is in middle of viewport
        threshold: 0
    };

    navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;

                // Update nav dots
                navDots.forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.dataset.section === sectionId) {
                        dot.classList.add('active');
                    }
                });

                currentSection = sectionId;
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        navObserver.observe(section);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Make all sections visible by default - simplify approach
    const allSections = document.querySelectorAll('section');
    allSections.forEach(section => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0) scale(1)';
        section.style.pointerEvents = 'auto';
    });

    // Smart Navigation System
    navDots = document.querySelectorAll('.nav-dot');

    function navigateToSection(sectionId) {
        // Update active nav dot
        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.dataset.section === sectionId) {
                dot.classList.add('active');
            }
        });

        // Smooth scroll to section with proper offset calculation
        if (sectionId === 'hero') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                const rect = targetSection.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const targetPosition = rect.top + scrollTop - 120; // 120px offset for nav bar

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }

        currentSection = sectionId;
    }

    // Add click handlers to nav dots
    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const sectionId = dot.dataset.section;
            navigateToSection(sectionId);
        });
    });

    // Initialize nav tracking
    initNavTracking();

    // Mobile nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const smartNav = document.querySelector('.smart-nav');

    if (navToggle && smartNav) {
        navToggle.addEventListener('click', () => {
            smartNav.classList.toggle('expanded');
        });
    }

    // Skills tag interactions
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.classList.toggle('active');
            if (this.classList.contains('active')) {
                this.style.background = 'var(--primary-black)';
                this.style.color = 'var(--white)';
                this.style.transform = 'scale(1.1)';
            } else {
                this.style.background = 'var(--light-grey)';
                this.style.color = 'var(--text-primary)';
                this.style.transform = 'scale(1)';
            }
        });
    });

    // Project cards 3D hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            this.style.transform = `translateY(-12px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotateX(0deg) rotateY(0deg)';
        });
    });

    // 3D parallax effect for hero section
    document.addEventListener('mousemove', function(e) {
        const hero = document.querySelector('.hero-section');
        if (hero) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            const profile = document.querySelector('.profile-image-container');
            if (profile) {
                profile.style.transform = `scale(1.1) rotate(${mouseX * 2}deg) translate(${mouseX * 5}px, ${mouseY * 5}px)`;
            }
        }
    });

    // Initialize with hero section active
    setTimeout(() => {
        navDots[0].classList.add('active');
    }, 500);
});

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        // Simplified click handler to prevent errors
    });
});

// Function to reset card heights on window resize
function resetCardHeights() {
    // Commented out as project-card-back elements don't exist in HTML
    // document.querySelectorAll('.project-card').forEach(card => {
    //     if (card.classList.contains('expanded')) {
    //         const backContent = card.querySelector('.project-card-back');
    //         if (backContent) {
    //             const backContentHeight = backContent.scrollHeight;
    //             card.style.height = `${backContentHeight}px`;
    //         }
    //     } else {
    //         card.style.height = '';
    //     }
    // });
}

// Add event listener for window resize
window.addEventListener('resize', resetCardHeights);

// Smooth scrolling for navigation
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll reveal animation
function revealOnScroll() {
    const sections = document.querySelectorAll('main section'); // Only main sections, not hero
    const windowHeight = window.innerHeight;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;

        // If section is entering viewport from below, make it visible
        if (sectionTop < windowHeight * 0.8) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0) scale(1)';
            section.style.pointerEvents = 'auto';
        }
    });
}

// Remove duplicate initialization - handled in DOMContentLoaded

// Trigger initial reveal on page load after a short delay
setTimeout(() => {
    revealOnScroll();
    animateTimeline();
}, 100);

// Add scroll event listeners
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('scroll', animateTimeline);
