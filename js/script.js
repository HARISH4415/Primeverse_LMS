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

    // --- Custom Snackbar Helper ---
    const showSnackbar = (message, type = 'success') => {
        let snackbar = document.getElementById('primeSnackbar');
        if (!snackbar) {
            snackbar = document.createElement('div');
            snackbar.id = 'primeSnackbar';
            snackbar.className = 'prime-snackbar';
            document.body.appendChild(snackbar);
        }

        const iconHTML = type === 'success' 
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:20px; height:20px; color:#D4AF37;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:20px; height:20px; color:#FF4D4D;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

        snackbar.innerHTML = `
            <div class="prime-snackbar-icon">${iconHTML}</div>
            <div class="prime-snackbar-message">${message}</div>
        `;

        // Trigger active state
        setTimeout(() => {
            snackbar.classList.add('active');
        }, 10);

        // Hide after 3 seconds
        setTimeout(() => {
            snackbar.classList.remove('active');
        }, 3000);
    };

    // --- Auth Modal Logic ---
    const authModal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeAuth = document.getElementById('closeAuth');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    const signupFields = document.getElementById('signupFields');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const togglePass = document.getElementById('togglePass');
    const passwordInput = document.getElementById('passwordInput');

    if (togglePass && passwordInput) {
        togglePass.addEventListener('click', () => {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            
            togglePass.innerHTML = isPassword ? '<i data-lucide="eye-off"></i>' : '<i data-lucide="eye"></i>';
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });
    }

    let authState = 'login'; // 'login', 'signup', 'forgot'

    const setAuthState = (state) => {
        authState = state;
        const passGroup = passwordInput ? passwordInput.closest('.input-group') : null;
        const loginMeta = document.getElementById('loginMeta');

        if (state === 'login') {
            authTitle.innerText = 'Login Account';
            authSubtitle.innerHTML = "Don't Have an Account? <a href='javascript:void(0)' id='switchAuth'>Create Account</a>";
            if (signupFields) signupFields.style.display = 'none';
            if (passGroup) passGroup.style.display = 'block';
            if (passwordInput) passwordInput.required = true;
            if (loginMeta) loginMeta.style.display = 'block';
            authSubmitBtn.innerText = 'LOGIN NOW';
        } else if (state === 'signup') {
            authTitle.innerText = 'Create Account';
            authSubtitle.innerHTML = "Already Have an Account? <a href='javascript:void(0)' id='switchAuth'>Login Now</a>";
            if (signupFields) signupFields.style.display = 'block';
            if (passGroup) passGroup.style.display = 'block';
            if (passwordInput) passwordInput.required = true;
            if (loginMeta) loginMeta.style.display = 'none';
            authSubmitBtn.innerText = 'SIGN UP NOW';
        } else if (state === 'forgot') {
            authTitle.innerText = 'Reset Password';
            authSubtitle.innerHTML = "Remembered Password? <a href='javascript:void(0)' id='switchAuth'>Login Now</a>";
            if (signupFields) signupFields.style.display = 'none';
            if (passGroup) passGroup.style.display = 'none';
            if (passwordInput) passwordInput.required = false;
            if (loginMeta) loginMeta.style.display = 'none';
            authSubmitBtn.innerText = 'RESET PASSWORD';
        }

        // Re-attach switch listener
        const switchBtn = document.getElementById('switchAuth');
        if (switchBtn) {
            switchBtn.addEventListener('click', () => {
                if (authState === 'forgot') {
                    setAuthState('login');
                } else if (authState === 'login') {
                    setAuthState('signup');
                } else {
                    setAuthState('login');
                }
            });
        }
    };

    const openModal = () => {
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        authModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    // --- Auth Form Logic ---
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    const loginBtnNav = document.getElementById('loginBtnNav');
    const signupBtnNav = document.getElementById('signupBtnNav');
    const loginBtnNavMobile = document.getElementById('loginBtnNavMobile');
    const signupBtnNavMobile = document.getElementById('signupBtnNavMobile');

    const updateAuthUI = () => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const hasPurchased = localStorage.getItem('selectedCourse') ? true : false;
        const selectedCourse = localStorage.getItem('selectedCourse');
        const viewProgramBtn = document.getElementById('viewProgramBtn');
        const applyNowBtn = document.getElementById('applyNowBtn');

        if (loggedIn) {
            // Desk Nav
            if (loginBtnNav) {
                if (hasPurchased) {
                    if (selectedCourse === 'PrimeVerse Pro Mentorship') {
                        loginBtnNav.innerText = 'PRO STATUS';
                    } else {
                        loginBtnNav.innerText = 'DASHBOARD';
                    }
                    loginBtnNav.style.display = 'inline-block';
                    loginBtnNav.style.background = 'rgba(255, 255, 255, 0.05)';
                } else {
                    loginBtnNav.style.display = 'none';
                }
            }
            if (signupBtnNav) {
                signupBtnNav.innerText = 'SIGN OUT';
                signupBtnNav.style.background = 'var(--gold)';
                signupBtnNav.style.color = '#000';
            }
            // Mobile Nav
            if (loginBtnNavMobile) {
                if (hasPurchased) {
                    if (selectedCourse === 'PrimeVerse Pro Mentorship') {
                        loginBtnNavMobile.innerText = 'PRO STATUS';
                    } else {
                        loginBtnNavMobile.innerText = 'DASHBOARD';
                    }
                    loginBtnNavMobile.style.display = 'block';
                } else {
                    loginBtnNavMobile.style.display = 'none';
                }
            }
            if (signupBtnNavMobile) {
                signupBtnNavMobile.innerText = 'SIGN OUT';
            }
            // Program Action Buttons Green Color
            if (viewProgramBtn) {
                if (selectedCourse === 'PrimeVerse Mastery Program') {
                    viewProgramBtn.innerText = 'ACTIVE';
                } else {
                    viewProgramBtn.innerText = 'View Program';
                }
                viewProgramBtn.style.background = '#28a745';
                viewProgramBtn.style.borderColor = '#28a745';
                viewProgramBtn.style.boxShadow = '0 0 25px rgba(40, 167, 69, 0.4)';
                viewProgramBtn.style.color = '#ffffff';
            }
            if (applyNowBtn) {
                if (selectedCourse === 'PrimeVerse Pro Mentorship') {
                    applyNowBtn.innerText = 'ACTIVE';
                } else {
                    applyNowBtn.innerText = 'Apply Now';
                }
                applyNowBtn.style.background = '#28a745';
                applyNowBtn.style.borderColor = '#28a745';
                applyNowBtn.style.boxShadow = '0 0 25px rgba(40, 167, 69, 0.4)';
                applyNowBtn.style.color = '#ffffff';
            }
        } else {
            // Desk Nav Restores
            if (loginBtnNav) {
                loginBtnNav.innerText = 'Sign In';
                loginBtnNav.style.display = 'inline-block';
                loginBtnNav.style.background = '';
            }
            if (signupBtnNav) {
                signupBtnNav.innerText = 'Sign Up';
                signupBtnNav.style.display = 'inline-block';
                signupBtnNav.style.background = '';
                signupBtnNav.style.color = '';
            }
            // Mobile Nav Restores
            if (loginBtnNavMobile) {
                loginBtnNavMobile.innerText = 'Sign In';
                loginBtnNavMobile.style.display = 'block';
            }
            if (signupBtnNavMobile) {
                signupBtnNavMobile.innerText = 'Sign Up';
                signupBtnNavMobile.style.display = 'block';
            }
            // Program Action Buttons Gold Restores
            if (viewProgramBtn) {
                viewProgramBtn.innerText = 'View Program';
                viewProgramBtn.style.background = '';
                viewProgramBtn.style.borderColor = '';
                viewProgramBtn.style.boxShadow = '';
                viewProgramBtn.style.color = '';
            }
            if (applyNowBtn) {
                applyNowBtn.innerText = 'Apply Now';
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
            
            const emailInput = authForm.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                localStorage.setItem('userEmail', emailInput.value);
            }

            const phoneInput = authForm.querySelector('input[type="tel"]');
            if (phoneInput && phoneInput.value) {
                localStorage.setItem('userPhone', phoneInput.value);
            }
            
            setTimeout(() => {
                if (authState === 'forgot') {
                    showSnackbar("A password reset link has been sent to your email!", "success");
                    setAuthState('login');
                } else {
                    isLoggedIn = true;
                    localStorage.setItem('isLoggedIn', 'true');
                    closeModal();
                    updateAuthUI();
                    showSnackbar("Account verified! Welcome back.", "success");
                }
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
        loginBtn.addEventListener('click', () => {
            setAuthState('login');
            openModal();
        });
    }
    
    if (loginBtnNav) {
        loginBtnNav.addEventListener('click', () => {
            if (localStorage.getItem('isLoggedIn') === 'true') {
                const selectedCourse = localStorage.getItem('selectedCourse');
                if (selectedCourse === 'PrimeVerse Pro Mentorship') {
                    openMentorshipModal();
                } else if (selectedCourse) {
                    window.location.href = 'html/dashboard.html';
                }
            } else {
                setAuthState('login');
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
                localStorage.removeItem('selectedCourse');
                localStorage.removeItem('enrollDate');
                location.reload();
            } else {
                setAuthState('signup');
                openModal();
            }
        });
    }

    if (document.getElementById('joinBtn')) {
        document.getElementById('joinBtn').addEventListener('click', (e) => {
            e.preventDefault();
            // Scroll to programs section on homepage so user can purchase
            const programsSection = document.getElementById('programs');
            if (programsSection) {
                programsSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                handleActionClick(e);
            }
        });
    }
    
    // Gated View Program Navigation
    if (document.getElementById('viewProgramBtn')) {
        document.getElementById('viewProgramBtn').addEventListener('click', (e) => {
            e.preventDefault();
            if (localStorage.getItem('isLoggedIn') === 'true') {
                if (localStorage.getItem('selectedCourse') === 'PrimeVerse Mastery Program') {
                    window.location.href = 'html/dashboard.html';
                } else {
                    window.location.href = 'html/mastery-program.html';
                }
            } else {
                setAuthState('login');
                openModal();
            }
        });
    }
    
    if (document.getElementById('applyNowBtn')) {
        document.getElementById('applyNowBtn').addEventListener('click', (e) => {
            e.preventDefault();
            if (localStorage.getItem('isLoggedIn') === 'true') {
                if (localStorage.getItem('selectedCourse') === 'PrimeVerse Pro Mentorship') {
                    openMentorshipModal();
                } else {
                    window.location.href = 'html/pro-mentorship.html';
                }
            } else {
                setAuthState('login');
                openModal();
            }
        });
    }

    closeAuth.addEventListener('click', closeModal);

    // --- Mentorship Onboarding Modal Event Listeners ---
    const mentorshipOverlay = document.getElementById('mentorshipModal');
    const closeMentorshipModal = document.getElementById('closeMentorshipModal');
    const closeMentorshipModalBtn = document.getElementById('closeMentorshipModalBtn');

    window.openMentorshipModal = () => {
        if (mentorshipOverlay) {
            mentorshipOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModalMentorship = () => {
        if (mentorshipOverlay) {
            mentorshipOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    if (closeMentorshipModal) {
        closeMentorshipModal.addEventListener('click', closeModalMentorship);
    }
    if (closeMentorshipModalBtn) {
        closeMentorshipModalBtn.addEventListener('click', closeModalMentorship);
    }
    if (mentorshipOverlay) {
        mentorshipOverlay.addEventListener('click', (e) => {
            if (e.target === mentorshipOverlay) closeModalMentorship();
        });
    }

    // Initial state setup for switchAuth and forgotLink
    setAuthState('login');
    const forgotLink = document.querySelector('.forgot-link');
    if (forgotLink) {
        forgotLink.addEventListener('click', () => {
            setAuthState('forgot');
        });
    }

    // Deep link redirect parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'true') {
        setAuthState('login');
        openModal();
    }
    if (urlParams.get('mentorshipModal') === 'true' && localStorage.getItem('isLoggedIn') === 'true') {
        openMentorshipModal();
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
                const selectedCourse = localStorage.getItem('selectedCourse');
                if (selectedCourse === 'PrimeVerse Pro Mentorship') {
                    openMentorshipModal();
                } else if (selectedCourse) {
                    window.location.href = 'html/dashboard.html';
                }
            } else {
                setAuthState('login');
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
                localStorage.removeItem('selectedCourse');
                localStorage.removeItem('enrollDate');
                location.reload();
            } else {
                setAuthState('signup');
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