// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavbar();
    initLazyLoading();
    initAnimations();
    initBeforeAfter();
    initGallery();
    initContactForm();
    initChatbot();
    initSmoothScroll();
});

// Loading Spinner
function initLoader() {
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    });
}

// Sticky Navbar
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');
    
    // Sticky navbar on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Lazy Loading Images
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Scroll Animations
function initAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in-up');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => animationObserver.observe(el));
}

// Before & After Toggle
function initBeforeAfter() {
    const baItems = document.querySelectorAll('.ba-item');
    
    baItems.forEach(item => {
        const buttons = item.querySelectorAll('.ba-btn');
        const images = item.querySelectorAll('.ba-image');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const view = button.dataset.view;
                
                // Update active button
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update visible image
                images.forEach(img => {
                    if (img.dataset.type === view) {
                        img.classList.add('active');
                    } else {
                        img.classList.remove('active');
                    }
                });
            });
        });
    });
}
initBeforeAfter();

// Gallery Filter
function initGallery() {
    const tabs = document.querySelectorAll('.gallery-tab');
    const items = document.querySelectorAll('.gallery-item');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter items
            items.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value.trim();
        const mobile_number = document.getElementById('mobile').value.trim();
        
        // Validate
        if (!name) {
            showMessage('Please enter your name', 'error');
            return;
        }
        
        if (!validateMobile(mobile_number)) {
            showMessage('Please enter a valid 10-digit mobile number', 'error');
            return;
        }
        
        // Show loading
        const submitBtn = form.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        submitBtn.disabled = true;
        
        try {
            // Send to API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name, mobile_number })
            });
            
            const data = await response.json();
            
            if (response.ok && data.status === 'success') {
                showMessage(data.message, 'success');
                form.reset();
            } else {
                showMessage(data.message || 'Something went wrong. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Network error. Please check your connection and try again.', 'error');
        } finally {
            // Hide loading
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
    
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
    
    function validateMobile(mobile_number) {
        const cleanMobile = mobile_number.replace(/[^0-9]/g, '');
        if (cleanMobile.length !== 10) return false;
        if (!['6', '7', '8', '9'].includes(cleanMobile[0])) return false;
        return true;
    }
}

// Chatbot
function initChatbot() {
    const chatbot = document.getElementById('chatbot');
    const chatbotTrigger = document.getElementById('chatbotTrigger');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');
    
    // Toggle chatbot
    chatbotTrigger.addEventListener('click', () => {
        chatbot.classList.toggle('active');
    });
    
    chatbotClose.addEventListener('click', () => {
        chatbot.classList.remove('active');
    });
    
    // Send message
    const sendMessage = async () => {
        const message = chatbotInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        chatbotInput.value = '';
        
        // Show typing indicator
        const typingIndicator = addTypingIndicator();
        
        try {
            // Send to API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            
            // Remove typing indicator
            typingIndicator.remove();
            
            // Add bot response
            if (data.status === 'success') {
                addMessage(data.response, 'bot');
            } else {
                addMessage('Sorry, I couldn\'t process that. Please try again.', 'bot');
            }
        } catch (error) {
            console.error('Chat error:', error);
            typingIndicator.remove();
            addMessage('Sorry, there was an error. Please try again.', 'bot');
        }
    };
    
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        
        const messagePara = document.createElement('p');
        messagePara.textContent = text;
        messageDiv.appendChild(messagePara);
        
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        return messageDiv;
    }
    
    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'bot-message';
        typingDiv.id = 'typing-indicator';
        
        const typingText = document.createElement('p');
        typingText.innerHTML = 'Typing<span class="dots"></span>';
        typingDiv.appendChild(typingText);
        
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // Animate dots
        let dotCount = 0;
        const dotsSpan = typingText.querySelector('.dots');
        const interval = setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            dotsSpan.textContent = '.'.repeat(dotCount);
        }, 500);
        
        // Store interval ID to clear it later
        typingDiv.dataset.intervalId = interval;
        
        return typingDiv;
    }
}

// Smooth Scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization: Throttle scroll events
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Add scroll event listener with throttling
window.addEventListener('scroll', throttle(() => {
    // Any scroll-based functionality can be added here
}, 100));

// Add resize event listener with debouncing
window.addEventListener('resize', debounce(() => {
    // Any resize-based functionality can be added here
}, 250));

// Preload critical images
function preloadImages() {
    const criticalImages = [
        '/static/images/Company Logo.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

preloadImages();

// Service Worker for PWA (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}

// Analytics placeholder
function trackEvent(category, action, label) {
    // Add Google Analytics or other analytics code here
    console.log('Event tracked:', category, action, label);
}

// Track important user interactions
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        trackEvent('Button', 'Click', e.target.textContent);
    });
});