// ===== IDYLLIC SERVICES - Website JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    if (preloader) {
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
    } else {
        initAnimations();
    }

    // ===== CURSOR FOLLOWER =====
    const cursor = document.getElementById('cursorFollower');
    let cursorVisible = false;

    if (cursor && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            if (!cursorVisible) {
                cursor.classList.add('active');
                cursorVisible = true;
            }
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

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

        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        updateActiveNavLink();
        lastScroll = scrollY;
    });

    // Mobile menu toggle
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

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
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ===== BACK TO TOP =====
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

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
            return (num / 100000).toFixed(0) + ',00,000';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
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

    if (track && prevBtn && nextBtn) {
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

        function prevSlideAction() {
            goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
        }

        prevBtn.addEventListener('click', () => {
            prevSlideAction();
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

        if (slider) {
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
                    else prevSlideAction();
                    resetInterval();
                }
            }
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
            if (!submitBtn) return;
            const originalContent = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                submitBtn.style.background = 'linear-gradient(135deg, #00d4aa 0%, #0d7377 100%)';

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
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        lazyLoadSections.observe(section);
    });

    // ===== WINDOW RESIZE HANDLER =====
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && navToggle && mobileMenu) {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }, 250);
    });

    // ===== CHATBOT =====
    const chatToggle = document.getElementById('chatbotToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatMessages = document.getElementById('chatMessages');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatQuickQuestions = document.getElementById('chatQuickQuestions');

    // Predefined Q&A
    const chatQA = [
        {
            keywords: ['service', 'services', 'offer', 'what do you do', 'solutions', 'help'],
            answer: "We offer a range of staffing solutions:\n\n🔹 **Permanent Staffing** – Full-time hires with 80% accuracy\n🔹 **Temporary Staffing** – On-demand talent for projects\n🔹 **Leadership & C-Suite Hiring** – CXO-level recruitment\n🔹 **RPO** – End-to-end recruitment outsourcing\n\nVisit our Solutions page for details!"
        },
        {
            keywords: ['price', 'pricing', 'cost', 'how much', 'rate', 'fee', 'charges'],
            answer: "Our pricing varies based on the type and volume of hiring. We offer competitive rates tailored to your specific needs. For a custom quote, please contact us at sales@idyllicservices.in or call +91 9923790784."
        },
        {
            keywords: ['contact', 'reach', 'email', 'phone', 'call', 'address', 'location', 'office'],
            answer: "You can reach us through:\n\n📧 Email: sales@idyllicservices.in\n📞 Phone: +91 9923790784\n📍 Address: 2nd Floor, Bajaj Bhavan, Railway Station M.I.D.C, Aurangabad, MH - 431001\n\nOr fill out the form on our Contact page!"
        },
        {
            keywords: ['time', 'hours', 'when', 'open', 'available', 'working'],
            answer: "Our business hours are Monday to Friday, 9:00 AM – 6:00 PM IST. You can reach out anytime via email, and we'll get back to you within 24 hours!"
        },
        {
            keywords: ['process', 'how', 'steps', 'hiring process', 'workflow', 'start'],
            answer: "Our hiring process is simple:\n\n1️⃣ **Share your requirements** — Send us your JD or hiring needs\n2️⃣ **We source candidates** — Our AI-powered platform finds the best matches within 24 hours\n3️⃣ **Screening & interviews** — Multi-level talent screening with 80% accuracy\n4️⃣ **Onboarding** — We assist with the complete onboarding process\n\nReady to start? Contact us today!"
        },
        {
            keywords: ['permanent', 'full time', 'full-time', 'hire permanently'],
            answer: "Our Permanent Staffing solution helps you build your dream team with fully screened candidates across every industry. We guarantee an 80% profile-to-role match, substantially reducing your time-to-hire. Contact us to get started!"
        },
        {
            keywords: ['temporary', 'contract', 'short term', 'short-term', 'freelance'],
            answer: "Our Temporary Staffing solution lets you hire professionals for time-based or short-term projects. Scale your teams up and down according to your immediate business needs with on-demand talent. Reach out to learn more!"
        },
        {
            keywords: ['leadership', 'c-suite', 'executive', 'cto', 'ceo', 'cxo', 'director'],
            answer: "We specialize in identifying and attracting visionary leaders aligned with your strategic goals. With access to CXO-level talent from the fastest-growing companies, we secure executive talent that drives success. Let's discuss your leadership needs!"
        },
        {
            keywords: ['rpo', 'outsource', 'outsourcing', 'recruitment process'],
            answer: "Our RPO solution covers your entire recruitment process — from sourcing and screening to interviewing, hiring, and onboarding. The result: reduced costs, faster time-to-fill, and substantially improved candidate quality!"
        },
        {
            keywords: ['industry', 'industries', 'sectors', 'domain', 'work with'],
            answer: "We serve clients across a wide range of industries including:\n\n💻 Software & IT\n🏦 Fintech\n🏥 Healthcare\n🛒 E-Retail\n🏭 Manufacturing\n🤖 Robotics\n☁️ Cloud & DevOps\n🧠 AI & ML\n\nAnd many more! Whatever your industry, we've got the talent."
        },
        {
            keywords: ['ai', 'technology', 'tech', 'platform', 'tool'],
            answer: "We integrate AI-powered tools with over a decade of recruitment experience. Our multi-level talent screening guarantees an 80% profile-to-role match, helping you find the right fit faster than traditional methods."
        },
        {
            keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
            answer: "Hello! 👋 Welcome to Idyllic Services. I'm here to help you with any questions about our staffing and recruitment solutions. What would you like to know?"
        },
        {
            keywords: ['thank', 'thanks', 'bye', 'goodbye'],
            answer: "You're welcome! 😊 If you have any more questions, feel free to ask anytime. Have a great day!"
        }
    ];

    const quickQuestions = [
        "What services do you offer?",
        "How to contact you?",
        "What's the hiring process?",
        "Pricing info",
        "Which industries?"
    ];

    if (chatToggle && chatWindow && chatMessages && chatForm && chatInput) {
        // Toggle chat window
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
            const notifDot = chatToggle.querySelector('.notification-dot');
            if (notifDot) notifDot.style.display = 'none';

            // Send welcome message on first open
            if (chatMessages.children.length === 0) {
                addBotMessage("Hi there! 👋 I'm the Idyllic Assistant. How can I help you today? You can ask about our services, pricing, contact details, or anything else!");
                renderQuickQuestions();
            }
        });

        // Close chat
        if (chatClose) {
            chatClose.addEventListener('click', () => {
                chatWindow.classList.remove('active');
            });
        }

        // Handle form submit
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (!message) return;

            addUserMessage(message);
            chatInput.value = '';

            // Show typing indicator
            showTyping();

            setTimeout(() => {
                removeTyping();
                const response = findAnswer(message);
                addBotMessage(response);
            }, 800 + Math.random() * 600);
        });

        // Render quick question buttons
        function renderQuickQuestions() {
            if (!chatQuickQuestions) return;
            chatQuickQuestions.innerHTML = '';
            quickQuestions.forEach(q => {
                const btn = document.createElement('button');
                btn.className = 'quick-question-btn';
                btn.textContent = q;
                btn.addEventListener('click', () => {
                    addUserMessage(q);
                    showTyping();
                    setTimeout(() => {
                        removeTyping();
                        const response = findAnswer(q);
                        addBotMessage(response);
                    }, 800 + Math.random() * 600);
                });
                chatQuickQuestions.appendChild(btn);
            });
        }

        // Add bot message
        function addBotMessage(text) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'chat-message bot';
            // Convert markdown-style bold and newlines
            const formattedText = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
            msgDiv.innerHTML = `
                <div class="chat-message-avatar"><i class="fas fa-robot"></i></div>
                <div class="chat-bubble">${formattedText}</div>
            `;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Add user message
        function addUserMessage(text) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'chat-message user';
            msgDiv.innerHTML = `
                <div class="chat-message-avatar"><i class="fas fa-user"></i></div>
                <div class="chat-bubble">${text}</div>
            `;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Show typing indicator
        function showTyping() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chat-message bot';
            typingDiv.id = 'chatTyping';
            typingDiv.innerHTML = `
                <div class="chat-message-avatar"><i class="fas fa-robot"></i></div>
                <div class="chat-bubble"><div class="chat-typing"><span></span><span></span><span></span></div></div>
            `;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Remove typing indicator
        function removeTyping() {
            const typing = document.getElementById('chatTyping');
            if (typing) typing.remove();
        }

        // Find answer based on keywords
        function findAnswer(userMessage) {
            const lowerMessage = userMessage.toLowerCase();

            for (const qa of chatQA) {
                for (const keyword of qa.keywords) {
                    if (lowerMessage.includes(keyword)) {
                        return qa.answer;
                    }
                }
            }

            // Default fallback
            return "Thanks for your question! I might not have the exact answer right now, but our team would love to help. You can:\n\n📧 Email: sales@idyllicservices.in\n📞 Call: +91 9923790784\n\nOr visit our Contact page to send us a message!";
        }
    }
});
