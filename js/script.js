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
    let isSubmitting = false;

    const setAuthState = (state) => {
        authState = state;
        const passGroup = passwordInput ? passwordInput.closest('.input-group') : null;
        const loginMeta = document.getElementById('loginMeta');
        const emailInput = document.getElementById('emailInput');
        const emailGroup = emailInput ? emailInput.closest('.input-group') : null;

        if (state === 'login') {
            authTitle.innerText = 'Login Account';
            authSubtitle.innerHTML = "Don't Have an Account? <a href='javascript:void(0)' id='switchAuth'>Create Account</a>";
            if (signupFields) signupFields.style.display = 'none';
            if (emailGroup) emailGroup.style.display = 'block';
            if (emailInput) emailInput.required = true;
            if (passGroup) passGroup.style.display = 'block';
            if (passwordInput) passwordInput.required = true;
            if (loginMeta) loginMeta.style.display = 'block';
            authSubmitBtn.innerText = 'LOGIN NOW';
        } else if (state === 'signup') {
            authTitle.innerText = 'Create Account';
            authSubtitle.innerHTML = "Already Have an Account? <a href='javascript:void(0)' id='switchAuth'>Login Now</a>";
            if (signupFields) signupFields.style.display = 'block';
            if (emailGroup) emailGroup.style.display = 'block';
            if (emailInput) emailInput.required = true;
            if (passGroup) passGroup.style.display = 'block';
            if (passwordInput) passwordInput.required = true;
            if (loginMeta) loginMeta.style.display = 'none';
            authSubmitBtn.innerText = 'SIGN UP NOW';
        } else if (state === 'forgot') {
            authTitle.innerText = 'Reset Password';
            authSubtitle.innerHTML = "Remembered Password? <a href='javascript:void(0)' id='switchAuth'>Login Now</a>";
            if (signupFields) signupFields.style.display = 'none';
            if (emailGroup) emailGroup.style.display = 'block';
            if (emailInput) emailInput.required = true;
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
                if (selectedCourse === 'PrimeVerse Mastery Program' || selectedCourse === 'PrimeVerse Pro Mentorship') {
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
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (isSubmitting) return;
            isSubmitting = true;

            const submitBtn = document.getElementById('authSubmitBtn');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Processing...';
            submitBtn.disabled = true;

            const emailInput = document.getElementById('emailInput');
            const passwordInput = document.getElementById('passwordInput');
            const fullNameInput = document.getElementById('fullNameInput');
            const phoneInput = document.getElementById('phoneInput');
            const otpInput = document.getElementById('otpInput');

            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';
            const fullName = fullNameInput ? fullNameInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const otpToken = otpInput ? otpInput.value.trim() : '';

            // Obtain the Supabase client safely from window, falling back to local creation if needed
            const supabase = window.supabaseClient || (window.supabase ? window.supabase.createClient("https://sljcqcksrqzanyivtdld.supabase.co", "sb_publishable_0gsZlqZga8nHuyueFk_9pA_zjqH73dP") : null);

            if (!supabase) {
                showSnackbar("Supabase is not initialized. Please check connection.", "error");
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                return;
            }

            try {
                if (authState === 'forgot') {
                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: window.location.origin + '/index.html'
                    });

                    if (error) {
                        showSnackbar(error.message, "error");
                    } else {
                        showSnackbar("A password reset link has been sent to your email!", "success");
                        setAuthState('login');
                    }
                } else if (authState === 'signup') {
                    // Check if email already exists in profiles table
                    const { data: existingUser, error: checkError } = await supabase
                        .from('profiles')
                        .select('email')
                        .ilike('email', email)
                        .maybeSingle();

                    if (checkError) {
                        showSnackbar(checkError.message, "error");
                        return;
                    }

                    if (existingUser) {
                        showSnackbar("An account with this email already exists.", "error");
                        return;
                    }

                    // Insert the new user into profiles table
                    const { data, error } = await supabase
                        .from('profiles')
                        .insert([
                            {
                                full_name: fullName,
                                phone: phone,
                                email: email,
                                password: password,
                                enroll_date: new Date().toISOString(),
                                current_day: 1,
                                modules_completed: 0,
                                total_modules: 18,
                                program_progress: 0,
                                stage_title: 'Financial Market Foundations',
                                selected_course: ''
                            }
                        ])
                        .select();

                    if (error) {
                        showSnackbar(error.message, "error");
                    } else {
                        isLoggedIn = true;
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('userEmail', email);
                        localStorage.setItem('userName', fullName);
                        localStorage.setItem('userPhone', phone);
                        localStorage.setItem('lastLogin', new Date().toISOString());
                        localStorage.setItem('enrollDate', new Date().toISOString());
                        localStorage.setItem('selectedCourse', '');
                        
                        // Seed local storage with default database-driven progression metrics for a new user
                        localStorage.setItem('currentDay', 1);
                        localStorage.setItem('programProgress', 0);
                        localStorage.setItem('stageTitle', 'Financial Market Foundations');
                        localStorage.setItem('modulesCompleted', 0);
                        localStorage.setItem('totalModules', 18);
                        
                        closeModal();
                        updateAuthUI();
                        showSnackbar("Registration successful! Welcome to PrimeVerse.", "success");
                    }
                } else {
                    // Login state - verify credentials against profiles table
                    const { data: user, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .ilike('email', email)
                        .eq('password', password)
                        .maybeSingle();

                    if (error) {
                        showSnackbar(error.message, "error");
                    } else if (!user) {
                        showSnackbar("Invalid email or password.", "error");
                    } else {
                        isLoggedIn = true;
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('userEmail', user.email);
                        localStorage.setItem('userName', user.full_name);
                        if (user.phone) localStorage.setItem('userPhone', user.phone);
                        localStorage.setItem('lastLogin', new Date().toISOString());
                        localStorage.setItem('selectedCourse', user.selected_course || '');
                        
                        // Cache dynamic database-driven progression metrics
                        const cDay = user.current_day !== undefined && user.current_day !== null ? parseInt(user.current_day) : 1;
                        const mComp = user.modules_completed !== undefined && user.modules_completed !== null ? parseInt(user.modules_completed) : 0;
                        const tMod = user.total_modules !== undefined && user.total_modules !== null ? parseInt(user.total_modules) : 18;
                        let pProg = user.program_progress !== undefined && user.program_progress !== null ? parseInt(user.program_progress) : 0;
                        if (pProg === 0 && tMod > 0) {
                            pProg = Math.round((mComp / tMod) * 100);
                        }
                        const sTitle = user.stage_title || 'Financial Market Foundations';

                        localStorage.setItem('currentDay', cDay);
                        localStorage.setItem('programProgress', pProg);
                        localStorage.setItem('stageTitle', sTitle);
                        localStorage.setItem('modulesCompleted', mComp);
                        localStorage.setItem('totalModules', tMod);

                        // Parse and sync completed lessons from database
                        if (user.completed_lessons) {
                            const completedList = user.completed_lessons.split(',');
                            // Clean previous local markers
                            for (let d = 0; d <= 18; d++) {
                                localStorage.removeItem(`completed_day_${d}`);
                                for (let p = 1; p <= 3; p++) {
                                    localStorage.removeItem(`completed_day_${d}_part_${p}`);
                                }
                            }
                            // Populate new markers
                            completedList.forEach(key => {
                                if (key && key.trim()) {
                                    const cleanKey = key.trim();
                                    const parts = cleanKey.split('_part_');
                                    if (parts.length === 2) {
                                        const dNum = parseInt(parts[0].trim());
                                        const pNum = parseInt(parts[1].trim());
                                        localStorage.setItem(`completed_day_${dNum}_part_${pNum}`, 'true');
                                    }
                                }
                            });
                            // Re-evaluate days
                            const partsMap = {
                                0: 1, 1: 2, 2: 2, 3: 3, 4: 2, 5: 1, 6: 2, 7: 3, 8: 2, 9: 2, 10: 1, 11: 2, 12: 2, 13: 2, 14: 1, 15: 2, 16: 1, 17: 2, 18: 2
                            };
                            for (let d = 0; d <= 18; d++) {
                                const totalParts = partsMap[d] || 2;
                                let allCompleted = true;
                                for (let p = 1; p <= totalParts; p++) {
                                    if (localStorage.getItem(`completed_day_${d}_part_${p}`) !== 'true') {
                                        allCompleted = false;
                                        break;
                                    }
                                }
                                if (allCompleted) {
                                    localStorage.setItem(`completed_day_${d}`, 'true');
                                }
                            }
                        }
                        
                        // Load or default the enrollment date from Supabase
                        const finalEnrollDate = user.enroll_date || user.created_at || new Date().toISOString();
                        localStorage.setItem('enrollDate', finalEnrollDate);
                        
                        closeModal();
                        updateAuthUI();
                        showSnackbar("Welcome back to PrimeVerse!", "success");
                    }
                }
            } catch (err) {
                console.error("Auth error:", err);
                showSnackbar("Error: " + (err.message || err), "error");
            } finally {
                isSubmitting = false;
                submitBtn.innerText = authState === 'signup' ? 'SIGN UP NOW' : (authState === 'login' ? 'LOGIN NOW' : 'RESET PASSWORD');
                submitBtn.disabled = false;
            }
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
                if (selectedCourse) {
                    window.location.href = 'html/dashboard.html';
                }
            } else {
                setAuthState('login');
                openModal();
            }
        });
    }
    
    if (signupBtnNav) {
        signupBtnNav.addEventListener('click', async () => {
            if (localStorage.getItem('isLoggedIn') === 'true') {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('hasAccessToMastery');
                localStorage.removeItem('hasAccessToMentorship');
                localStorage.removeItem('selectedCourse');
                localStorage.removeItem('enrollDate');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userPhone');
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

    window.closeModalMentorship = async () => {
        if (mentorshipOverlay) {
            mentorshipOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }

        // When closing the mentorship modal, update selectedCourse to PrimeVerse Pro Mentorship
        // so that they can access the dashboard, and store it in their profile table in Supabase
        localStorage.setItem('selectedCourse', 'PrimeVerse Pro Mentorship');

        const userEmail = localStorage.getItem('userEmail');
        const supabase = window.supabaseClient || (window.supabase ? window.supabase.createClient("https://sljcqcksrqzanyivtdld.supabase.co", "sb_publishable_0gsZlqZga8nHuyueFk_9pA_zjqH73dP") : null);
        if (userEmail && supabase) {
            try {
                await supabase
                    .from('profiles')
                    .update({
                        selected_course: 'PrimeVerse Pro Mentorship'
                    })
                    .ilike('email', userEmail.trim());
                console.log("Successfully stored PrimeVerse Pro Mentorship in profile table on modal close!");
            } catch (err) {
                console.error("Error storing program in profile table on modal close:", err);
            }
        }

        // Redirect to dashboard
        window.location.href = 'html/dashboard.html';
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
                if (selectedCourse) {
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
        signupBtnNavMobile.addEventListener('click', async () => {
            if (localStorage.getItem('isLoggedIn') === 'true') {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('hasAccessToMastery');
                localStorage.removeItem('hasAccessToMentorship');
                localStorage.removeItem('selectedCourse');
                localStorage.removeItem('enrollDate');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userPhone');
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