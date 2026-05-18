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
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    const loginBtnNav = document.getElementById('loginBtnNav');
    const signupBtnNav = document.getElementById('signupBtnNav');
    const loginBtnNavMobile = document.getElementById('loginBtnNavMobile');
    const signupBtnNavMobile = document.getElementById('signupBtnNavMobile');

    const updateAuthUI = () => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const viewProgramBtn = document.getElementById('viewProgramBtn');
        const applyNowBtn = document.getElementById('applyNowBtn');

        if (loggedIn) {
            // Desk Nav
            if (loginBtnNav) {
                loginBtnNav.innerText = 'DASHBOARD';
                loginBtnNav.style.background = 'rgba(255, 255, 255, 0.05)';
            }
            if (signupBtnNav) {
                signupBtnNav.innerText = 'SIGN OUT';
                signupBtnNav.style.background = 'var(--gold)';
                signupBtnNav.style.color = '#000';
            }
            // Mobile Nav
            if (loginBtnNavMobile) {
                loginBtnNavMobile.innerText = 'DASHBOARD';
            }
            if (signupBtnNavMobile) {
                signupBtnNavMobile.innerText = 'SIGN OUT';
            }
            // Program Action Buttons Green Color
            if (viewProgramBtn) {
                viewProgramBtn.style.background = '#28a745';
                viewProgramBtn.style.borderColor = '#28a745';
                viewProgramBtn.style.boxShadow = '0 0 25px rgba(40, 167, 69, 0.4)';
                viewProgramBtn.style.color = '#ffffff';
            }
            if (applyNowBtn) {
                applyNowBtn.style.background = '#28a745';
                applyNowBtn.style.borderColor = '#28a745';
                applyNowBtn.style.boxShadow = '0 0 25px rgba(40, 167, 69, 0.4)';
                applyNowBtn.style.color = '#ffffff';
            }
        } else {
            // Desk Nav Restores
            if (loginBtnNav) {
                loginBtnNav.innerText = 'Sign In';
                loginBtnNav.style.background = '';
            }
            if (signupBtnNav) {
                signupBtnNav.innerText = 'Sign Up';
                signupBtnNav.style.background = '';
                signupBtnNav.style.color = '';
            }
            // Mobile Nav Restores
            if (loginBtnNavMobile) {
                loginBtnNavMobile.innerText = 'Sign In';
            }
            if (signupBtnNavMobile) {
                signupBtnNavMobile.innerText = 'Sign Up';
            }
            // Program Action Buttons Gold Restores
            if (viewProgramBtn) {
                viewProgramBtn.style.background = '';
                viewProgramBtn.style.borderColor = '';
                viewProgramBtn.style.boxShadow = '';
                viewProgramBtn.style.color = '';
            }
            if (applyNowBtn) {
                applyNowBtn.style.background = '';
                applyNowBtn.style.borderColor = '';
                applyNowBtn.style.boxShadow = '';
                applyNowBtn.style.color = '';
            }
        }
    };

    // Initial Trigger
    updateAuthUI();

    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('authSubmitBtn');
            submitBtn.innerText = 'Processing...';
            
            setTimeout(() => {
                isLoggedIn = true;
                localStorage.setItem('isLoggedIn', 'true');
                closeModal();
                updateAuthUI();
                
                // If there's an action, we can load target page or let them click
                alert("Account verified! You can now access program details.");
            }, 1000);
        });
    }

    const handleActionClick = (e) => {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
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
    
    if (loginBtnNav) {
        loginBtnNav.addEventListener('click', () => {
            if (localStorage.getItem('isLoggedIn') === 'true') {
                window.location.href = 'html/dashboard.html';
            } else {
                if (!isLogin) toggleAuthMode();
                openModal();
            }
        });
    }
    
    if (signupBtnNav) {
        signupBtnNav.addEventListener('click', () => {
            if (localStorage.getItem('isLoggedIn') === 'true') {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('hasAccessToMastery');
                localStorage.removeItem('hasAccessToMentorship');
                location.reload();
            } else {
                if (isLogin) toggleAuthMode();
                openModal();
            }
        });
    }

    if (document.getElementById('joinBtn')) {
        document.getElementById('joinBtn').addEventListener('click', handleActionClick);
    }
    
    // Gated View Program Navigation
    if (document.getElementById('viewProgramBtn')) {
        document.getElementById('viewProgramBtn').addEventListener('click', (e) => {
            e.preventDefault();
            if (localStorage.getItem('isLoggedIn') === 'true') {
                window.location.href = 'html/mastery-program.html';
            } else {
                if (!isLogin) toggleAuthMode();
                openModal();
            }
        });
    }
    
    // Gated Apply Now Navigation
    if (document.getElementById('applyNowBtn')) {
        document.getElementById('applyNowBtn').addEventListener('click', (e) => {
            e.preventDefault();
            if (localStorage.getItem('isLoggedIn') === 'true') {
                window.location.href = 'html/pro-mentorship.html';
            } else {
                if (!isLogin) toggleAuthMode();
                openModal();
            }
        });
    }

    closeAuth.addEventListener('click', closeModal);
    switchAuth.addEventListener('click', toggleAuthMode);

    // Deep link redirect parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'true') {
        if (!isLogin) toggleAuthMode();
        openModal();
    }

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
    if (loginBtnNavMobile) {
        loginBtnNavMobile.addEventListener('click', () => {
            if (localStorage.getItem('isLoggedIn') === 'true') {
                window.location.href = 'html/dashboard.html';
            } else {
                if (!isLogin) toggleAuthMode();
                openModal();
            }
            mobileMenuDropdown.classList.remove('active');
        });
    }

    if (signupBtnNavMobile) {
        signupBtnNavMobile.addEventListener('click', () => {
            if (localStorage.getItem('isLoggedIn') === 'true') {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('hasAccessToMastery');
                localStorage.removeItem('hasAccessToMentorship');
                location.reload();
            } else {
                if (isLogin) toggleAuthMode();
                openModal();
            }
            mobileMenuDropdown.classList.remove('active');
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