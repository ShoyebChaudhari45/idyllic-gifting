// ===== IDYLLIC SERVICES - Premium Corporate Gifting Website JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';
            initAnimations();
        }, 1200);
    });

    // Fallback: remove preloader after 3 seconds max
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        initAnimations();
    }, 3000);

    // ===== CURSOR FOLLOWER =====
    const cursor = document.getElementById('cursorFollower');
    let cursorVisible = false;

    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            if (!cursorVisible) {
                cursor.classList.add('active');
                cursorVisible = true;
            }
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        // Hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .solution-card, .promise-card, .about-card, input, select, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });

        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            cursorVisible = false;
        });
    }

    // ===== NAVBAR =====
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let lastScroll = 0;

    // Scroll handler for navbar
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Add scrolled class
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link based on scroll position
        updateActiveNavLink();

        lastScroll = scrollY;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Update active nav link
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.offsetTop - offset;
                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== BACK TO TOP =====
    document.getElementById('backToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== COUNTER ANIMATION =====
    function animateCounters() {
        const counters = document.querySelectorAll('.hero-stat-number[data-count]');
        counters.forEach(counter => {
            if (counter.dataset.animated) return;

            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    if (target >= 1000) {
                        counter.textContent = formatNumber(Math.floor(current));
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = formatNumber(target);
                    counter.dataset.animated = 'true';
                }
            };

            requestAnimationFrame(updateCounter);
        });
    }

    function formatNumber(num) {
        if (num >= 100000) {
            return (num / 1000).toFixed(0) + 'K+';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K+';
        }
        return num;
    }

    // ===== SCROLL ANIMATIONS (Intersection Observer) =====
    function initAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, parseInt(delay));

                    // Trigger counter animation when hero stats are visible
                    if (entry.target.closest('.hero-stats') || entry.target.classList.contains('hero-stats')) {
                        animateCounters();
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));

        // Also trigger counters directly if hero is already visible
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            const heroObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(animateCounters, 500);
                        heroObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            heroObserver.observe(heroStats);
        }
    }

    // ===== TESTIMONIALS SLIDER =====
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const totalSlides = 3;
    let slideInterval;

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % totalSlides);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetInterval();
        });
    });

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 6000);
    }

    slideInterval = setInterval(nextSlide, 6000);

    // Touch support for slider
    let touchStartX = 0;
    let touchEndX = 0;
    const slider = document.getElementById('testimonialsSlider');

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
            resetInterval();
        }
    }

    // ===== HERO PARTICLES =====
    function createParticles() {
        const container = document.getElementById('heroParticles');
        if (!container) return;

        const particleCount = window.innerWidth < 768 ? 20 : 40;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: rgba(10, 189, 198, ${Math.random() * 0.4 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
                pointer-events: none;
            `;
            container.appendChild(particle);
        }

        // Create particle animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0% { transform: translate(0, 0) scale(1); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 200}px, -${Math.random() * 300 + 200}px) scale(0); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    createParticles();

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const originalContent = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                submitBtn.style.background = 'linear-gradient(135deg, #00d4aa 0%, #0d7377 100%)';

                // Reset form
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = originalContent;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 2500);
            }, 1500);
        });
    }

    // ===== PARALLAX FLOAT FOR ABOUT CARDS =====
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const cards = document.querySelectorAll('.about-card');
        cards.forEach((card, index) => {
            const speed = (index + 1) * 0.02;
            const yPos = scrollY * speed;
            card.style.transform = `translateY(${-yPos}px)`;
        });
    }, { passive: true });

    // ===== TILT EFFECT FOR SOLUTION CARDS =====
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.solution-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ===== MAGNETIC BUTTON EFFECT =====
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ===== TEXT TYPING EFFECT FOR HERO =====
    function typeWriter() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.style.opacity = '1';
        }
    }

    setTimeout(typeWriter, 1500);

    // ===== NAVBAR LINK HOVER SLIDE EFFECT =====
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // ===== LAZY LOADING FOR SECTIONS =====
    const lazyLoadSections = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-loaded');
                lazyLoadSections.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('section').forEach(section => {
        lazyLoadSections.observe(section);
    });

    // ===== WINDOW RESIZE HANDLER =====
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Recalculate any dimension-dependent elements
            if (window.innerWidth > 768) {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }, 250);
    });
});
