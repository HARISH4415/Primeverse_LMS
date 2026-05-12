document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Reveal animation on scroll
    const reveal = () => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('revealed');
            }
        });
    };

    window.addEventListener('scroll', reveal);
    reveal(); // Run on load

    // Mouse parallax for the background glow
    const glow = document.querySelector('.bg-glow');
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const moveX = (x - 0.5) * 50;
        const moveY = (y - 0.5) * 50;
        
        glow.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

    // FAQ Toggle
    document.querySelectorAll('.faq-card-unique').forEach(card => {
        card.addEventListener('click', () => {
            // Close other open cards
            document.querySelectorAll('.faq-card-unique').forEach(other => {
                if (other !== card && other.classList.contains('faq-open')) {
                    other.classList.remove('faq-open');
                    other.querySelector('i').setAttribute('data-lucide', 'plus');
                }
            });

            // Toggle current card
            card.classList.toggle('faq-open');
            const icon = card.querySelector('i');
            
            if (card.classList.contains('faq-open')) {
                icon.setAttribute('data-lucide', 'minus');
            } else {
                icon.setAttribute('data-lucide', 'plus');
            }
            
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });
    });

    // --- Auth Modal Logic ---
    const authModal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeAuth = document.getElementById('closeAuth');
    const switchAuth = document.getElementById('switchAuth');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    const signupFields = document.getElementById('signupFields');
    const loginMeta = document.getElementById('loginMeta');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const togglePass = document.getElementById('togglePass');
    const passwordInput = document.getElementById('passwordInput');

    let isLogin = true;

    const openModal = () => {
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        authModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    const toggleAuthMode = () => {
        isLogin = !isLogin;
        if (isLogin) {
            authTitle.innerText = 'Login Account';
            authSubtitle.innerHTML = 'Don\'t Have an Account? <a href="javascript:void(0)" id="switchAuth">Create Account</a>';
            signupFields.style.display = 'none';
            loginMeta.style.display = 'block';
            authSubmitBtn.innerText = 'Login';
        } else {
            authTitle.innerText = 'Create Account';
            authSubtitle.innerHTML = 'Already have an account? <a href="javascript:void(0)" id="switchAuth">Login</a>';
            signupFields.style.display = 'block';
            loginMeta.style.display = 'none';
            authSubmitBtn.innerText = 'Sign Up';
        }
        
        // Re-attach switch listener because innerHTML wipes it
        document.getElementById('switchAuth').addEventListener('click', toggleAuthMode);
    };

    loginBtn.addEventListener('click', openModal);
    closeAuth.addEventListener('click', closeModal);
    switchAuth.addEventListener('click', toggleAuthMode);

    // Close on outside click
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) closeModal();
    });

    // Toggle Password Visibility
    togglePass.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        const icon = togglePass.querySelector('i');
        icon.setAttribute('data-lucide', type === 'password' ? 'eye' : 'eye-off');
        if (window.lucide) window.lucide.createIcons();
    });

});
