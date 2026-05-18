document.addEventListener('DOMContentLoaded', () => {
    // --- Reveal Animation ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // --- Lucide Icons ---
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // --- Auth Modal Logic ---
    const authModal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeAuth = document.getElementById('closeAuth');
    const switchAuth = document.getElementById('switchAuth');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    const signupFields = document.getElementById('signupFields');
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
            authSubtitle.innerHTML = "Don't Have an Account? <a href='javascript:void(0)' id='switchAuth'>Create Account</a>";
            signupFields.style.display = 'none';
            authSubmitBtn.innerText = 'LOGIN NOW';
        } else {
            authTitle.innerText = 'Create Account';
            authSubtitle.innerHTML = "Already Have an Account? <a href='javascript:void(0)' id='switchAuth'>Login Now</a>";
            signupFields.style.display = 'block';
            authSubmitBtn.innerText = 'SIGN UP NOW';
        }
        // Re-attach listener to the new link
        document.getElementById('switchAuth').addEventListener('click', toggleAuthMode);
    };

    // --- Auth Form Logic ---
    let isLoggedIn = false;

    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('authSubmitBtn');
            submitBtn.innerText = 'Processing...';
            
            setTimeout(() => {
                isLoggedIn = true;
                closeModal();
                
                // Update buttons to "Enroll Now"
                const triggers = ['viewProgramBtn', 'applyNowBtn', 'joinBtn'];
                triggers.forEach(id => {
                    const btn = document.getElementById(id);
                    if (btn) {
                        btn.innerText = 'ENROLL NOW';
                        btn.style.background = '#28a745'; // Green for action
                        btn.style.boxShadow = '0 0 20px rgba(40, 167, 69, 0.4)';
                    }
                });

                alert("Account verified! You can now enroll in your chosen program.");
            }, 1000);
        });
    }

    const handleActionClick = (e) => {
        if (!isLoggedIn) {
            openModal();
        } else {
            // Identify selected course
            const btn = e.currentTarget;
            const card = btn.closest('div');
            const courseTitle = card.querySelector('h3') ? card.querySelector('h3').innerText : "Mastery Program";
            
            // Save enrollment details
            localStorage.setItem('selectedCourse', courseTitle);
            localStorage.setItem('enrollDate', new Date().toISOString());

            // Simulate purchase and redirect
            btn.innerText = 'Redirecting...';
            setTimeout(() => {
                window.location.href = 'html/dashboard.html';
            }, 1000);
        }
    };

    if (loginBtn) {
        loginBtn.addEventListener('click', openModal);
    }
    
    const loginBtnNav = document.getElementById('loginBtnNav');
    const signupBtnNav = document.getElementById('signupBtnNav');
    
    if (loginBtnNav) {
        loginBtnNav.addEventListener('click', () => {
            if (!isLogin) toggleAuthMode();
            openModal();
        });
    }
    
    if (signupBtnNav) {
        signupBtnNav.addEventListener('click', () => {
            if (isLogin) toggleAuthMode();
            openModal();
        });
    }

    if (document.getElementById('joinBtn')) {
        document.getElementById('joinBtn').addEventListener('click', handleActionClick);
    }
    if (document.getElementById('viewProgramBtn')) {
        document.getElementById('viewProgramBtn').addEventListener('click', handleActionClick);
    }
    if (document.getElementById('applyNowBtn')) {
        document.getElementById('applyNowBtn').addEventListener('click', handleActionClick);
    }

    closeAuth.addEventListener('click', closeModal);
    switchAuth.addEventListener('click', toggleAuthMode);

    // --- Mobile Hamburger Menu Toggle ---
    const navToggle = document.getElementById('navToggle');
    const mobileMenuDropdown = document.getElementById('mobileMenuDropdown');

    if (navToggle && mobileMenuDropdown) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuDropdown.classList.toggle('active');
            
            // Toggle icon visual
            const icon = navToggle.querySelector('i');
            if (icon && window.lucide) {
                if (mobileMenuDropdown.classList.contains('active')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                window.lucide.createIcons();
            }
        });

        // Close mobile dropdown when clicking any navigation link
        mobileMenuDropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuDropdown.classList.remove('active');
                const icon = navToggle.querySelector('i');
                if (icon && window.lucide) {
                    icon.setAttribute('data-lucide', 'menu');
                    window.lucide.createIcons();
                }
            });
        });

        // Close mobile dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !mobileMenuDropdown.contains(e.target)) {
                mobileMenuDropdown.classList.remove('active');
                const icon = navToggle.querySelector('i');
                if (icon && window.lucide) {
                    icon.setAttribute('data-lucide', 'menu');
                    window.lucide.createIcons();
                }
            }
        });
    }

    // --- Mobile Auth Button Listeners ---
    const loginBtnNavMobile = document.getElementById('loginBtnNavMobile');
    const signupBtnNavMobile = document.getElementById('signupBtnNavMobile');

    if (loginBtnNavMobile) {
        loginBtnNavMobile.addEventListener('click', () => {
            if (!isLogin) toggleAuthMode();
            openModal();
            mobileMenuDropdown.classList.remove('active');
            const icon = navToggle.querySelector('i');
            if (icon && window.lucide) {
                icon.setAttribute('data-lucide', 'menu');
                window.lucide.createIcons();
            }
        });
    }

    if (signupBtnNavMobile) {
        signupBtnNavMobile.addEventListener('click', () => {
            if (isLogin) toggleAuthMode();
            openModal();
            mobileMenuDropdown.classList.remove('active');
            const icon = navToggle.querySelector('i');
            if (icon && window.lucide) {
                icon.setAttribute('data-lucide', 'menu');
                window.lucide.createIcons();
            }
        });
    }

    // --- FAQ Toggle Logic ---
    const faqCards = document.querySelectorAll('.faq-card-unique');
    faqCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('faq-open');
            // Close other FAQ cards
            faqCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('faq-open');
                }
            });
        });
    });

});