/**
 * ═══════════════════════════════════════════════════════════
 * EcoHeritage AI - Core JavaScript (Hệ thống điều khiển v5.0)
 * ═══════════════════════════════════════════════════════════
 * Xử lý toàn bộ logic: CSDL LocalStorage, Auth, AQI Dashboard,
 * Tra cứu, Bản đồ GPS & Review, Achievements, Cổng Admin CRUD,
 * và Chatbot Lương Y số AI.
 */

$(document).ready(function () {
    // Cưỡng bức cuộn lên đầu trang khi tải/tải lại trang
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    $(window).on('beforeunload', function() {
        $(window).scrollTop(0);
    });
    // Hỗ trợ thêm cho các trình duyệt chậm tải
    setTimeout(function() {
        window.scrollTo(0, 0);
    }, 100);

    // ─── 1. KHỞI TẠO CSDL TRÊN LOCALSTORAGE (DATABASE SYNC & UPGRADE) ────
    const DEFAULT_HERB_IMAGE = './images/hero_vector.png';

    function readStorage(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (err) {
            localStorage.removeItem(key);
            return fallback;
        }
    }

    function writeStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function escapeHTML(value) {
        return String(value ?? '').replace(/[&<>"']/g, function (char) {
            return ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            })[char];
        });
    }

    function normalizeUser(user) {
        return {
            name: user?.name || 'Nguoi dung',
            email: user?.email || '',
            password: user?.password || '',
            role: user?.role || 'user',
            avatar: user?.avatar || '',
            saved: Array.isArray(user?.saved) ? user.saved : [],
            rated: Array.isArray(user?.rated) ? user.rated : [],
            lastLoginTime: user?.lastLoginTime || null
        };
    }

    function makeSeedReviews(region) {
        const total = Math.max(0, parseInt(region.reviewsCount || 0, 10));
        const rating = Math.max(1, Math.min(5, Math.round(region.rating || 5)));
        const names = ['Nguyen Minh Hung', 'Luong Y Cuong', 'Tran Bao Chau', 'Le An Nhien', 'Pham Gia Bao'];
        const comments = [
            'Dia diem sach, nhieu cay thuoc quy va thong tin bao ton ro rang.',
            'Khong gian de tham quan, phu hop tim hieu duoc lieu dia phuong.',
            'Vuon duoc lieu duoc cham soc tot, co gia tri giao duc cao.',
            'Can them bang chi dan tai cho nhung trai nghiem tong the rat on.',
            'Nguon cay thuoc phong phu, dang de dua vao hanh trinh suc khoe xanh.'
        ];

        return Array.from({ length: total }, function (_, index) {
            return {
                user: names[index % names.length],
                rating: index % 5 === 0 ? Math.max(4, rating - 1) : rating,
                comment: comments[index % comments.length]
            };
        });
    }

    async function hashPassword(password) {
        if (typeof password !== 'string') return '';
        if (/^[0-9a-fA-F]{64}$/.test(password)) {
            return password;
        }
        try {
            const msgBuffer = new TextEncoder().encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
            let hash = 0;
            for (let i = 0; i < password.length; i++) {
                const char = password.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return String(hash);
        }
    }

    function normalizeDB(rawDB) {
        const defaultData = JSON.parse(JSON.stringify(EcoHeritageDefaultData));
        const source = rawDB && typeof rawDB === 'object' ? rawDB : {};
        const normalized = {
            herbs: Array.isArray(source.herbs) ? source.herbs : defaultData.herbs,
            regions: Array.isArray(source.regions) ? source.regions : defaultData.regions
        };

        if (normalized.herbs.length === 0) normalized.herbs = defaultData.herbs;
        if (normalized.regions.length === 0) normalized.regions = defaultData.regions;

        normalized.herbs = normalized.herbs.map(function (herb, index) {
            const fallback = defaultData.herbs.find(h => h.id === herb.id) || defaultData.herbs[index] || {};
            return {
                ...fallback,
                ...herb,
                id: herb.id || fallback.id || ('h' + (index + 1)),
                image: herb.image || herb.fallbackImage || fallback.image || DEFAULT_HERB_IMAGE,
                fallbackImage: herb.fallbackImage || fallback.fallbackImage || DEFAULT_HERB_IMAGE
            };
        });

        normalized.regions = normalized.regions.map(function (region, index) {
            const fallback = defaultData.regions.find(r => r.id === region.id) || defaultData.regions[index] || {};
            const merged = {
                ...fallback,
                ...region,
                id: region.id || fallback.id || ('r' + (index + 1)),
                type: region.type || fallback.type || 'primary',
                herbs: Array.isArray(region.herbs) ? region.herbs : (fallback.herbs || []),
                coords: Array.isArray(region.coords) ? region.coords : (fallback.coords || [16.0544, 108.2022])
            };
            if (!Array.isArray(region.reviewsList)) {
                merged.reviewsList = makeSeedReviews(merged);
            } else {
                merged.reviewsList = region.reviewsList;
            }
            merged.reviewsCount = merged.reviewsList.length;
            if (merged.reviewsList.length > 0) {
                const sumRating = merged.reviewsList.reduce((sum, review) => sum + Number(review.rating || 5), 0);
                merged.rating = sumRating / merged.reviewsList.length;
            } else {
                merged.rating = 5.0;
            }
            return merged;
        });

        return normalized;
    }

    function getNextId(items, prefix) {
        const maxId = items.reduce(function (max, item) {
            const number = parseInt(String(item.id || '').replace(prefix, ''), 10);
            return Number.isFinite(number) ? Math.max(max, number) : max;
        }, 0);
        return prefix + (maxId + 1);
    }

    let db;
    const existingDB = readStorage('eco_heritage_db_v7', null);
    if (existingDB && Array.isArray(existingDB.herbs) && existingDB.herbs.length > 0) {
        // DB đã tồn tại và có dữ liệu — chỉ normalize mà KHÔNG ghi đè
        db = normalizeDB(existingDB);
        
        // Di trú (Upgrade) CSDL trong LocalStorage nếu thiếu trường source
        const needsUpgrade = db.herbs.some(h => {
            const defaultHerb = EcoHeritageDefaultData.herbs.find(dh => dh.id === h.id);
            return defaultHerb && defaultHerb.source && !h.source;
        });
        
        if (needsUpgrade) {
            db.herbs = db.herbs.map(h => {
                const defaultHerb = EcoHeritageDefaultData.herbs.find(dh => dh.id === h.id);
                if (defaultHerb && defaultHerb.source && !h.source) {
                    h.source = defaultHerb.source;
                }
                return h;
            });
            writeStorage('eco_heritage_db_v7', db);
        }
    } else {
        // Lần đầu hoặc DB rỗng — khởi tạo từ data.js và ghi lưu
        db = normalizeDB(null);
        writeStorage('eco_heritage_db_v7', db);
    }

    // Khởi tạo danh sách tài khoản người dùng toàn cục và tự động mã hóa mật khẩu
    (async function initPasswordsAndAccounts() {
        let accountsList = readStorage('eco_heritage_users', null);
        if (!accountsList || !Array.isArray(accountsList)) {
            accountsList = [
                { name: 'Nguyễn Minh Hùng', email: 'minhhung@vku.edu.vn', password: 'user123', role: 'user', saved: [], rated: [] },
                { name: 'Lương Y Cương', email: 'luongycuong@gmail.com', password: 'user123', role: 'user', saved: [], rated: [] },
                { name: 'Administrator', email: 'admin@gmail.com', password: 'admin123', role: 'admin', saved: [], rated: [] }
            ];
        }
        let listChanged = false;
        
        // Loại bỏ tài khoản trùng lặp theo email (không phân biệt hoa thường)
        const uniqueAccounts = [];
        const seenEmails = new Set();
        for (let user of accountsList) {
            const lowerEmail = (user.email || '').trim().toLowerCase();
            if (lowerEmail && !seenEmails.has(lowerEmail)) {
                seenEmails.add(lowerEmail);
                uniqueAccounts.push(user);
            } else {
                listChanged = true;
            }
        }
        accountsList = uniqueAccounts;

        for (let user of accountsList) {
            if (user.password && !/^[0-9a-fA-F]{64}$/.test(user.password)) {
                user.password = await hashPassword(user.password);
                listChanged = true;
            }
        }
        accountsList = accountsList.map(normalizeUser);
        if (listChanged || !localStorage.getItem('eco_heritage_users')) {
            writeStorage('eco_heritage_users', accountsList);
        }
        
        let currentUser = readStorage('gh_user', null);
        if (currentUser && currentUser.password && !/^[0-9a-fA-F]{64}$/.test(currentUser.password)) {
            currentUser.password = await hashPassword(currentUser.password);
            writeStorage('gh_user', currentUser);
        }
        checkAuthStatus();
    })();

    function saveDB() {
        writeStorage('eco_heritage_db_v7', db);
    }

    // Hàm helper đồng bộ hóa tài khoản đang đăng nhập với danh sách toàn cục
    function updateActiveUserSession(user) {
        user = normalizeUser(user);
        writeStorage('gh_user', user);
        let list = readStorage('eco_heritage_users', []) || [];
        const idx = list.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
        if (idx > -1) {
            list[idx] = user;
            writeStorage('eco_heritage_users', list);
        }
    }

    // ─── 2. AOS & PARTICLES NỀN CHUYỂN ĐỘNG ────────────────────
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 50 });
    }

    function createParticles() {
        const $container = $('#particles');
        if (!$container.length) return;
        const colors = ['#2eb366', '#12b886', '#748ffc', '#ffd43b', '#da77f2'];
        for (let i = 0; i < 20; i++) {
            const size = Math.random() * 6 + 3;
            $container.append(
                $('<div>').addClass('particle').css({
                    width: size,
                    height: size,
                    background: colors[Math.floor(Math.random() * colors.length)],
                    left: Math.random() * 100 + '%',
                    animationDuration: (Math.random() * 20 + 15) + 's',
                    animationDelay: (Math.random() * 10) + 's'
                })
            );
        }
    }
    createParticles();

    // ─── 3. STICKY NAVBAR & PROGRESS BAR ──────────────────────
    const $navbar = $('#mainNav');
    
    // Inject scroll progress bar dynamically if not present
    if (!$('#scrollProgressBar').length) {
        $('body').prepend('<div id="scrollProgressBar"></div>');
    }

    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 50) $navbar.addClass('scrolled');
        else $navbar.removeClass('scrolled');

        // Scroll Progress Bar Update
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        $('#scrollProgressBar').css('width', scrolled + '%');
    });

    // Auto active nav link highlights
    function autoSetActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        $('.navbar-nav .nav-link').each(function() {
            const href = $(this).attr('href');
            if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
                $('.navbar-nav .nav-link').removeClass('active');
                $(this).addClass('active');
            }
        });
    }

    // Dark Mode Toggle Logic
    function initDarkMode() {
        const saved = localStorage.getItem('eco_dark_mode') === 'true';
        if (saved) {
            $('html').addClass('dark-mode');
            $('#darkModeToggle i').removeClass('bi-moon-fill').addClass('bi-sun-fill');
        } else {
            $('html').removeClass('dark-mode');
            $('#darkModeToggle i').removeClass('bi-sun-fill').addClass('bi-moon-fill');
        }
        
        $('#darkModeToggle').on('click', function() {
            $('html').toggleClass('dark-mode');
            const isDark = $('html').hasClass('dark-mode');
            localStorage.setItem('eco_dark_mode', isDark);
            if (isDark) {
                $(this).find('i').removeClass('bi-moon-fill').addClass('bi-sun-fill');
            } else {
                $(this).find('i').removeClass('bi-sun-fill').addClass('bi-moon-fill');
            }
        });
    }

    // Hero stats counter & tagline typing animation
    function initHeroSection() {
        // Stats Counters
        $('[data-counter]').each(function() {
            const $el = $(this);
            const target = parseInt($el.data('counter'), 10);
            const suffix = $el.data('suffix') || ($el.text().includes('%') ? '%' : '+');
            $({ count: 0 }).animate({ count: target }, {
                duration: 1500,
                step: function() {
                    $el.text(Math.floor(this.count) + suffix);
                },
                complete: function() {
                    $el.text(target + suffix);
                }
            });
        });

        // Typing effect
        const $tagline = $('.hero-section p.lead');
        if ($tagline.length) {
            const originalText = $tagline.text().trim();
            $tagline.empty();
            let i = 0;
            function type() {
                if (i < originalText.length) {
                    $tagline.append(originalText.charAt(i));
                    i++;
                    setTimeout(type, 15);
                }
            }
            type();
        }
    }

    // Tự động đóng menu trên Mobile khi bấm Nav-link
    $('.navbar-nav .nav-link').on('click', function () {
        const navCollapse = document.getElementById('navbarNav');
        if (navCollapse && navCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse);
            bsCollapse.hide();
        }
    });

    // ─── 4. HỆ THỐNG THÔNG BÁO NỔI (TOAST NOTIFICATIONS) ───────
    function showToast(message, type = 'success') {
        const toastLiveExample = document.getElementById('liveToast');
        if (toastLiveExample) {
            $('#toastMessage').text(message);
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            
            toastLiveExample.className = 'toast align-items-center border-0 shadow-lg rounded-3 text-white';
            if (type === 'success') {
                toastLiveExample.classList.add('bg-success');
            } else if (type === 'error' || type === 'danger') {
                toastLiveExample.classList.add('bg-danger');
            } else if (type === 'warning') {
                toastLiveExample.classList.add('bg-warning', 'text-dark');
                toastLiveExample.classList.remove('text-white');
            } else {
                toastLiveExample.classList.add('bg-info');
            }
            toastBootstrap.show();
        } else {
            const $toast = $('#authToast');
            if (!$toast.length) return;
            $toast.empty().append('<i class="bi bi-info-circle-fill"></i> ').append(document.createTextNode(message)).removeClass('show success error').addClass(type);
            setTimeout(() => $toast.addClass('show'), 10);
            setTimeout(() => $toast.removeClass('show'), 3000);
        }
    }

    // ─── 5. PASSWORD EYE TOGGLE ────────────────────────────────
    $(document).on('click', '.password-toggle-btn', function () {
        const targetId = $(this).data('target');
        const $input = $('#' + targetId);
        const $icon = $(this).find('i');
        if ($input.attr('type') === 'password') {
            $input.attr('type', 'text');
            $icon.removeClass('bi-eye').addClass('bi-eye-slash');
        } else {
            $input.attr('type', 'password');
            $icon.removeClass('bi-eye-slash').addClass('bi-eye');
        }
    });

    // Helper kiểm tra email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ─── 6. HỆ THỐNG AUTH (LocalStorage gh_user) ────────────────
    function checkAuthStatus() {
        const user = readStorage('gh_user', null);
        if (user) {
            // Đã đăng nhập
            $('#desktopLoginBtn, #mobileLoginBtn').addClass('d-none');
            $('#desktopUserAvatar, #mobileUserBtnGroup').removeClass('d-none');
            
            // Cập nhật thông tin cho dropdown
            $('#dropdownUserName').text(user.name);
            $('#dropdownUserEmail').text(user.email);
            
            if (user.avatar) {
                $('#avatarImage, #avatarImageDropdown').attr('src', user.avatar).removeClass('d-none');
                $('#avatarInitials, #avatarInitialsDropdown').addClass('d-none');
            } else {
                $('#avatarImage, #avatarImageDropdown').addClass('d-none').attr('src', '');
                const initials = user.name.charAt(0).toUpperCase();
                $('#avatarInitials, #avatarInitialsDropdown').text(initials).removeClass('d-none');
            }
            
            // Nếu là tài khoản Admin
            if (user.email === 'admin@gmail.com' || user.role === 'admin') {
                user.role = 'admin'; // Bảo đảm đồng bộ
                writeStorage('gh_user', user);
                $('#navAdminLink, #desktopAdminBadge').removeClass('d-none');
            } else {
                $('#navAdminLink, #desktopAdminBadge').addClass('d-none');
            }
        } else {
            // Chưa đăng nhập
            $('#desktopLoginBtn, #mobileLoginBtn').removeClass('d-none');
            $('#desktopUserAvatar, #mobileUserBtnGroup').addClass('d-none');
            $('#navAdminLink, #desktopAdminBadge').addClass('d-none');
        }
    }

    // Reset Form Đăng nhập/Đăng ký khi đóng Modal
    $('#authModal').on('hidden.bs.modal', function () {
        $(this).find('form').each(function () { this.reset(); });
        $(this).find('.is-invalid').removeClass('is-invalid');
        $(this).find('.invalid-feedback').remove();
    });

    // Form Đăng ký
    $('#registerForm').on('submit', async function (e) {
        e.preventDefault();
        const name = $('#registerName').val().trim();
        const email = $('#registerEmail').val().trim();
        const password = $('#registerPassword').val();
        const confirm = $('#registerPasswordConfirm').val();

        if (name.length < 2) { showToast('Tên phải từ 2 ký tự trở lên!', 'error'); return; }
        if (!isValidEmail(email)) { showToast('Định dạng email không hợp lệ!', 'error'); return; }
        if (password.length < 6) { showToast('Mật khẩu tối thiểu 6 ký tự!', 'error'); return; }
        if (password !== confirm) { showToast('Xác nhận mật khẩu không khớp!', 'error'); return; }

        // Tải danh sách tài khoản toàn cục mới nhất
        let userList = readStorage('eco_heritage_users', []) || [];
        
        // Kiểm tra xem email đã được đăng ký chưa (không phân biệt hoa thường)
        const emailExists = userList.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (emailExists) {
            showToast('Email này đã được đăng ký sử dụng!', 'error');
            return;
        }

        // Khởi tạo tài khoản mới với mật khẩu băm
        const role = (email.toLowerCase() === 'admin@gmail.com') ? 'admin' : 'user';
        const hashedPassword = await hashPassword(password);
        const newUser = normalizeUser({ name, email, password: hashedPassword, role, saved: [], rated: [], lastLoginTime: Date.now() });
        
        // Thêm vào danh sách tài khoản toàn cục
        userList.push(newUser);
        writeStorage('eco_heritage_users', userList);
        
        // Lưu phiên đăng nhập
        writeStorage('gh_user', newUser);
        showToast('Đăng ký tài khoản thành công! 🎉', 'success');
        $('#authModal').modal('hide');
        
        checkAuthStatus();
        unlockAchievement('badge-system-admin'); // Kiểm tra phân quyền vua y học nếu là admin
        
        // Load lại trang sau 1 giây
        setTimeout(() => { location.reload(); }, 1000);
    });

    // Form Đăng nhập
    $('#loginForm').on('submit', async function (e) {
        e.preventDefault();
        const email = $('#loginEmail').val().trim();
        const password = $('#loginPassword').val();

        if (!isValidEmail(email)) { showToast('Vui lòng nhập email hợp lệ!', 'error'); return; }
        
        const hashedPassword = await hashPassword(password);
        const adminHashed = await hashPassword('admin123');
        
        // Mock tài khoản Admin mặc định
        if (email.toLowerCase() === 'admin@gmail.com' && hashedPassword === adminHashed) {
            let adminList = readStorage('eco_heritage_users', []) || [];
            let adminUser = adminList.find(u => u.email.toLowerCase() === 'admin@gmail.com');
            if (!adminUser) {
                adminUser = normalizeUser({ name: 'Administrator', email: 'admin@gmail.com', password: hashedPassword, role: 'admin', saved: [], rated: [], lastLoginTime: Date.now() });
                adminList.unshift(adminUser);
            } else {
                adminUser.lastLoginTime = Date.now();
                adminUser.password = hashedPassword;
                adminUser = normalizeUser(adminUser);
            }
            writeStorage('eco_heritage_users', adminList);
            writeStorage('gh_user', adminUser);
            showToast('Đăng nhập quản trị thành công! 👑', 'success');
            $('#authModal').modal('hide');
            checkAuthStatus();
            setTimeout(() => { location.reload(); }, 1000);
            return;
        }

        // Kiểm tra tài khoản trong danh sách toàn cục (không phân biệt hoa thường)
        let userList = readStorage('eco_heritage_users', []) || [];
        const user = userList.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
            showToast('Tài khoản không tồn tại! Vui lòng Đăng ký.', 'error');
            return;
        }
        if (user.password !== hashedPassword) {
            showToast('Mật khẩu không chính xác!', 'error');
            return;
        }

        // Lưu phiên đăng nhập
        user.lastLoginTime = Date.now();
        writeStorage('gh_user', normalizeUser(user));
        showToast('Đăng nhập thành công! Xin chào ' + user.name + ' 👋', 'success');
        $('#authModal').modal('hide');
        checkAuthStatus();
        setTimeout(() => { location.reload(); }, 1000);
    });

    // Sự kiện Đăng nhập bằng Google
    $(document).on('click', '#googleLoginBtn', function () {
        let userList = readStorage('eco_heritage_users', []) || [];
        const googleEmail = 'google.user@gmail.com';
        let googleUser = userList.find(u => u.email.toLowerCase() === googleEmail.toLowerCase());
        
        if (!googleUser) {
            googleUser = normalizeUser({
                name: 'Google User',
                email: googleEmail,
                password: '',
                role: 'user',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
                saved: [],
                rated: [],
                lastLoginTime: Date.now()
            });
            userList.push(googleUser);
            writeStorage('eco_heritage_users', userList);
        }
        
        googleUser.lastLoginTime = Date.now();
        writeStorage('gh_user', googleUser);
        showToast('Đăng nhập Google (Demo) thành công! 🎉', 'success');
        $('#authModal').modal('hide');
        checkAuthStatus();
        setTimeout(() => { location.reload(); }, 1000);
    });

    // Sự kiện Quên mật khẩu
    $(document).on('click', '#forgotPasswordLink', function (e) {
        e.preventDefault();
        const email = prompt('Nhập email tài khoản của bạn để khôi phục mật khẩu:');
        if (email === null) return;
        
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            showToast('Email không được để trống!', 'error');
            return;
        }

        let userList = readStorage('eco_heritage_users', []) || [];
        const userIndex = userList.findIndex(u => u.email.toLowerCase() === trimmedEmail.toLowerCase());
        
        if (userIndex === -1) {
            if (trimmedEmail.toLowerCase() === 'admin@gmail.com') {
                const newPassword = prompt('Tài khoản quản trị viên tìm thấy. Nhập mật khẩu mới cho admin@gmail.com (tối thiểu 6 ký tự):');
                if (!newPassword) return;
                if (newPassword.trim().length < 6) {
                    showToast('Mật khẩu tối thiểu phải từ 6 ký tự!', 'error');
                    return;
                }
                hashPassword(newPassword.trim()).then(hashed => {
                    const adminUser = normalizeUser({
                        name: 'Administrator',
                        email: 'admin@gmail.com',
                        password: hashed,
                        role: 'admin',
                        saved: [],
                        rated: [],
                        lastLoginTime: Date.now()
                    });
                    userList.push(adminUser);
                    writeStorage('eco_heritage_users', userList);
                    showToast('Đặt lại mật khẩu Admin thành công! 👑', 'success');
                });
                return;
            }
            showToast('Tài khoản email này chưa được đăng ký!', 'error');
            return;
        }

        const newPassword = prompt('Tài khoản hợp lệ! Vui lòng nhập mật khẩu mới (tối thiểu 6 ký tự):');
        if (newPassword === null) return;
        
        const trimmedPassword = newPassword.trim();
        if (trimmedPassword.length < 6) {
            showToast('Mật khẩu tối thiểu phải từ 6 ký tự!', 'error');
            return;
        }

        hashPassword(trimmedPassword).then(hashedPassword => {
            userList[userIndex].password = hashedPassword;
            writeStorage('eco_heritage_users', userList);
            showToast('Khôi phục mật khẩu thành công! Vui lòng đăng nhập lại.', 'success');
        });
    });

    // ─── 7. DASHBOARD MÔI TRƯỜNG — TỌA ĐỘ CỐ ĐỊNH ĐÀ NẴNG ─────
    // Luôn sử dụng tọa độ Đà Nẵng cố định cho API thời tiết
    function getUserLocation() {
        return { lat: 16.0678, lon: 108.2208, name: 'Đà Nẵng' };
    }

    // Sự kiện Đăng xuất
    $(document).on('click', '#logoutBtn, #profileLogoutBtnMain, #mobileLogoutBtn, #dropdownLogoutBtn', function () {
        localStorage.removeItem('gh_user');
        showToast('Đã đăng xuất tài khoản thành công.', 'success');
        checkAuthStatus();
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    });


    async function initWeatherDashboard() {
        if (!$('#aqi-dashboard').length) return;

        let aqiVal, tempVal, humidityVal, uvVal, windVal;
        let isLive = false;

        const coords = await getUserLocation();
        const lat = coords.lat;
        const lon = coords.lon;
        const locationName = coords.name;

        try {
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=uv_index_max&timezone=Asia/Bangkok`;
            const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`;

            const [weatherRes, aqiRes] = await Promise.all([
                fetch(weatherUrl).then(res => { if (!res.ok) throw new Error('Weather API error'); return res.json(); }),
                fetch(aqiUrl).then(res => { if (!res.ok) throw new Error('AQI API error'); return res.json(); })
            ]);

            if (weatherRes && weatherRes.current) {
                tempVal = Math.round(weatherRes.current.temperature_2m);
                humidityVal = Math.round(weatherRes.current.relative_humidity_2m);
                windVal = Math.round(weatherRes.current.wind_speed_10m);
                
                if (weatherRes.daily && Array.isArray(weatherRes.daily.uv_index_max) && weatherRes.daily.uv_index_max.length > 0) {
                    uvVal = weatherRes.daily.uv_index_max[0];
                } else {
                    uvVal = 3.5;
                }
                isLive = true;
            }

            if (aqiRes && aqiRes.current) {
                aqiVal = Math.round(aqiRes.current.us_aqi);
                isLive = true;
            }
        } catch (error) {
            console.warn('Không thể tải dữ liệu thời tiết live API, chuyển sang dữ liệu lịch sử.', error);
        }

        // Nếu API lỗi hoặc thiếu dữ liệu, dùng trị số tĩnh trung bình của Đà Nẵng làm fallback
        if (aqiVal === undefined) aqiVal = 45; 
        if (tempVal === undefined) tempVal = 28;
        if (humidityVal === undefined) humidityVal = 78;
        if (uvVal === undefined) uvVal = 3.5;
        if (windVal === undefined) windVal = 12;

        // Cập nhật tên địa phương lên tiêu đề trạm
        if ($('#weatherLocationName').length) {
            $('#weatherLocationName').text(locationName);
        }
        $('#headerTemp').text(`${tempVal}°C`);
        $('#aqiValue').text(aqiVal);
        $('#weatherUV').text(uvVal);
        $('#weatherHumidity').text(`${humidityVal}%`);
        
        // 1. Phân cấp 6 mức độ AQI (theo chuẩn EPA)
        let aqiStatusText = 'Tốt';
        let aqiClass = 'success';
        let aqiAdviceText = 'Không khí sạch trong lành. Thích hợp gieo trồng và hái dược liệu.';
        let dynamicAqiTitle = 'KHÔNG KHÍ TỐT';
        let dynamicAqiDesc = `Chỉ số chất lượng không khí US AQI hiện tại là ${aqiVal} (Tốt). Thích hợp tối đa cho các hoạt động ngoài trời và thu hoạch dược liệu sạch.`;
        let dynamicAqiBorder = 'rgba(16, 185, 129, 0.4)';
        let dynamicAqiIconColor = '#10b981';
        let dynamicAqiIcon = 'bi-shield-fill-check';
        
        if (aqiVal <= 50) {
            aqiStatusText = 'Tốt';
            aqiClass = 'success';
            aqiAdviceText = 'Không khí trong lành, sạch sẽ. Phế khí thông suốt, hô hấp tự nhiên.';
        } else if (aqiVal <= 100) {
            aqiStatusText = 'Vừa phải';
            aqiClass = 'warning';
            aqiAdviceText = 'Chất lượng vừa phải. Tà khí nhẹ xuất hiện, người nhạy cảm nên lưu ý.';
            dynamicAqiTitle = 'KHÔNG KHÍ VỪA PHẢI';
            dynamicAqiDesc = `Chỉ số US AQI hiện tại là ${aqiVal} (Chấp nhận được). Người nhạy cảm với bụi mịn PM2.5 nên lưu ý khi di chuyển bên ngoài.`;
            dynamicAqiBorder = 'rgba(245, 158, 11, 0.4)';
            dynamicAqiIconColor = '#f59e0b';
            dynamicAqiIcon = 'bi-exclamation-triangle-fill';
        } else if (aqiVal <= 150) {
            aqiStatusText = 'Kém (Nhạy cảm)';
            aqiClass = 'warning';
            aqiAdviceText = 'Kém cho nhóm nhạy cảm. Phong trần làm tổn thương phế âm, ngứa họng.';
            dynamicAqiTitle = 'KHÔNG KHÍ KÉM CHO NHÓM NHẠY CẢM';
            dynamicAqiDesc = `Chỉ số US AQI là ${aqiVal}. Nhóm người nhạy cảm (hen suyễn, người già) nên giảm bớt hoạt động mạnh ngoài trời.`;
            dynamicAqiBorder = 'rgba(249, 115, 22, 0.4)';
            dynamicAqiIconColor = '#f97316';
            dynamicAqiIcon = 'bi-exclamation-octagon-fill';
        } else if (aqiVal <= 200) {
            aqiStatusText = 'Xấu';
            aqiClass = 'danger';
            aqiAdviceText = 'Không khí xấu, ô nhiễm. Mật độ PM2.5 cao, tà độc tích tụ phổi dễ gây ho.';
            dynamicAqiTitle = 'CẢNH BÁO KHÔNG KHÍ KÉM / XẤU';
            dynamicAqiDesc = `Chỉ số US AQI là ${aqiVal} (Không tốt cho sức khỏe). Khuyến nghị mọi người nên mang khẩu trang khi ra ngoài.`;
            dynamicAqiBorder = 'rgba(239, 68, 68, 0.5)';
            dynamicAqiIconColor = '#ef4444';
            dynamicAqiIcon = 'bi-shield-fill-exclamation';
        } else if (aqiVal <= 300) {
            aqiStatusText = 'Rất xấu';
            aqiClass = 'danger';
            aqiAdviceText = 'Ô nhiễm rất nghiêm trọng. Táo độc tà xâm nhập sâu phế phủ, hạn chế ra ngoài.';
            dynamicAqiTitle = 'CẢNH BÁO KHÔNG KHÍ RẤT XẤU';
            dynamicAqiDesc = `Chỉ số US AQI cực cao ${aqiVal}. Cảnh báo sức khỏe khẩn cấp, người dân nên ở nhà và đóng kín các cửa sổ hướng gió bụi.`;
            dynamicAqiBorder = 'rgba(168, 85, 247, 0.6)';
            dynamicAqiIconColor = '#a855f7';
            dynamicAqiIcon = 'bi-x-octagon-fill';
        } else {
            aqiStatusText = 'Nguy hại';
            aqiClass = 'danger';
            aqiAdviceText = 'Mức ô nhiễm khẩn cấp nguy hại. Phế âm hư tổn nặng, tà độc tàn phá cơ thể.';
            dynamicAqiTitle = 'TÌNH TRẠNG KHÔNG KHÍ NGUY HẠI';
            dynamicAqiDesc = `Chỉ số US AQI nguy hại ${aqiVal}. Tuyệt đối không tập thể dục ngoài trời, sử dụng máy lọc khí tối đa.`;
            dynamicAqiBorder = 'rgba(120, 113, 108, 0.8)';
            dynamicAqiIconColor = '#78716c';
            dynamicAqiIcon = 'bi-skull';
        }

        const $aqiBadge = $('#aqiBadge');
        if ($aqiBadge.length) {
            $aqiBadge.text(aqiStatusText).removeClass('success warning danger').addClass(aqiClass === 'success' ? 'success' : (aqiClass === 'warning' ? 'warning' : 'danger'));
        }

        // 2. Phân cấp 5 mức độ UV (theo chuẩn WHO)
        const uvNum = parseFloat(uvVal);
        let uvStatusText = 'An toàn';
        let uvClass = 'success';
        if (uvNum < 3) {
            uvStatusText = 'Thấp';
            uvClass = 'success';
        } else if (uvNum < 6) {
            uvStatusText = 'Trung bình';
            uvClass = 'success';
        } else if (uvNum < 8) {
            uvStatusText = 'Cao';
            uvClass = 'warning';
        } else if (uvNum < 11) {
            uvStatusText = 'Rất cao';
            uvClass = 'danger';
        } else {
            uvStatusText = 'Cực nguy hại';
            uvClass = 'danger';
        }
        const $uvBadge = $('#uvBadge');
        if ($uvBadge.length) {
            $uvBadge.text(uvStatusText).removeClass('success warning danger').addClass(uvClass);
        }

        // 3. Phân cấp 3 mức độ Độ ẩm
        let humidityStatusText = 'Ổn định';
        let humidityClass = 'success';
        if (humidityVal < 40) {
            humidityStatusText = 'Khô hanh';
            humidityClass = 'warning';
        } else if (humidityVal <= 80) {
            humidityStatusText = 'Cân bằng';
            humidityClass = 'success';
        } else {
            humidityStatusText = 'Ẩm ướt';
            humidityClass = 'danger';
        }
        const $humidityBadge = $('#humidityBadge');
        if ($humidityBadge.length) {
            $humidityBadge.text(humidityStatusText).removeClass('success warning danger').addClass(humidityClass);
        }

        // 4. Phân cấp 3 mức độ Gió
        let windStatusText = 'Tốt';
        let windClass = 'success';
        if (windVal < 10) {
            windStatusText = 'Gió nhẹ';
            windClass = 'success';
            $('#weatherWind').text('Gió nhẹ');
        } else if (windVal <= 20) {
            windStatusText = 'Gió mát';
            windClass = 'success';
            $('#weatherWind').text('Gió mát');
        } else {
            windStatusText = 'Gió lớn';
            windClass = 'warning';
            $('#weatherWind').text('Gió mạnh');
        }
        const $windBadge = $('#windBadge');
        if ($windBadge.length) {
            $windBadge.text(windStatusText).removeClass('success warning danger').addClass(windClass);
        }

        // 5. Cẩm nang Gợi ý sức khỏe Đông y ứng với từng chỉ số (đáp ứng click thời gian thực)
        let aqiAdvices = {};
        if (aqiVal <= 50) {
            aqiAdvices = {
                title: `Chỉ Dẫn Đông Y: Chất lượng Không Khí Tốt (${aqiVal} AQI)`,
                icon: 'bi-shield-fill-check text-success',
                yly: 'Chất lượng không khí trong lành, sạch sẽ. Phế khí (phổi) thông suốt, hô hấp tự nhiên, giúp dưỡng sinh đại bổ khí huyết.',
                baoche: 'Đây là điều kiện thời tiết lý tưởng nhất để thu hoạch các loài thảo dược, đặc biệt là phần lá và hoa vốn cần độ tinh sạch tối đa. Phơi thuốc ngoài trời giúp thu trọn tinh hoa mặt trời mà không sợ nhiễm tạp chất.',
                tra: 'Trà hoa cúc mật ong giúp nhuận phế dưỡng gan, thanh lọc nhẹ nhàng.'
            };
        } else if (aqiVal <= 100) {
            aqiAdvices = {
                title: `Chỉ Dẫn Đông Y: Chất lượng Không Khí Vừa Phải (${aqiVal} AQI)`,
                icon: 'bi-exclamation-triangle-fill text-warning',
                yly: 'Chất lượng không khí chấp nhận được, có lượng bụi mịn nhỏ. Táo tà hoặc tà khí nhẹ bắt đầu xuất hiện trong khí quyển, người nhạy cảm dễ hắt hơi, ho nhẹ.',
                baoche: 'Vẫn thích hợp thu hái dược liệu ở vùng cao thoáng khí. Tuy nhiên, tuyệt đối không phơi dược liệu gần các mặt đường lớn, khu dân cư đông đúc để tránh bụi bám vào dược chất.',
                tra: 'Trà tía tô gừng ấm giúp phát tán phong hàn, bảo vệ phế vị.'
            };
        } else if (aqiVal <= 150) {
            aqiAdvices = {
                title: `Chỉ Dẫn Đông Y: Không Khí Kém Cho Nhóm Nhạy Cảm (${aqiVal} AQI)`,
                icon: 'bi-exclamation-octagon-fill text-warning',
                yly: 'Bụi mịn tích tụ nhẹ. Táo tà kết hợp phong trần dễ làm tổn thương phế âm, gây kích ứng niêm mạc mũi họng, khô da và khó chịu đường hô hấp.',
                baoche: 'Khi phơi dược liệu ngoài trời, nên che một lớp vải mùng mỏng để ngăn bụi mịn bám trực tiếp lên bề mặt lá. Kiểm tra kỹ tạp chất trước khi tiến hành sơ chế.',
                tra: 'Trà mạch môn đông và sinh địa giúp dưỡng âm thanh phế, sinh tân dịch cực hiệu quả.'
            };
        } else if (aqiVal <= 200) {
            aqiAdvices = {
                title: `Chỉ Dẫn Đông Y: Không Khí Xấu / Kém (${aqiVal} AQI)`,
                icon: 'bi-shield-fill-exclamation text-danger',
                yly: 'Mật độ bụi mịn PM2.5 cao. Nhiệt độc tích tụ trong phế quản, dễ sinh đờm vàng, ngứa họng, suy giảm đề kháng hô hấp.',
                baoche: 'Khuyến nghị tạm ngừng các hoạt động thu hoạch thảo dược ngoài trời. Dược liệu đang phơi nên được đem vào phòng sấy hoặc nơi kín gió để bảo toàn dược tính.',
                tra: 'Trà sâm cát cánh cam thảo sắc uống ấm giúp tuyên phế, hóa đờm, lợi hầu họng.'
            };
        } else if (aqiVal <= 300) {
            aqiAdvices = {
                title: `Chỉ Dẫn Đông Y: Không Khí Rất Xấu (${aqiVal} AQI)`,
                icon: 'bi-x-octagon-fill text-danger',
                yly: 'Không khí ô nhiễm nghiêm trọng. Táo độc tà xâm nhập sâu vào phế phủ, dễ gây khó thở, ảnh hưởng nghiêm trọng đến cả tim mạch và hô hấp.',
                baoche: 'Tuyệt đối không phơi dược liệu ngoài trời. Cất giữ dược liệu khô vào hũ thủy tinh đậy kín có gói hút ẩm để ngăn chặn ô nhiễm chéo từ không khí bên ngoài.',
                tra: 'Trà sa sâm mạch môn nhuận phế, thanh nhiệt lọc bụi phổi và bảo dưỡng cơ thể.'
            };
        } else {
            aqiAdvices = {
                title: `Chỉ Dẫn Đông Y: Không Khí Nguy Hại Khẩn Cấp (${aqiVal} AQI)`,
                icon: 'bi-skull text-danger',
                yly: 'Mức ô nhiễm khẩn cấp. Phế âm bị tổn thương nặng nề, tà độc công phá cơ thể. Cần ở trong nhà đóng kín cửa và bật máy lọc không khí.',
                baoche: 'Ngừng mọi hoạt động chế biến, phơi sấy hay thu hái ngoài trời. Đóng chặt cửa kho dược liệu để tránh khói bụi ô nhiễm làm suy giảm chất lượng các vị thuốc.',
                tra: 'Sử dụng bài thuốc sắc Thanh phế Giải độc thang (Mạch môn 12g, Sa sâm 12g, Bách hợp 8g, Cát cánh 6g) sắc uống ấm.'
            };
        }

        let uvAdvices = {};
        if (uvNum < 3) {
            uvAdvices = {
                title: `Chỉ Dẫn Đông Y: Chỉ Số UV Thấp (${uvVal} UV)`,
                icon: 'bi-sun-fill text-success',
                yly: 'Dương quang dịu nhẹ, âm dương hài hòa. Thích hợp cho các hoạt động ngoài trời, rèn luyện thân thể.',
                baoche: 'Nắng yếu không đủ cường độ để làm khô dược liệu tự nhiên nhanh chóng. Khuyên dùng máy sấy nhiệt độ thấp hoặc phơi kết hợp hong gió lớn để tránh nấm mốc phát triển.',
                tra: 'Trà kỷ tử hồng táo bổ khí huyết, làm ấm cơ thể nhẹ nhàng.'
            };
        } else if (uvNum < 6) {
            uvAdvices = {
                title: `Chỉ Dẫn Đông Y: Chỉ Số UV Trung Bình (${uvVal} UV)`,
                icon: 'bi-sun-fill text-success',
                yly: 'Nắng ấm vừa phải, thúc đẩy dương khí lưu thông, kích thích cơ thể tổng hợp vitamin D tự nhiên tốt cho gân xương.',
                baoche: 'Thời điểm tốt nhất để áp dụng phương pháp "Phơi âm can" (phơi dược liệu nhiều tinh dầu như ngải cứu, bạc hà, bồ công anh dưới bóng râm thoáng gió) giúp giữ hoạt chất tối đa.',
                tra: 'Trà sâm bí đao hoa cúc thanh mát, làm mát da dẻ và hạ nhiệt cơ thể.'
            };
        } else if (uvNum < 8) {
            uvAdvices = {
                title: `Chỉ Dẫn Đông Y: Chỉ Số UV Cao (${uvVal} UV)`,
                icon: 'bi-sun-fill text-warning',
                yly: 'Dương hỏa vượng, dễ tổn hao tân dịch (nước trong cơ thể) qua mồ hôi. Đi nắng nhiều dễ sạm da, nóng trong người.',
                baoche: 'Thích hợp phơi khô nhanh các vị thuốc thân gỗ cứng hoặc rễ củ nhiều nước (như đinh lăng cắt lát, ba kích, hoài sơn). Đội nón bảo hộ khi chăm sóc vườn dược liệu.',
                tra: 'Trà hoa cúc bạc hà thanh nhiệt thử, làm mát phế âm và dịu cơn khát.'
            };
        } else if (uvNum < 11) {
            uvAdvices = {
                title: `Chỉ Dẫn Đông Y: Chỉ Số UV Rất Cao (${uvVal} UV)`,
                icon: 'bi-exclamation-triangle-fill text-danger',
                yly: 'Thử độc thịnh hành, dễ gây say nắng (trúng thử), kiệt sức do mất nước. Tránh ra nắng trực tiếp quá 20 phút.',
                baoche: 'Tránh đi rừng hái thuốc vào khung giờ 11h - 15h. Cần tưới nước giữ ẩm đầy đủ cho vườn ươm thuốc non và che lưới đen lan cản nắng bớt.',
                tra: 'Nước đậu đen xanh lòng rang giúp thanh thử nhiệt, giải độc và bù nước cho cơ thể nhanh chóng.'
            };
        } else {
            uvAdvices = {
                title: `Chỉ Dẫn Đông Y: Chỉ Số UV Cực Độ Nguy Hại (${uvVal} UV)`,
                icon: 'bi-shield-fill-x text-danger',
                yly: 'Hỏa độc cực độ thiêu đốt tế bào. Nguy cơ bỏng da, say nắng nặng. Tuyệt đối không ra ngoài nắng gắt.',
                baoche: 'Thu dọn ngay dược liệu đã phơi khô vào kho mát bảo quản kẻo nắng gắt phân hủy cấu trúc tinh dầu thảo dược. Che chắn kín cho các cây thuốc ưa bóng râm.',
                tra: 'Nước sâm lục vị hoặc chè dưỡng nhan tuyết yến làm mát tế bào, sinh tân dịch.'
            };
        }

        let humidityAdvices = {};
        if (humidityVal < 40) {
            humidityAdvices = {
                title: `Chỉ Dẫn Đông Y: Độ Ẩm Khô Hanh (${humidityVal}%)`,
                icon: 'bi-droplet-half text-warning',
                yly: 'Táo tà làm khô ráo quá mức niêm mạc hô hấp, dễ gây khô cổ họng, nứt nẻ môi và khô da.',
                baoche: 'Độ ẩm không khí rất thấp giúp dược liệu khô cực nhanh, không lo ẩm mốc. Đây là điều kiện vàng để đóng gói bảo quan thuốc đông y vào bình kín hút chân không.',
                tra: 'Trà hoa hồng khô mật ong hoặc trà râu ngô sinh địa giúp dưỡng ẩm nhuận phế.'
            };
        } else if (humidityVal <= 80) {
            humidityAdvices = {
                title: `Chỉ Dẫn Đông Y: Độ Ẩm Cân Bằng (${humidityVal}%)`,
                icon: 'bi-droplet-fill text-success',
                yly: 'Khí hậu ôn hòa, cơ thể dễ dàng cân bằng nước và năng lượng. Tinh thần phấn chấn.',
                baoche: 'Cây thảo dược sinh trưởng tốt. Đây là thời điểm thích hợp nhất để cắt cành nhân giống, tỉa bớt lá sâu và chăm bón đất hữu cơ cho cây thuốc.',
                tra: 'Trà tâm sen hoa lài giúp định tâm an thần, thư thái đầu óc.'
            };
        } else {
            humidityAdvices = {
                title: `Chỉ Dẫn Đông Y: Độ Ẩm Quá Cao - Nồm Ẩm (${humidityVal}%)`,
                icon: 'bi-cloud-rain-fill text-danger',
                yly: 'Thấp tà ngưng trệ khiến tỳ vị kém tiêu hóa, gây nặng nề cơ thể, người có bệnh khớp dễ bị đau nhức ê ẩm.',
                baoche: 'Nguy cơ nấm mốc cực cao cho dược liệu bảo quản. Tuyệt đối không phơi thuốc. Cần bật máy hút ẩm kho bảo quản hoặc đem dược liệu sấy điện khô ngay.',
                tra: 'Trà ngải cứu khô hoặc trà lá lốt gừng tươi ấm giúp phát tán phong thấp, giảm đau khớp xương.'
            };
        }

        let windAdvices = {};
        if (windVal < 10) {
            windAdvices = {
                title: `Chỉ Dẫn Đông Y: Tốc Độ Gió Nhẹ (${windVal} km/h)`,
                icon: 'bi-wind text-success',
                yly: 'Không khí yên ả, ít lưu chuyển tà khí phong trần. Phù hợp thư giãn trong nhà.',
                baoche: 'Không khí đọng nhẹ giữ đất vườn dược liệu không bị khô hanh quá nhanh, rất tốt để gieo hạt giống thảo dược và tưới phun sương nhẹ.',
                tra: 'Trà gừng mật ong sảng khoái phế khí và giữ ấm lồng ngực.'
            };
        } else if (windVal <= 20) {
            windAdvices = {
                title: `Chỉ Dẫn Đông Y: Tốc Độ Gió Mát Lý Tưởng (${windVal} km/h)`,
                icon: 'bi-wind text-success',
                yly: 'Phong khí hài hòa giúp điều hòa thân nhiệt, thổi bay chướng khí, tạo cảm giác thư thái dễ chịu.',
                baoche: 'Gió thông thoáng hỗ trợ rất tốt cho việc hong khô sơ bộ thảo dược mới rửa sạch dưới bóng râm, giảm tích tụ ẩm mốc đầu vào.',
                tra: 'Trà bạc hà chanh tươi giúp sảng khoái phế quản, tỉnh táo trí óc.'
            };
        } else {
            windAdvices = {
                title: `Chỉ Dẫn Đông Y: Tốc Độ Gió Mạnh (${windVal} km/h)`,
                icon: 'bi-wind text-warning',
                yly: 'Phong tà kết hợp lạnh dễ gây cảm mạo phong hàn, đau vai gáy, trúng gió. Tránh ngồi trực tiếp hướng gió lùa.',
                baoche: 'Sức gió lớn có thể làm gãy đổ các giàn leo dược liệu mềm (dây thìa canh, thiên môn). Tránh phơi dược liệu nhẹ ngoài sân trống kẻo bị gió cuốn bay mất.',
                tra: 'Trà gừng tươi sắc nóng ấm giúp cản phong hàn cứu biểu cực kỳ hiệu quả.'
            };
        }

        const healthAdvices = {
            aqi: aqiAdvices,
            uv: uvAdvices,
            humidity: humidityAdvices,
            wind: windAdvices
        };

        // Thiết lập Gợi ý mặc định ban đầu hiển thị theo Chất lượng không khí (AQI)
        updateHealthAlertPanel('aqi');

        function updateHealthAlertPanel(paramKey) {
            const advice = healthAdvices[paramKey];
            if (advice && $('#healthAlertCard').length) {
                $('#healthAlertTitle span').text(advice.title);
                $('#healthAlertIcon').removeClass().addClass(`bi ${advice.icon} fs-5`);
                
                // Đồng thời cập nhật màu sắc khung cảnh báo theo mức độ nguy cơ
                let alertClass = 'success';
                if (paramKey === 'aqi') {
                    alertClass = aqiVal <= 50 ? 'success' : (aqiVal <= 150 ? 'warning' : 'danger');
                } else if (paramKey === 'uv') {
                    alertClass = uvNum < 6 ? 'success' : (uvNum < 8 ? 'warning' : 'danger');
                } else if (paramKey === 'humidity') {
                    alertClass = (humidityVal >= 40 && humidityVal <= 80) ? 'success' : (humidityVal < 40 ? 'warning' : 'danger');
                } else if (paramKey === 'wind') {
                    alertClass = windVal <= 20 ? 'success' : 'warning';
                }
                
                // Xây dựng giao diện chỉ dẫn y học Đông y chuyên nghiệp nâng cấp
                const detailHtml = `
                    <div class="row g-3 mt-1">
                        <div class="col-md-6">
                            <div class="p-3 bg-white bg-opacity-75 rounded-3 border border-${alertClass} border-opacity-20 h-100 shadow-sm transition-all" style="backdrop-filter: blur(5px);">
                                <h6 class="fw-bold text-${alertClass === 'success' ? 'success' : (alertClass === 'warning' ? 'warning' : 'danger')} mb-2" style="font-size:0.95rem;">
                                    <i class="bi bi-heart-pulse-fill me-2"></i>Chỉ dẫn Sức khỏe & Y lý
                                </h6>
                                <div class="small text-secondary" style="line-height:1.6; font-size:0.88rem;">
                                    <strong>Trạng thế môi trường:</strong> ${advice.yly.split('. ')[0]}<br>
                                    <strong>Lời khuyên y học cổ truyền:</strong> ${advice.yly.split('. ').slice(1).join('. ')}
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="p-3 bg-white bg-opacity-75 rounded-3 border border-${alertClass} border-opacity-20 h-100 shadow-sm transition-all" style="backdrop-filter: blur(5px);">
                                <h6 class="fw-bold text-${alertClass === 'success' ? 'success' : (alertClass === 'warning' ? 'warning' : 'danger')} mb-2" style="font-size:0.95rem;">
                                    <i class="bi bi-mortar-pestle me-2"></i>Thu hái & Bào chế Đông y
                                </h6>
                                <div class="small text-secondary" style="line-height:1.6; font-size:0.88rem;">
                                    ${advice.baoche}
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="p-3 alert-${alertClass} rounded-3 border border-${alertClass} border-opacity-30 d-flex align-items-center gap-3 shadow-sm">
                                <i class="bi bi-cup-hot-fill fs-4 text-${alertClass === 'success' ? 'success' : (alertClass === 'warning' ? 'warning' : 'danger')} flex-shrink-0"></i>
                                <div class="small text-dark">
                                    <strong>Trà thảo dược đề nghị:</strong> <span class="fw-medium">${advice.tra}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                $('#healthAlertText').html(detailHtml);
                $('#healthAlertCard').removeClass('alert-success alert-warning alert-danger border-success border-warning border-danger')
                                     .addClass(`alert-${alertClass} border-${alertClass}`);
            }
        }

        // Cập nhật trạng thái "Live" hay "Simulation" trên badge tiêu đề
        const $badge = $('.badge-realtime');
        const updateTimeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        if ($('#weatherUpdateTime').length) {
            $('#weatherUpdateTime').text(updateTimeStr);
        }
        if ($badge.length) {
            if (isLive) {
                $badge.html('<span class="status-dot online me-2" style="width:8px; height:8px; background:#00e676; border-radius:50%; display:inline-block;"></span> LIVE · ' + updateTimeStr);
                $badge.css('background', 'rgba(46, 179, 102, 0.2)').css('border-color', 'rgba(46, 179, 102, 0.4)');
            } else {
                $badge.html('<span class="status-dot me-2" style="width:8px; height:8px; background:#ff4757; border-radius:50%; display:inline-block;"></span> OFFLINE · ' + updateTimeStr);
                $badge.css('background', 'rgba(255, 71, 87, 0.15)').css('border-color', 'rgba(255, 71, 87, 0.3)');
            }
        }

        // Cập nhật và hiển thị Floating AQI Warning Toast
        const $floatingAqiToast = $('#floatingAqiToast');
        if ($floatingAqiToast.length) {
            $('#floatingAqiTitle').text(dynamicAqiTitle);
            $('#floatingAqiDesc').text(dynamicAqiDesc);
            $floatingAqiToast.css('border-color', dynamicAqiBorder);
            $('#floatingAqiIconWrapper').css('color', dynamicAqiIconColor);
            $('#floatingAqiIcon').removeClass().addClass(`bi ${dynamicAqiIcon} fs-3`);
            
            // Xử lý nút đóng toast
            $('#closeAqiToastBtn').off('click').on('click', function() {
                $floatingAqiToast.addClass('d-none');
                sessionStorage.setItem('aqi_toast_closed', 'true');
            });
            
            // Tự động hiện sau 1.5 giây nếu chưa bị đóng thủ công trong phiên này
            if (!sessionStorage.getItem('aqi_toast_closed')) {
                setTimeout(() => {
                    $floatingAqiToast.removeClass('d-none');
                }, 1500);
            }
        }

        // Gắn sự kiện cuộn mượt khi nhấn "Xem gợi ý sức khỏe" và cập nhật chỉ dẫn theo thẻ tương ứng
        $('.card-action-link').off('click').on('click', function(e) {
            e.preventDefault();
            
            // Tìm xem click thuộc thẻ nào: aqi, uv, humidity, wind
            let paramKey = 'aqi';
            const $card = $(this).closest('.weather-param-card');
            if ($card.find('.aqi-icon').length) paramKey = 'aqi';
            else if ($card.find('.uv-icon').length) paramKey = 'uv';
            else if ($card.find('.humidity-icon').length) paramKey = 'humidity';
            else if ($card.find('.wind-icon').length) paramKey = 'wind';
            
            // Cập nhật nội dung tương ứng cho khung chỉ dẫn Đông y
            updateHealthAlertPanel(paramKey);
            
            // Cuộn mượt
            const $target = $('#healthAlertCard');
            if ($target.length) {
                $('html, body').animate({
                    scrollTop: $target.offset().top - 120
                }, 600, function() {
                    $target.addClass('flash-highlight');
                    setTimeout(() => {
                        $target.removeClass('flash-highlight');
                    }, 2400);
                });
            }
        });
    }
    initWeatherDashboard();
    // Chạy live API cập nhật định kỳ — 60 giây cho trải nghiệm thời gian thực
    let weatherIntervalId = setInterval(initWeatherDashboard, 60000);
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(weatherIntervalId);
            weatherIntervalId = null;
        } else {
            // Tab active lại — cập nhật ngay và tiếp tục interval
            initWeatherDashboard();
            if (!weatherIntervalId) {
                weatherIntervalId = setInterval(initWeatherDashboard, 60000);
            }
        }
    });


    // ─── 8. KHO TỪ ĐIỂN 20+ BÀI THUỐC ĐÔNG Y (DICTIONARY) ──────
    let currentCategoryFilter = 'Tất cả';
    let currentViewMode = 'grid'; // grid hoặc list
    let renderTimeout = null;

    function getUrlParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param) || '';
    }

    function showSkeletonLoader() {
        const $grid = $('#herbGrid');
        if (!$grid.length) return;
        $grid.empty();
        
        const skeletonHtml = `
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3 skeleton-card-col">
                <div class="card skeleton-card h-100 shadow-sm border-0 rounded-4 overflow-hidden p-0 mb-3" style="min-height: 350px;">
                    <div class="skeleton-img" style="height: 180px; background: #e0e0e0; animation: skeleton-loading 1.5s infinite ease-in-out;"></div>
                    <div class="card-body p-4">
                        <div class="skeleton-title" style="height: 24px; background: #e0e0e0; width: 70%; margin-bottom: 15px; border-radius: 4px; animation: skeleton-loading 1.5s infinite ease-in-out;"></div>
                        <div class="skeleton-text" style="height: 14px; background: #e0e0e0; width: 40%; margin-bottom: 20px; border-radius: 4px; animation: skeleton-loading 1.5s infinite ease-in-out;"></div>
                        <div class="skeleton-text" style="height: 14px; background: #e0e0e0; width: 90%; margin-bottom: 10px; border-radius: 4px; animation: skeleton-loading 1.5s infinite ease-in-out;"></div>
                        <div class="skeleton-text" style="height: 14px; background: #e0e0e0; width: 80%; margin-bottom: 25px; border-radius: 4px; animation: skeleton-loading 1.5s infinite ease-in-out;"></div>
                        <div class="d-flex justify-content-between gap-2 mt-auto">
                            <div style="height: 35px; background: #e0e0e0; flex-grow: 1; border-radius: 20px; animation: skeleton-loading 1.5s infinite ease-in-out;"></div>
                            <div style="height: 35px; background: #e0e0e0; width: 45px; border-radius: 20px; animation: skeleton-loading 1.5s infinite ease-in-out;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        for (let i = 0; i < 8; i++) {
            $grid.append(skeletonHtml);
        }
    }

    function renderHerbs(showSkeleton = false) {
        if (showSkeleton) {
            showSkeletonLoader();
            clearTimeout(renderTimeout);
            renderTimeout = setTimeout(() => {
                executeRenderHerbs();
            }, 350);
        } else {
            executeRenderHerbs();
        }
    }

    function executeRenderHerbs() {
        const $grid = $('#herbGrid');
        if (!$grid.length) return; // Chỉ chạy trên trang dictionary.html

        const searchValue = $('#searchHerbInput').val().trim().toLowerCase();
        $grid.empty();

        // Lọc bài thuốc từ CSDL localStorage
        let filtered = db.herbs.filter(h => {
            const matchesSearch = h.name.toLowerCase().includes(searchValue) || 
                                  h.usage.toLowerCase().includes(searchValue) ||
                                  h.scientific.toLowerCase().includes(searchValue) ||
                                  (h.keywords && h.keywords.toLowerCase().includes(searchValue));
            const matchesCategory = (currentCategoryFilter === 'Tất cả') || (h.category === currentCategoryFilter);
            return matchesSearch && matchesCategory;
        });

        // Sắp xếp bài thuốc
        const sortVal = $('#sortSelect').val() || 'default';
        if (sortVal === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        } else if (sortVal === 'category') {
            filtered.sort((a, b) => a.category.localeCompare(b.category, 'vi'));
        }

        // Cập nhật bộ đếm
        const total = filtered.length;
        if (searchValue || currentCategoryFilter !== 'Tất cả') {
            $('#searchCount').html(`<i class="bi bi-info-circle-fill"></i> Tìm thấy <strong>${total}</strong> bài thuốc phù hợp`);
        } else {
            $('#searchCount').html(`<i class="bi bi-collection-fill"></i> Tổng số <strong>${total}</strong> bài thuốc di sản trong hệ thống`);
        }

        // Tắt mở nút Xóa nhanh tìm kiếm
        if (searchValue) $('#searchClearBtn').addClass('visible');
        else $('#searchClearBtn').removeClass('visible');

        if (total === 0) {
            $grid.append('<div class="col-12 text-center text-muted py-5"><i class="bi bi-exclamation-triangle fs-2 d-block mb-3 text-warning"></i>Không tìm thấy bài thuốc nào. Thử từ khóa khác!</div>');
            return;
        }

        // Vẽ thẻ bài thuốc
        filtered.forEach(herb => {
            const herbImage = escapeHTML(herb.image || DEFAULT_HERB_IMAGE);
            const herbFallback = escapeHTML(herb.fallbackImage || DEFAULT_HERB_IMAGE);
            
            let html = '';
            if (currentViewMode === 'grid') {
                html = `
                    <div class="col-12 col-sm-6 col-lg-4 col-xl-3" data-aos="fade-up">
                        <div class="card herb-card h-100 shadow-sm border-0 rounded-4 overflow-hidden position-relative hover-elevate">
                            <div class="position-relative overflow-hidden" style="height: 180px;">
                                <img src="${herbImage}" class="w-100 h-100 object-fit-cover transition-hover" alt="${escapeHTML(herb.name)}" loading="lazy" onerror="this.onerror=null; this.src='${herbFallback}';">
                                <span class="position-absolute top-0 start-0 m-3 badge bg-white text-dark shadow-sm py-2 px-3 border" style="font-size:0.8rem; border-radius:30px;">
                                    ${escapeHTML(herb.emoji)} ${escapeHTML(herb.category)}
                                </span>
                            </div>
                            <div class="card-body p-4 d-flex flex-column justify-content-between">
                                <div>
                                    <h5 class="fw-bold text-dark mb-1">${escapeHTML(herb.name)}</h5>
                                    <small class="text-muted fst-italic d-block mb-3" style="font-size: 0.85rem;">${escapeHTML(herb.scientific)}</small>
                                    <p class="text-secondary small line-clamp-3 mb-4" style="font-size: 0.9rem; line-height: 1.6;">${escapeHTML(herb.usage)}</p>
                                </div>
                                <div class="d-flex justify-content-between gap-2 mt-auto">
                                    <button class="btn btn-sm btn-outline-success flex-grow-1 py-2 fw-bold btn-view-detail" data-id="${herb.id}">
                                        <i class="bi bi-journal-medical me-1"></i> Xem chi tiết
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger py-2 px-3 btn-save-herb" data-id="${herb.id}" title="Lưu sổ tay">
                                        <i class="bi bi-heart"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-primary py-2 px-3 btn-share-herb" data-id="${herb.id}" data-name="${escapeHTML(herb.name)}" title="Chia sẻ">
                                        <i class="bi bi-share"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                html = `
                    <div class="col-12" data-aos="fade-up">
                        <div class="card herb-card shadow-sm border-0 rounded-4 overflow-hidden position-relative hover-elevate mb-3">
                            <div class="row g-0">
                                <div class="col-md-3 position-relative overflow-hidden" style="min-height: 180px;">
                                    <img src="${herbImage}" class="w-100 h-100 object-fit-cover transition-hover" alt="${escapeHTML(herb.name)}" loading="lazy" onerror="this.onerror=null; this.src='${herbFallback}';">
                                    <span class="position-absolute top-0 start-0 m-3 badge bg-white text-dark shadow-sm py-2 px-3 border" style="font-size:0.8rem; border-radius:30px;">
                                        ${escapeHTML(herb.emoji)} ${escapeHTML(herb.category)}
                                    </span>
                                </div>
                                <div class="col-md-9">
                                    <div class="card-body p-4 d-flex flex-column h-100 justify-content-between">
                                        <div>
                                            <h5 class="fw-bold text-dark mb-1">${escapeHTML(herb.name)}</h5>
                                            <small class="text-muted fst-italic d-block mb-3" style="font-size: 0.85rem;">${escapeHTML(herb.scientific)}</small>
                                            <p class="text-secondary small line-clamp-3 mb-3" style="font-size: 0.9rem; line-height: 1.6;">${escapeHTML(herb.usage)}</p>
                                        </div>
                                        <div class="d-flex justify-content-start gap-2 mt-auto">
                                            <button class="btn btn-sm btn-outline-success py-2 px-4 fw-bold btn-view-detail" data-id="${herb.id}">
                                                <i class="bi bi-journal-medical me-1"></i> Xem chi tiết
                                            </button>
                                            <button class="btn btn-sm btn-outline-danger py-2 px-3 btn-save-herb" data-id="${herb.id}" title="Lưu sổ tay">
                                                <i class="bi bi-heart"></i>
                                            </button>
                                            <button class="btn btn-sm btn-outline-primary py-2 px-3 btn-share-herb" data-id="${herb.id}" data-name="${escapeHTML(herb.name)}" title="Chia sẻ">
                                                <i class="bi bi-share"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            $grid.append(html);
        });

        // Thiết lập trạng thái Trái tim đã lưu của người dùng đăng nhập
        const user = readStorage('gh_user', null);
        if (user) {
            user.saved.forEach(id => {
                const $btn = $(`.btn-save-herb[data-id="${id}"]`);
                $btn.find('i').removeClass('bi-heart').addClass('bi-heart-fill');
                $btn.removeClass('btn-outline-danger').addClass('btn-danger text-white');
            });
        }
    }

    // Debounce tìm kiếm
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    $('#searchHerbInput').on('input', debounce(function() { renderHerbs(); }, 250));
    
    // Nút Clear tìm kiếm
    $('#searchClearBtn').on('click', function() {
        $('#searchHerbInput').val('').focus();
        $(this).removeClass('visible');
        renderHerbs();
    });

    // Lọc theo pills danh mục
    $('#categoryFilter .btn-filter').on('click', function() {
        $('#categoryFilter .btn-filter').removeClass('active');
        $(this).addClass('active');
        currentCategoryFilter = $(this).data('category');
        renderHerbs(true);
    });

    // Sắp xếp bài thuốc
    $('#sortSelect').on('change', function() {
        renderHerbs(true);
    });

    // Chế độ xem Grid/List
    $('#btnGridView').on('click', function() {
        $('#btnGridView').addClass('active').find('i').removeClass('text-secondary').addClass('text-success');
        $('#btnListView').removeClass('active').find('i').removeClass('text-success').addClass('text-secondary');
        currentViewMode = 'grid';
        renderHerbs(true);
    });

    // Chế độ xem Grid/List cho List button
    $('#btnListView').on('click', function() {
        $('#btnListView').addClass('active').find('i').removeClass('text-secondary').addClass('text-success');
        $('#btnGridView').removeClass('active').find('i').removeClass('text-success').addClass('text-secondary');
        currentViewMode = 'list';
        renderHerbs(true);
    });

    // Nút chia sẻ bài thuốc
    $(document).on('click', '.btn-share-herb', function(e) {
        e.stopPropagation();
        const name = $(this).data('name');
        const shareUrl = window.location.origin + window.location.pathname + '?q=' + encodeURIComponent(name);
        
        navigator.clipboard.writeText(shareUrl).then(() => {
            showToast(`Đã sao chép liên kết chia sẻ cho bài thuốc: ${name}!`, 'success');
        }).catch(err => {
            const $temp = $('<input>');
            $('body').append($temp);
            $temp.val(shareUrl).select();
            document.execCommand('copy');
            $temp.remove();
            showToast(`Đã sao chép liên kết chia sẻ cho bài thuốc: ${name}!`, 'success');
        });
    });

    // Lấy query tìm kiếm từ Hero chuyển tiếp sang
    const heroQuery = getUrlParam('q');
    if (heroQuery && $('#searchHerbInput').length) {
        $('#searchHerbInput').val(heroQuery);
        $('#searchClearBtn').addClass('visible');
    }

    // MỞ MODAL XEM CHI TIẾT BÀI THUỐC
    $(document).on('click', '.btn-view-detail', function() {
        const id = $(this).data('id');
        const herb = db.herbs.find(h => h.id === id);
        if (!herb) return;

        $('#herbDetailName').text(herb.name);
        $('#herbDetailScientific').text(herb.scientific);
        $('#herbDetailCategory').text(herb.category);
        $('#herbDetailEmoji').text(herb.emoji);
        $('#herbDetailTime').text(herb.time);
        $('#herbDetailIngredients').text(herb.ingredients || 'Đang cập nhật hoạt chất...');
        $('#herbDetailEfficacy').text(herb.efficacy || 'Đang cập nhật công dụng y lý...');
        $('#herbDetailBenefits').text(herb.benefits || 'Phục hồi sức khỏe toàn diện.');
        $('#herbDetailDosage').text(herb.dosage || 'Đang cập nhật liều dùng...');
        $('#herbDetailContraindications').text(herb.contraindications || 'Không có chống chỉ định đặc biệt, tuy nhiên cần tham khảo ý kiến chuyên gia.');
        
        // Hiển thị nguồn trích dẫn y khoa nếu có
        $('#herbDetailSource').remove();
        if (herb.source) {
            $('#herbDetailBenefits').after(`
                <div id="herbDetailSource" class="mb-4 small text-muted">
                    <i class="bi bi-bookmark-star-fill text-success"></i> <strong>Nguồn trích dẫn:</strong> <em>${escapeHTML(herb.source)}</em>
                </div>
            `);
        }
        
        $('#herbDetailImg').attr('src', herb.image).off('error').on('error', function() {
            $(this).attr('src', herb.fallbackImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600');
        });

        // Vẽ các bước thực hiện sắc thuốc
        const $stepsList = $('#herbDetailSteps');
        $stepsList.empty();
        
        let stepsArr = [];
        if (Array.isArray(herb.steps)) {
            stepsArr = herb.steps;
        } else if (typeof herb.steps === 'string') {
            stepsArr = herb.steps.split(';');
        }

        stepsArr.forEach((step, idx) => {
            if (step.trim()) {
                $stepsList.append(`
                    <li class="d-flex align-items-start mb-3">
                        <span class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-3 fw-bold" style="width: 30px; height: 30px; background: rgba(46, 179, 102, 0.1); color: var(--primary); border: 1px solid rgba(46, 179, 102, 0.2); font-size: 0.95rem;">${idx + 1}</span>
                        <span class="text-secondary" style="font-size: 0.95rem; line-height: 1.6;">${escapeHTML(step.trim())}</span>
                    </li>
                `);
            }
        });

        $('#herbDetailModal').modal('show');
        $('#floatingChatWindow').removeClass('active'); // Đóng chatbot cho thoáng
    });

    // THẢ TIM LƯU SỔ TAY BÀI THUỐC
    $(document).on('click', '.btn-save-herb', function(e) {
        e.stopPropagation();
        const user = readStorage('gh_user', null);
        if (!user) { $('#authModal').modal('show'); return; }
        
        const herbId = $(this).data('id');
        const index = user.saved.indexOf(herbId);
        
        if (index === -1) {
            user.saved.push(herbId);
            $(this).find('i').removeClass('bi-heart').addClass('bi-heart-fill');
            $(this).removeClass('btn-outline-danger').addClass('btn-danger text-white');
            showToast('Đã lưu bài thuốc vào tủ sách cá nhân! 💖', 'success');
            unlockAchievement('badge-first-save');
            if (user.saved.length >= 5) {
                unlockAchievement('badge-expert');
            }
        } else {
            user.saved.splice(index, 1);
            $(this).find('i').removeClass('bi-heart-fill').addClass('bi-heart');
            $(this).removeClass('btn-danger text-white').addClass('btn-outline-danger');
            showToast('Đã xóa bài thuốc khỏi tủ sách', 'error');
        }
        updateActiveUserSession(user);
    });


    // ─── 9. BẢN ĐỒ VỆ TINH LEAFLET & ĐÁNH GIÁ 1-5 SAO (MAP.HTML) ──
    let map;
    let markers = {};
    let activeRegionId = '';

    function getMarkerColor(type) {
        return {
            primary: '#0d6efd',
            success: '#2eb366',
            warning: '#ffc107',
            danger: '#dc3545',
            info: '#17a2b8'
        }[type] || '#2eb366';
    }

    function initMap() {
        if (!$('#realLeafletMap').length) return; // Chỉ chạy trên map.html

        if (typeof L === 'undefined') {
            $('#realLeafletMap').html('<div class="p-5 text-center text-muted"><i class="bi bi-exclamation-triangle fs-1"></i> Không thể tải thư viện Leaflet Map.</div>');
            return;
        }

        // Tạo các Tile Layers
        const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        const googleRoad = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { maxZoom: 20, attribution: '&copy; Google Maps' });
        const googleSatellite = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { maxZoom: 20, attribution: '&copy; Google Maps' });
        const googleHybrid = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', { maxZoom: 20, attribution: '&copy; Google Maps' });

        if (map) {
            map.remove();
        }

        const daNangBounds = L.latLngBounds([15.75, 107.65], [16.35, 108.55]);
        map = L.map('realLeafletMap', {
            center: [16.0544, 108.2022], // Tâm bản đồ Đà Nẵng
            zoom: 11,
            minZoom: 9,
            maxBounds: daNangBounds,
            maxBoundsViscosity: 0.9,
            layers: [osm]
        });

        const baseLayers = {
            "Bản đồ OpenStreetMap": osm,
            "Google Bản đồ đường": googleRoad,
            "Google Bản đồ vệ tinh": googleSatellite,
            "Google Vệ tinh lai ghép": googleHybrid
        };
        L.control.layers(baseLayers, null, { position: 'topright' }).addTo(map);

        // Khởi tạo trạng thái giao diện mobile mặc định là xem danh sách
        $('.map-fullscreen-container').addClass('mobile-list-active');

        renderMapSidebarAndMarkers();

        // Fix: invalidate size sửa lỗi gray tiles - tăng timeout từ 350ms → 800ms
        setTimeout(() => { map.invalidateSize(); }, 800);
        // Invalidate thêm lần thứ 2 để chắc chắn bản đồ render đúng
        setTimeout(() => { map.invalidateSize(); }, 1500);
        // Invalidate thêm lần thứ 3 để triệt để sửa lỗi gray tiles trên mọi màn hình
        setTimeout(() => { map.invalidateSize(); }, 3000);
        
        $(window).on('resize', function() { map.invalidateSize(); });

        // Debounce sự kiện tìm kiếm địa điểm bản đồ
        $(document).on('input', '#searchLocationInput', debounce(function() {
            renderMapSidebarAndMarkers();
        }, 250));

        // Tự động invalidateSize khi chuyển tab Bootstrap để tránh lỗi ô xám
        $('button[data-bs-toggle="tab"], a[data-bs-toggle="tab"]').on('shown.bs.tab', function () {
            if (map) {
                setTimeout(() => {
                    map.invalidateSize();
                }, 100);
            }
        });

        // Click Lọc phân loại Bản đồ
        $(document).on('click', '#mapTypeFilter button', function() {
            $('#mapTypeFilter button').removeClass('active');
            $(this).addClass('active');
            currentMapFilter = $(this).data('type');
            renderMapSidebarAndMarkers();
        });

        // Click Tìm vùng gần tôi nhất (Geolocation)
        $(document).on('click', '#findNearMeBtn', function() {
            if (!navigator.geolocation) {
                showToast('Trình duyệt không hỗ trợ định vị!', 'error');
                return;
            }
            showToast('Đang quét tín hiệu định vị GPS...', 'info');
            navigator.geolocation.getCurrentPosition(function(pos) {
                const { latitude, longitude } = pos.coords;
                
                // Di chuyển bản đồ đến toạ độ của user
                map.flyTo([latitude, longitude], 13);
                
                // Vẽ marker tạm cho User
                if (window.userLocationMarker) {
                    map.removeLayer(window.userLocationMarker);
                }
                window.userLocationMarker = L.marker([latitude, longitude], {
                    icon: L.divIcon({
                        className: 'user-location-pin',
                        html: `<div style="background-color:#0d6efd; width:16px; height:16px; border:3px solid #fff; border-radius:50%; box-shadow:0 0 12px rgba(13,110,253,0.8);"></div>`,
                        iconSize: [16, 16],
                        iconAnchor: [8, 8]
                    })
                }).addTo(map).bindPopup('<b>Vị trí hiện tại của bạn</b>').openPopup();

                // Tính toán địa danh gần user nhất
                if (db.regions && db.regions.length > 0) {
                    const nearest = db.regions.reduce((prev, curr) => {
                        const d = (r) => Math.sqrt(Math.pow(r.coords[0] - latitude, 2) + Math.pow(r.coords[1] - longitude, 2));
                        return d(curr) < d(prev) ? curr : prev;
                    });
                    
                    showToast(`Điểm di sản gần bạn nhất: ${nearest.name}`, 'success');
                    setTimeout(() => {
                        // Switch view sang bản đồ trên mobile để thấy điểm nhảy tới
                        if ($(window).width() <= 768) {
                            $('.map-fullscreen-container').removeClass('mobile-list-active').addClass('mobile-map-active');
                            $('#btnMobileMapToggle').html('<i class="bi bi-list-task me-1"></i> Xem danh sách');
                            if (map) {
                                setTimeout(() => { map.invalidateSize(); }, 150);
                            }
                        }
                        map.flyTo(nearest.coords, 13, { duration: 1.5 });
                        if (markers[nearest.id]) {
                            markers[nearest.id].openPopup();
                            $('#reviews-tab').prop('disabled', false);
                            const triggerTab = document.querySelector('#reviews-tab');
                            bootstrap.Tab.getInstance(triggerTab)?.show() || new bootstrap.Tab(triggerTab).show();
                            loadRegionReviews(nearest.id);
                        }
                    }, 2000);
                }
            }, function() {
                showToast('Không thể truy cập vị trí! Vui lòng bật định vị trên thiết bị.', 'error');
            }, { enableHighAccuracy: true, timeout: 5000 });
        });

        // Click nút Toggle chế độ xem Bản đồ / Danh sách trên Mobile
        $(document).on('click', '#btnMobileMapToggle', function() {
            const $container = $('.map-fullscreen-container');
            if ($container.hasClass('mobile-list-active')) {
                $container.removeClass('mobile-list-active').addClass('mobile-map-active');
                $(this).html('<i class="bi bi-list-task me-1"></i> Xem danh sách');
                if (map) {
                    setTimeout(() => { map.invalidateSize(); }, 150);
                }
            } else {
                $container.removeClass('mobile-map-active').addClass('mobile-list-active');
                $(this).html('<i class="bi bi-geo-alt-fill me-1"></i> Xem bản đồ');
            }
        });
    }

    let currentMapFilter = 'all';

    function renderMapSidebarAndMarkers() {
        const $list = $('#dynamicRegionList');
        if (!$list.length) return;
        $list.empty();

        const searchValue = $('#searchLocationInput').length ? $('#searchLocationInput').val().trim().toLowerCase() : '';

        // Xóa sạch markers cũ
        for (let id in markers) {
            map.removeLayer(markers[id]);
        }
        markers = {};

        function createPinIcon(type) {
            const markerColor = getMarkerColor(type);
            return L.divIcon({
            className: 'custom-google-pin',
            html: `<svg viewBox="0 0 384 512" style="width:26px;height:36px;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.3));"><path fill="${markerColor}" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/></svg>`,
            iconSize: [26, 36],
            iconAnchor: [13, 36],
            popupAnchor: [0, -36]
            });
        }

        const filtered = db.regions.filter(reg => {
            const matchesSearch = reg.name.toLowerCase().includes(searchValue) ||
                   reg.location.toLowerCase().includes(searchValue) ||
                   (reg.desc && reg.desc.toLowerCase().includes(searchValue)) ||
                   (reg.herbs && reg.herbs.some(h => h.toLowerCase().includes(searchValue)));
            
            const matchesType = (currentMapFilter === 'all') || (reg.type === currentMapFilter);
            return matchesSearch && matchesType;
        });

        // Cập nhật số lượng địa điểm trên Tab
        $('#places-tab').html(`<i class="bi bi-pin-map-fill me-1"></i> Địa điểm (${filtered.length})`);

        if (filtered.length === 0) {
            $list.append('<div class="text-center text-muted py-5"><i class="bi bi-geo-alt fs-2 d-block mb-3 text-warning"></i>Không tìm thấy vườn thảo dược nào.</div>');
            return;
        }

        filtered.forEach(reg => {
            // Tạo marker
            const marker = L.marker(reg.coords, { icon: createPinIcon(reg.type) }).addTo(map);
            const popupContent = `
                <div style="min-width: 220px; font-family:'Outfit',sans-serif;">
                    <img src="${escapeHTML(reg.image || 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400')}" class="w-100 rounded-3 mb-2" style="height: 130px; object-fit: cover;" alt="${escapeHTML(reg.name)}">
                    <span class="badge bg-success mb-1" style="font-size:0.75rem; padding: 3px 8px;">Khu Di Sản Sinh Học</span>
                    <h6 class="fw-bold mb-1" style="color:var(--text-main); font-size: 0.95rem; line-height: 1.3;">${escapeHTML(reg.name)}</h6>
                    <p class="small text-secondary mb-2" style="line-height:1.4; font-size: 0.85rem;">${escapeHTML(reg.desc)}</p>
                    <small class="d-block mb-1" style="font-size: 0.8rem;">⭐ Đánh giá: <strong>${(reg.rating || 5.0).toFixed(1)} / 5.0</strong> (${reg.reviewsCount || 0} reviews)</small>
                </div>
            `;
            marker.bindPopup(popupContent);
            markers[reg.id] = marker;

            // Đắp Sidebar List
            $list.append(`
                <div class="map-item-premium" data-id="${reg.id}">
                    <img src="${escapeHTML(reg.image || 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400')}" class="rounded-3">
                    <div style="flex: 1; min-width: 0;">
                        <h6 class="map-item-title">${escapeHTML(reg.name)}</h6>
                        <span class="map-item-desc"><i class="bi bi-geo-alt-fill text-danger"></i> ${escapeHTML(reg.location)}</span>
                        <div class="d-flex flex-wrap gap-1">
                            ${reg.herbs.slice(0, 2).map(h => `<span class="badge bg-success bg-opacity-10 text-success border-0" style="font-size: 0.65rem; padding: 3px 6px;">${escapeHTML(h)}</span>`).join('')}
                            ${reg.herbs.length > 2 ? `<span class="badge bg-secondary bg-opacity-10 text-secondary border-0" style="font-size: 0.65rem; padding: 3px 6px;">+${reg.herbs.length - 2}</span>` : ''}
                        </div>
                    </div>
                </div>
            `);
        });

        // Click địa danh trên Sidebar
        $('#dynamicRegionList').off('click', '.map-item-premium').on('click', '.map-item-premium', function () {
            $('.map-item-premium').removeClass('active');
            $(this).addClass('active');
            
            const id = $(this).data('id');
            activeRegionId = id;
            
            const reg = db.regions.find(r => r.id === id);
            if (reg) {
                // Di chuyển màn hình sang chế độ Bản đồ trên điện thoại để user thấy
                if ($(window).width() <= 768) {
                    $('.map-fullscreen-container').removeClass('mobile-list-active').addClass('mobile-map-active');
                    $('#btnMobileMapToggle').html('<i class="bi bi-list-task me-1"></i> Xem danh sách');
                    if (map) {
                        setTimeout(() => { map.invalidateSize(); }, 150);
                    }
                }
                
                map.flyTo(reg.coords, 13, { duration: 1.5 });
                markers[id].openPopup();
                
                // Mở tab Nhận xét & Đánh giá
                $('#reviews-tab').prop('disabled', false);
                const triggerTab = document.querySelector('#reviews-tab');
                bootstrap.Tab.getInstance(triggerTab)?.show() || new bootstrap.Tab(triggerTab).show();
                
                loadRegionReviews(id);
            }
        });
    }

    // Tải và hiển thị danh sách nhận xét địa điểm
    function loadRegionReviews(regionId) {
        const reg = db.regions.find(r => r.id === regionId);
        if (!reg) return;

        $('#activeLocationName').text(reg.name);
        $('#activeLocationRatingText').text(`${(reg.rating || 5.0).toFixed(1)} / 5.0`);
        $('#activeLocationReviewCount').html(`<i class="bi bi-chat-text-fill me-1"></i> ${reg.reviewsCount || 0} nhận xét`);
        
        // Vẽ sao trung bình
        const $stars = $('#activeLocationStars');
        $stars.empty();
        const avg = Math.round(reg.rating || 5);
        for (let i = 1; i <= 5; i++) {
            $stars.append(i <= avg ? '<i class="bi bi-star-fill text-warning"></i>' : '<i class="bi bi-star text-muted"></i>');
        }

        // Tải bình luận
        const $reviewsList = $('#activeLocationReviewsList');
        $reviewsList.empty();

        // Xem người dùng có đăng nhập chưa
        const user = readStorage('gh_user', null);
        if (user) {
            $('#writeReviewSection').removeClass('d-none');
            $('#reviewLoginRequired').addClass('d-none');
        } else {
            $('#writeReviewSection').addClass('d-none');
            $('#reviewLoginRequired').removeClass('d-none');
        }

        // Lấy bình luận từ reviews cục bộ hoặc tạo mock
        let reviews = reg.reviewsList || [];
        if (reviews.length === 0) {
            $reviewsList.append('<div class="text-center text-muted py-4 small">Chua co nhan xet nao cho dia diem nay.</div>');
            return;
        }
        if (false && reviews.length === 0) {
            reviews = [
                { user: 'Nguyễn Minh Hùng', rating: 5, comment: 'Vườn cây rất đẹp, lưu giữ nhiều sâm núi Bà Nà chất lượng cao!' },
                { user: 'Bác Sĩ Cương Đông Y', rating: 4, comment: 'Khu quy hoạch chuẩn OCOP, hy vọng trạm mở rộng vùng trồng sâm.' }
            ];
            reg.reviewsList = reviews;
            saveDB();
        }

        reviews.forEach(rev => {
            let starHtml = '';
            for (let i = 1; i <= 5; i++) {
                starHtml += i <= rev.rating ? '<i class="bi bi-star-fill text-warning" style="font-size:0.75rem;"></i>' : '<i class="bi bi-star text-muted" style="font-size:0.75rem;"></i>';
            }
            $reviewsList.append(`
                <div class="review-bubble">
                    <div class="d-flex justify-content-between mb-1">
                        <strong class="small text-dark" style="font-size:0.85rem;">${escapeHTML(rev.user)}</strong>
                        <div style="gap: 3px; display: flex;">${starHtml}</div>
                    </div>
                    <p class="small text-secondary mb-0" style="line-height:1.4; font-size: 0.8rem;">${escapeHTML(rev.comment)}</p>
                </div>
            `);
        });
    }

    // Xử lý click chọn sao trong form Đăng nhận xét
    let reviewRatingSelected = 5;
    $('#reviewStarRating i').on('click', function () {
        const rating = $(this).data('rating');
        reviewRatingSelected = rating;
        $('#reviewStarRating i').each(function () {
            const idx = $(this).data('rating');
            if (idx <= rating) $(this).addClass('active');
            else $(this).removeClass('active');
        });
    });

    // Submit nhận xét đánh giá địa danh
    $('#locationReviewForm').on('submit', function (e) {
        e.preventDefault();
        const user = readStorage('gh_user', null);
        if (!user) return;

        const comment = $('#reviewCommentInput').val().trim();
        if (!comment) return;

        const reg = db.regions.find(r => r.id === activeRegionId);
        if (!reg) return;

        // Đổ review mới vào CSDL
        if (!reg.reviewsList) reg.reviewsList = [];
        reg.reviewsList.unshift({
            user: user.name,
            rating: reviewRatingSelected,
            comment: comment
        });

        // Tính toán lại điểm số trung bình
        const totalReviews = reg.reviewsList.length;
        const sumRating = reg.reviewsList.reduce((sum, r) => sum + r.rating, 0);
        reg.rating = sumRating / totalReviews;
        reg.reviewsCount = totalReviews;

        saveDB();

        // Ghi nhận rated trong User session để phục vụ Achievements
        if (!user.rated) user.rated = [];
        if (user.rated.indexOf(activeRegionId) === -1) {
            user.rated.push(activeRegionId);
            updateActiveUserSession(user);
        }

        showToast('Cảm ơn đóng góp nhận xét của bạn! ⭐', 'success');
        $('#reviewCommentInput').val('');
        
        loadRegionReviews(activeRegionId);
        renderMapSidebarAndMarkers(); // Vẽ lại bản đồ
        unlockAchievement('badge-map-review');
        if (user.rated.length >= 3) {
            unlockAchievement('badge-ranger');
        }
    });


    // ─── 10. TRANG CÁ NHÂN & THÀNH TỰU (PROFILE.HTML) ──────────
    function initProfilePage() {
        if (!$('#profileContentSection').length) return; // Chỉ chạy trên profile.html

        let user = readStorage('gh_user', null);
        if (!user) {
            $('#profileNotLoggedIn').removeClass('d-none');
            $('#profileLoggedIn').addClass('d-none');
            return;
        }
        user = normalizeUser(user);

        $('#profileNotLoggedIn').addClass('d-none');
        $('#profileLoggedIn').removeClass('d-none');

        // Ghi nhận thông tin tài khoản
        $('#profileShowName').text(user.name);
        $('#profileShowEmail').text(user.email);
        $('#profileInputName').val(user.name);
        
        if (user.avatar) {
            $('#profileBigImage').attr('src', user.avatar).removeClass('d-none');
            $('#profileBigInitials').addClass('d-none');
        } else {
            $('#profileBigImage').addClass('d-none').attr('src', '');
            $('#profileBigInitials').text(user.name.charAt(0).toUpperCase()).removeClass('d-none');
        }
        
        if (user.role === 'admin') {
            $('#profileUserRole').text('Hạng đặc biệt: Quản trị viên hệ thống 👑');
            unlockAchievement('badge-system-admin');
        } else {
            $('#profileUserRole').text('Hạng: Học giả thảo dược sạch 🌿');
        }

        // Cập nhật thông số thống kê động trên Banner Cover
        const savedCount = user.saved ? user.saved.length : 0;
        const reviewCount = user.rated ? user.rated.length : 0;
        
        const chatCount = parseInt(localStorage.getItem('eco_bot_chats_' + (user.email || '')) || localStorage.getItem('eco_bot_chats') || 0);
        let unlockedBadges = 0;
        if (savedCount >= 1) unlockedBadges++;
        if (savedCount >= 5) unlockedBadges++;
        if (chatCount >= 3) unlockedBadges++;
        if (reviewCount >= 1) unlockedBadges++;
        if (reviewCount >= 3) unlockedBadges++;
        if (user.role === 'admin') unlockedBadges++;

        $('#profileStatSaved').text(savedCount);
        $('#profileStatReviews').text(reviewCount);
        $('#profileStatBadges').text(unlockedBadges);

        renderSavedHerbsInProfile(user);
        renderSavedLocationsInProfile(user);
        evaluateAchievements(user);

        // Hiển thị lịch sử các câu hỏi đã hỏi Lương y số trong profile
        const $chatHistoryList = $('#profileChatHistoryList');
        if ($chatHistoryList.length) {
            $chatHistoryList.empty();
            const history = readStorage('eco_bot_chats_history', []) || [];
            const questions = history.filter(q => q.isUser === true);
            if (questions.length === 0) {
                $chatHistoryList.html('<div class="text-center text-muted py-4 small"><i class="bi bi-chat-left-dots d-block fs-3 mb-2 opacity-50"></i>Chưa có câu hỏi nào trong lịch sử tư vấn.</div>');
            } else {
                questions.forEach(q => {
                    $chatHistoryList.append(`
                        <div class="list-group-item d-flex justify-content-between align-items-center bg-transparent border-bottom px-0 py-3">
                            <div class="d-flex align-items-center gap-3">
                                <div class="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; flex-shrink: 0;">
                                    <i class="bi bi-question-circle-fill"></i>
                                </div>
                                <div>
                                    <p class="mb-0 fw-semibold text-dark" style="font-size: 0.9rem;">${escapeHTML(q.text)}</p>
                                    <span class="text-muted small" style="font-size: 0.75rem;">Đã hỏi vào lúc ${q.time}</span>
                                </div>
                            </div>
                            <span class="badge bg-success rounded-pill small px-2.5 py-1">Đã trả lời</span>
                        </div>
                    `);
                });
            }
        }
    }

    // Sự kiện Cập nhật Họ tên & Tải ảnh đại diện từ máy tính
    $('#updateProfileForm').on('submit', function (e) {
        e.preventDefault();
        const user = readStorage('gh_user', null);
        if (!user) return;

        const newName = $('#profileInputName').val().trim();
        if (newName.length < 2) {
            showToast('Tên phải từ 2 ký tự trở lên!', 'error');
            return;
        }

        user.name = newName;

        const avatarFile = $('#profileInputAvatar')[0].files[0];
        if (avatarFile) {
            // Giới hạn ảnh dưới 1.5MB để tránh quá tải dung lượng LocalStorage (tối đa 5MB)
            if (avatarFile.size > 1.5 * 1024 * 1024) {
                showToast('Ảnh đại diện quá lớn! Vui lòng chọn ảnh dưới 1.5MB.', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onload = function (event) {
                user.avatar = event.target.result;
                saveUserData(user);
            };
            reader.readAsDataURL(avatarFile);
        } else {
            saveUserData(user);
        }

        function saveUserData(updatedUser) {
            updateActiveUserSession(updatedUser);
            showToast('Cập nhật hồ sơ cá nhân thành công! 🎉', 'success');
            
            // Cập nhật giao diện lập tức mà không cần F5
            $('#profileShowName').text(updatedUser.name);
            if (updatedUser.avatar) {
                $('#profileBigImage').attr('src', updatedUser.avatar).removeClass('d-none');
                $('#profileBigInitials').addClass('d-none');
                $('#avatarImage').attr('src', updatedUser.avatar).removeClass('d-none');
                $('#avatarInitials').addClass('d-none');
            } else {
                $('#profileBigImage').addClass('d-none').attr('src', '');
                $('#profileBigInitials').text(updatedUser.name.charAt(0).toUpperCase()).removeClass('d-none');
                $('#avatarImage').addClass('d-none').attr('src', '');
                $('#avatarInitials').text(updatedUser.name.charAt(0).toUpperCase()).removeClass('d-none');
            }
            // Reset input file
            $('#profileInputAvatar').val('');
        }
    });

    // Đổi mật khẩu tài khoản
    $('#changePasswordForm').on('submit', async function (e) {
        e.preventDefault();
        const user = readStorage('gh_user', null);
        if (!user) return;

        const oldPass = $('#oldPassword').val();
        const newPass = $('#newPassword').val();
        const confirmNewPass = $('#confirmNewPassword').val();

        const hashedOldPass = await hashPassword(oldPass);
        if (user.password !== hashedOldPass) {
            showToast('Mật khẩu cũ không chính xác!', 'error');
            return;
        }

        if (newPass.length < 6) {
            showToast('Mật khẩu mới phải có ít nhất 6 ký tự!', 'error');
            return;
        }
        if (newPass !== confirmNewPass) {
            showToast('Xác nhận mật khẩu mới không khớp!', 'error');
            return;
        }

        user.password = await hashPassword(newPass);
        updateActiveUserSession(user);
        showToast('Cập nhật mật khẩu thành công! 🔒', 'success');
        this.reset();
    });

    // Xác nhận xóa tài khoản trong modal (2 bước)
    $(document).on('click', '#btnConfirmDeleteAccount', async function () {
        const user = readStorage('gh_user', null);
        if (!user) return;

        const confirmPass = $('#deleteConfirmPassword').val();
        if (!confirmPass) {
            showToast('Vui lòng nhập mật khẩu xác nhận!', 'error');
            return;
        }

        const hashedConfirmPass = await hashPassword(confirmPass);
        if (user.password !== hashedConfirmPass) {
            showToast('Mật khẩu xác nhận không chính xác!', 'error');
            return;
        }

        // Thực hiện xóa tài khoản khỏi eco_heritage_users
        let accountsList = readStorage('eco_heritage_users', []) || [];
        const filteredAccounts = accountsList.filter(u => u.email !== user.email);
        writeStorage('eco_heritage_users', filteredAccounts);

        // Đăng xuất và dọn dẹp
        localStorage.removeItem('gh_user');
        showToast('Tài khoản của bạn đã được xóa vĩnh viễn khỏi hệ thống!', 'success');
        $('#deleteAccountModal').modal('hide');
        $('#deleteConfirmPassword').val('');
        
        checkAuthStatus();
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    });

    function renderSavedHerbsInProfile(user) {
        const $list = $('#profileSavedHerbsList');
        $list.empty();

        if (user.saved.length === 0) {
            $list.html('<div class="text-center text-muted py-4 w-100"><i class="bi bi-heartbreak-fill fs-2 d-block mb-2 text-danger opacity-50"></i>Không có bài thuốc nào trong sổ tay. Hãy quay lại Từ điển và thả tim!</div>');
            return;
        }

        user.saved.forEach(id => {
            const herb = db.herbs.find(h => h.id === id);
            if (herb) {
                $list.append(`
                    <div class="saved-item-card d-flex align-items-center gap-3 p-3 bg-white border rounded-4 shadow-sm hover-elevate" style="width: 100%; max-width: 320px;">
                        <div class="saved-item-emoji d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-3 fs-3" style="width: 52px; height: 52px; flex-shrink: 0;">
                            ${herb.emoji}
                        </div>
                        <div class="flex-grow-1 min-w-0">
                            <h6 class="fw-bold mb-0 text-dark text-truncate" style="font-size: 0.95rem;">${herb.name}</h6>
                            <span class="text-muted fst-italic d-block text-truncate small" style="font-size: 0.76rem; margin-top: 2px;">${herb.scientific}</span>
                        </div>
                        <a href="dictionary.html?q=${encodeURIComponent(herb.name)}" class="btn btn-sm btn-outline-success rounded-circle p-0 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;" title="Xem bài thuốc">
                            <i class="bi bi-arrow-right-short fs-4"></i>
                        </a>
                    </div>
                `);
            }
        });
    }

    function renderSavedLocationsInProfile(user) {
        const $list = $('#profileSavedLocationsList');
        $list.empty();

        const ratedIds = user.rated || [];
        if (ratedIds.length === 0) {
            $list.html('<div class="text-center text-muted py-4 w-100"><i class="bi bi-geo-fill fs-2 d-block mb-2 text-success opacity-50"></i>Chưa theo dõi vườn thảo dược nào. Hãy đánh giá các trạm trồng trên Bản đồ di sản!</div>');
            return;
        }

        ratedIds.forEach(id => {
            const reg = db.regions.find(r => r.id === id);
            if (reg) {
                $list.append(`
                    <div class="saved-item-card d-flex align-items-center gap-3 p-3 bg-white border rounded-4 shadow-sm hover-elevate" style="width: 100%; max-width: 320px;">
                        <img src="${escapeHTML(reg.image || 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400')}" class="rounded-3 object-fit-cover" style="width: 52px; height: 52px; flex-shrink: 0;">
                        <div class="flex-grow-1 min-w-0">
                            <h6 class="fw-bold mb-0 text-dark text-truncate" style="font-size: 0.95rem;">${reg.name}</h6>
                            <span class="text-muted d-block text-truncate small" style="font-size: 0.76rem; margin-top: 2px;"><i class="bi bi-geo-alt-fill text-danger me-1"></i>${reg.location.split(',').pop().trim()}</span>
                        </div>
                        <a href="map.html" class="btn btn-sm btn-outline-success rounded-circle p-0 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;" title="Xem bản đồ">
                            <i class="bi bi-geo-alt fs-5"></i>
                        </a>
                    </div>
                `);
            }
        });
    }

    // Logic Đánh giá và mở khóa Huy chương Thành tựu
    function evaluateAchievements(user) {
        $('.achievement-card').addClass('locked').removeClass('unlocked');
        if (!user) return;

        const saved = Array.isArray(user.saved) ? user.saved : [];
        const rated = Array.isArray(user.rated) ? user.rated : [];

        // 1. Mầm non xanh
        if (saved.length >= 1) unlockAchievement('badge-first-save');
        // 2. Thảo dược sư
        if (saved.length >= 5) unlockAchievement('badge-expert');
        // 3. Thần y hộ mệnh (Chatbot chat)
        const chatCount = parseInt(localStorage.getItem('eco_bot_chats_' + (user.email || '')) || localStorage.getItem('eco_bot_chats') || 0);
        if (chatCount >= 3) unlockAchievement('badge-bot-chat');
        // 4. Nhà thám hiểm (Đã review 1 địa danh)
        if (rated.length >= 1) unlockAchievement('badge-map-review');
        // 5. Vệ binh Sơn Trà (Review 3 địa danh)
        if (rated.length >= 3) unlockAchievement('badge-ranger');
        // 6. Admin
        if (user.role === 'admin') unlockAchievement('badge-system-admin');
    }

    // Hàm mở khóa huy hiệu
    function unlockAchievement(badgeId) {
        const $badge = $('#' + badgeId);
        if ($badge.length) {
            $badge.addClass('unlocked').removeClass('locked');
        }
    }


    // ─── 11. CỔNG QUẢN TRỊ ADMIN CMS (ADMIN.HTML) ──────────────
    function initAdminPage() {
        if (!$('#adminLockPanel').length) return; // Chỉ chạy trên admin.html

        const user = readStorage('gh_user', null);
        const now = Date.now();
        const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 phút

        if (!user || user.role !== 'admin' || !user.lastLoginTime || (now - user.lastLoginTime > SESSION_TIMEOUT)) {
            // Không có quyền hoặc phiên đăng nhập hết hạn
            $('#adminLockPanel').removeClass('d-none');
            $('#adminMainPanel').addClass('d-none');
            
            if (user && user.role === 'admin' && user.lastLoginTime && (now - user.lastLoginTime > SESSION_TIMEOUT)) {
                showToast('Phiên làm việc quản trị đã hết hạn! Vui lòng đăng nhập lại.', 'error');
                localStorage.removeItem('gh_user');
            } else {
                showToast('Quyền truy cập bị từ chối! Chuyển hướng...', 'error');
            }
            setTimeout(() => { window.location.href = 'index.html'; }, 3000);
            return;
        }

        // Cập nhật lại thời gian hoạt động để kéo dài phiên
        user.lastLoginTime = Date.now();
        updateActiveUserSession(user);

        // Quyền admin: Hiển thị Panel
        $('#adminLockPanel').addClass('d-none');
        $('#adminMainPanel').removeClass('d-none');

        renderAdminDashboardStats();
        renderAdminRemediesTable();
        renderAdminLocationsTable();
        renderAdminUsersTable();
        renderAdminReviewsTable();
    }

    function renderAdminDashboardStats() {
        $('#statTotalRemedies').text(db.herbs.length);
        $('#statTotalLocations').text(db.regions.length);
        
        // Tính tổng reviews trên toàn bộ địa danh
        const totalRev = db.regions.reduce((sum, r) => sum + (r.reviewsList ? r.reviewsList.length : 0), 0);
        $('#statTotalReviews').text(totalRev);
        $('#statTotalUsers').text((readStorage('eco_heritage_users', []) || []).length);
    }

    // CMS 1: Vẽ bảng bài thuốc CRUD
    function renderAdminRemediesTable() {
        const $tbody = $('#adminRemediesTableBody');
        if (!$tbody.length) return;
        $tbody.empty();

        db.herbs.forEach(herb => {
            $tbody.append(`
                <tr>
                    <td>
                        <span class="me-2 fs-5">${escapeHTML(herb.emoji)}</span>
                        <strong>${escapeHTML(herb.name)}</strong>
                    </td>
                    <td><em>${escapeHTML(herb.scientific)}</em></td>
                    <td><span class="badge bg-success bg-opacity-10 text-success">${escapeHTML(herb.category)}</span></td>
                    <td class="small text-secondary line-clamp-3" style="max-width: 300px;">${escapeHTML(herb.usage)}</td>
                    <td class="text-end">
                        <button class="btn btn-outline-primary btn-sm rounded-pill px-3 me-1 btn-admin-edit-remedy" data-id="${herb.id}"><i class="bi bi-pencil-square"></i> Sửa</button>
                        <button class="btn btn-outline-danger btn-sm rounded-pill px-3 btn-admin-delete-remedy" data-id="${herb.id}"><i class="bi bi-trash"></i> Xóa</button>
                    </td>
                </tr>
            `);
        });
    }

    // Xóa bài thuốc - Mở modal xác nhận
    $(document).on('click', '.btn-admin-delete-remedy', function () {
        window.remedyIdToDelete = $(this).data('id');
        $('#confirmDeleteRemedyModal').modal('show');
    });

    // Thực hiện xóa bài thuốc sau khi xác nhận trong modal
    $(document).on('click', '#btnConfirmDeleteRemedy', function () {
        const id = window.remedyIdToDelete;
        const index = db.herbs.findIndex(h => h.id === id);
        if (index > -1) {
            db.herbs.splice(index, 1);
            saveDB();
            showToast('Đã xóa thành công bài thuốc!', 'success');
            renderAdminRemediesTable();
            renderAdminDashboardStats();
        }
        $('#confirmDeleteRemedyModal').modal('hide');
    });

    // Mở Modal Sửa bài thuốc & điền dữ liệu
    $(document).on('click', '.btn-admin-edit-remedy', function () {
        const id = $(this).data('id');
        const herb = db.herbs.find(h => h.id === id);
        if (!herb) return;

        $('#editRemedyId').val(herb.id);
        $('#editRemedyName').val(herb.name);
        $('#editRemedyScientific').val(herb.scientific);
        $('#editRemedyCategory').val(herb.category);
        $('#editRemedyEmoji').val(herb.emoji);
        $('#editRemedyImage').val(herb.image || '');
        $('#editRemedyUsage').val(herb.usage);
        $('#editRemedyIngredients').val(herb.ingredients || '');
        $('#editRemedyEfficacy').val(herb.efficacy || '');
        $('#editRemedyTime').val(herb.time || '');
        $('#editRemedyBenefits').val(herb.benefits || '');
        
        let stepsStr = '';
        if (Array.isArray(herb.steps)) {
            stepsStr = herb.steps.join(';');
        } else if (typeof herb.steps === 'string') {
            stepsStr = herb.steps;
        }
        $('#editRemedySteps').val(stepsStr);
        $('#editRemedyKeywords').val(herb.keywords || '');
        $('#editRemedySource').val(herb.source || '');

        $('#editRemedyModal').modal('show');
    });

    // Submit Cập nhật bài thuốc
    $('#editRemedyForm').on('submit', function (e) {
        e.preventDefault();
        const id = $('#editRemedyId').val();
        const herb = db.herbs.find(h => h.id === id);
        if (!herb) return;

        herb.name = $('#editRemedyName').val().trim();
        herb.scientific = $('#editRemedyScientific').val().trim();
        herb.category = $('#editRemedyCategory').val();
        herb.emoji = $('#editRemedyEmoji').val().trim();
        herb.image = $('#editRemedyImage').val().trim() || DEFAULT_HERB_IMAGE;
        herb.fallbackImage = herb.fallbackImage || DEFAULT_HERB_IMAGE;
        herb.usage = $('#editRemedyUsage').val().trim();
        herb.ingredients = $('#editRemedyIngredients').val().trim();
        herb.efficacy = $('#editRemedyEfficacy').val().trim();
        herb.time = $('#editRemedyTime').val().trim();
        herb.benefits = $('#editRemedyBenefits').val().trim();
        
        const stepsVal = $('#editRemedySteps').val().trim();
        herb.steps = stepsVal.split(';').map(s => s.trim()).filter(s => s.length > 0);
        herb.keywords = $('#editRemedyKeywords').val().trim();
        herb.source = $('#editRemedySource').val().trim();

        saveDB();
        showToast('Cập nhật thông tin bài thuốc thành công! 🌿', 'success');
        $('#editRemedyModal').modal('hide');
        
        renderAdminRemediesTable();
        renderAdminDashboardStats();
    });

    // Submit Thêm bài thuốc mới
    $('#addRemedyForm').on('submit', function (e) {
        e.preventDefault();
        const name = $('#addRemedyName').val().trim();
        const scientific = $('#addRemedyScientific').val().trim();
        const category = $('#addRemedyCategory').val();
        const emoji = $('#addRemedyEmoji').val().trim();
        const usage = $('#addRemedyUsage').val().trim();
        const ingredients = $('#addRemedyIngredients').val().trim();
        const efficacy = $('#addRemedyEfficacy').val().trim();
        const time = $('#addRemedyTime').val().trim();
        const benefits = $('#addRemedyBenefits').val().trim();
        const steps = $('#addRemedySteps').val().trim();
        const keywords = $('#addRemedyKeywords').val().trim();
        const source = $('#addRemedySource').val().trim();
        const image = $('#addRemedyImage').val().trim() || DEFAULT_HERB_IMAGE;

        const newId = getNextId(db.herbs, 'h');
        const newHerb = {
            id: newId,
            name, scientific, category, emoji, usage, ingredients, efficacy, time, benefits, source,
            steps: steps.split(';').map(s => s.trim()).filter(s => s.length > 0),
            keywords,
            image,
            fallbackImage: DEFAULT_HERB_IMAGE
        };

        db.herbs.unshift(newHerb);
        saveDB();

        showToast('Thêm bài thuốc mới thành công! 🌿', 'success');
        $('#addRemedyModal').modal('hide');
        this.reset();
        
        renderAdminRemediesTable();
        renderAdminDashboardStats();
    });

    // CMS 2: Vẽ bảng Địa điểm di sản CRUD
    function renderAdminLocationsTable() {
        const $tbody = $('#adminLocationsTableBody');
        if (!$tbody.length) return;
        $tbody.empty();

        db.regions.forEach(reg => {
            $tbody.append(`
                <tr>
                    <td><strong>${escapeHTML(reg.name)}</strong></td>
                    <td class="small text-secondary">${escapeHTML(reg.location)}</td>
                    <td class="small"><code>[${reg.coords.join(', ')}]</code></td>
                    <td class="small text-success">${escapeHTML(reg.herbs.join(', '))}</td>
                    <td class="text-end">
                        <button class="btn btn-outline-primary btn-sm rounded-pill px-3 me-1 btn-admin-edit-loc" data-id="${reg.id}"><i class="bi bi-pencil-square"></i> Sửa</button>
                        <button class="btn btn-outline-danger btn-sm rounded-pill px-3 btn-admin-delete-loc" data-id="${reg.id}"><i class="bi bi-trash"></i> Xóa</button>
                    </td>
                </tr>
            `);
        });
    }

    // Xóa địa điểm - Mở modal xác nhận
    $(document).on('click', '.btn-admin-delete-loc', function () {
        window.locationIdToDelete = $(this).data('id');
        $('#confirmDeleteLocationModal').modal('show');
    });

    // Thực hiện xóa địa điểm sau khi xác nhận trong modal
    $(document).on('click', '#btnConfirmDeleteLocation', function () {
        const id = window.locationIdToDelete;
        const index = db.regions.findIndex(r => r.id === id);
        if (index > -1) {
            db.regions.splice(index, 1);
            saveDB();
            showToast('Đã xóa thành công địa danh bảo tồn!', 'success');
            renderAdminLocationsTable();
            renderAdminDashboardStats();
        }
        $('#confirmDeleteLocationModal').modal('hide');
    });

    // Mở Modal Sửa địa điểm & điền dữ liệu
    $(document).on('click', '.btn-admin-edit-loc', function () {
        const id = $(this).data('id');
        const reg = db.regions.find(r => r.id === id);
        if (!reg) return;

        $('#editLocId').val(reg.id);
        $('#editLocName').val(reg.name);
        $('#editLocAddress').val(reg.location);
        $('#editLocType').val(reg.type || 'primary');
        $('#editLocLat').val(reg.coords[0]);
        $('#editLocLon').val(reg.coords[1]);
        $('#editLocHerbs').val(reg.herbs.join(', '));
        $('#editLocDesc').val(reg.desc);

        $('#editLocationModal').modal('show');
    });

    // Submit Cập nhật địa điểm
    $('#editLocationForm').on('submit', function (e) {
        e.preventDefault();
        const id = $('#editLocId').val();
        const reg = db.regions.find(r => r.id === id);
        if (!reg) return;

        reg.name = $('#editLocName').val().trim();
        reg.location = $('#editLocAddress').val().trim();
        reg.type = $('#editLocType').val() || 'primary';
        reg.coords[0] = parseFloat($('#editLocLat').val());
        reg.coords[1] = parseFloat($('#editLocLon').val());
        
        const herbsVal = $('#editLocHerbs').val().trim();
        reg.herbs = herbsVal.split(',').map(h => h.trim()).filter(h => h.length > 0);
        reg.desc = $('#editLocDesc').val().trim();

        saveDB();
        showToast('Cập nhật địa danh bản đồ thành công! 🗺️', 'success');
        $('#editLocationModal').modal('hide');
        
        renderAdminLocationsTable();
        renderAdminDashboardStats();
    });

    // Submit Thêm địa danh mới
    $('#addLocationForm').on('submit', function (e) {
        e.preventDefault();
        const name = $('#addLocName').val().trim();
        const address = $('#addLocAddress').val().trim();
        const lat = parseFloat($('#addLocLat').val());
        const lon = parseFloat($('#addLocLon').val());
        const herbs = $('#addLocHerbs').val().trim();
        const desc = $('#addLocDesc').val().trim();
        const type = $('#addLocType').val() || 'primary';

        const newId = getNextId(db.regions, 'r');
        const newLoc = {
            id: newId,
            name, location: address,
            coords: [lat, lon],
            type,
            herbs: herbs.split(',').map(h => h.trim()).filter(h => h.length > 0),
            desc,
            rating: 5.0,
            reviewsCount: 0,
            reviewsList: []
        };

        db.regions.unshift(newLoc);
        saveDB();

        $('#addLocationModal').modal('hide');
        this.reset();
        
        renderAdminLocationsTable();
        renderAdminDashboardStats();
    });



    // Xuất CSV danh sách bài thuốc trong Admin CMS
    $(document).on('click', '#exportHerbsCSV', function() {
        const activeUser = readStorage('gh_user', null);
        if (!activeUser || activeUser.role !== 'admin') {
            showToast('Quyền truy cập bị từ chối!', 'error');
            return;
        }

        const headers = ['ID', 'Tên', 'Khoa học', 'Phân loại', 'Công dụng'];
        const rows = db.herbs.map(h => [
            h.id, h.name, h.scientific, h.category, h.usage
        ]);
        const csvContent = [headers, ...rows]
            .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = $('<a>').attr({ href: url, download: 'ecoheritage_herbs.csv' });
        $('body').append(a);
        a[0].click();
        a.remove();
        URL.revokeObjectURL(url);
        showToast('Đã xuất file CSV thành công! 📊', 'success');
    });



    // CMS 3: Vẽ bảng người dùng
    function renderAdminUsersTable() {
        const $tbody = $('#adminUsersTableBody');
        if (!$tbody.length) return;
        $tbody.empty();

        // Load tài khoản người dùng đăng nhập trong LocalStorage
        const user = readStorage('gh_user', null);
        
        // Vẽ mock tài khoản
        const users = (readStorage('eco_heritage_users', []) || []).map(normalizeUser); if (false) [
            { name: 'Nguyễn Minh Hùng', email: 'minhhung@vku.edu.vn', role: 'user', pass: '******' },
            { name: 'Lương Y Cương', email: 'luongycuong@gmail.com', role: 'user', pass: '******' }
        ];
        if (user) {
            // Tránh hiển thị trùng lặp nếu tài khoản hiện tại đã có trong danh sách
            if (!users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
                users.unshift({ name: user.name, email: user.email, role: user.role, password: user.password || '******' });
            }
        }

        users.forEach(u => {
            $tbody.append(`
                <tr>
                    <td><strong>${u.name}</strong></td>
                    <td><code>${u.email}</code></td>
                    <td><span class="badge badge-role ${u.role}">${u.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}</span></td>
                    <td class="small text-muted"><code style="font-size:0.75rem;">••••••••</code></td>
                    <td class="text-end">
                        <button class="btn btn-outline-secondary btn-sm rounded-pill px-2.5" disabled><i class="bi bi-shield-lock"></i> Vô hiệu hóa</button>
                    </td>
                </tr>
            `);
        });
    }

    // CMS 4: Vẽ bảng Moderation reviews phản hồi
    function renderAdminReviewsTable() {
        const $tbody = $('#adminReviewsTableBody');
        if (!$tbody.length) return;
        $tbody.empty();

        let totalReviewsCount = 0;
        db.regions.forEach(reg => {
            const revList = reg.reviewsList || [];
            revList.forEach((rev, idx) => {
                totalReviewsCount++;
                $tbody.append(`
                    <tr>
                        <td><strong>${reg.name}</strong></td>
                        <td class="small">${rev.user}</td>
                        <td class="text-warning small">${'⭐'.repeat(rev.rating)}</td>
                        <td class="small text-secondary" style="max-width: 320px;">${rev.comment}</td>
                        <td class="text-end">
                            <button class="btn btn-outline-danger btn-sm rounded-pill px-2.5 btn-admin-delete-review" data-regid="${reg.id}" data-idx="${idx}"><i class="bi bi-trash3-fill"></i> Gỡ bỏ</button>
                        </td>
                    </tr>
                `);
            });
        });

        if (totalReviewsCount === 0) {
            $tbody.append('<tr><td colspan="5" class="text-center py-4 text-muted">Chưa có bình luận đánh giá nào trên bản đồ.</td></tr>');
        }
    }

    // Xóa đánh giá (Moderation) kèm cập nhật rating trung bình
    $(document).on('click', '.btn-admin-delete-review', function () {
        const regId = String($(this).data('regid'));
        const idx = parseInt($(this).data('idx'), 10);
        
        // Kiểm tra phân quyền admin trước khi thực hiện
        const activeUser = readStorage('gh_user', null);
        if (!activeUser || activeUser.role !== 'admin') {
            showToast('Quyền truy cập bị từ chối!', 'error');
            return;
        }

        if (!confirm('Bạn có chắc chắn muốn gỡ bỏ đánh giá này không?')) return;

        const reg = db.regions.find(r => r.id === regId);
        if (reg && reg.reviewsList && reg.reviewsList[idx] !== undefined) {
            reg.reviewsList.splice(idx, 1);
            reg.reviewsCount = reg.reviewsList.length;
            if (reg.reviewsList.length > 0) {
                const sumRating = reg.reviewsList.reduce((sum, r) => sum + Number(r.rating || 5), 0);
                reg.rating = sumRating / reg.reviewsList.length;
            } else {
                reg.rating = 5.0; // rating mặc định khi danh sách trống
            }
            saveDB();
            showToast('Đã gỡ bỏ đánh giá và cập nhật lại điểm trung bình!', 'success');
            renderAdminReviewsTable();
        }
    });

    const apiKey = (typeof ECO_CONFIG !== 'undefined' && ECO_CONFIG.GEMINI_API_KEY) ? ECO_CONFIG.GEMINI_API_KEY : '';
    
    // Premium Local Fallback Generator for Robust Offline/Timeout experience
    function getLocalPremiumFallback(query) {
        const q = query.toLowerCase();
        const warningPrefix = `<div class="alert alert-warning p-3 small mb-3 text-start" style="font-size:0.75rem; border-radius:var(--radius-sm); background: rgba(255, 193, 7, 0.12); color: #664d03; border: 1px solid rgba(255, 193, 7, 0.2); line-height: 1.4;"><i class="bi bi-exclamation-triangle-fill text-warning me-1"></i> <strong>KHUYẾN CÁO Y KHOA:</strong> Mọi thông tin tư vấn ngoại tuyến chỉ mang tính chất tham khảo học thuật. Quý nhân tuyệt đối không tự ý áp dụng khi chưa có sự tư vấn, bắt mạch và chỉ định từ Bác sĩ hoặc Lương y có chuyên môn.</div>`;
        
        let text = '';
        
        if (q.includes('ngủ') || q.includes('lo âu') || q.includes('hồi hộp') || q.includes('mất ngủ') || q.includes('tâm thần')) {
            return `🩺 **Y Lý Phương Đông**: Mất ngủ, tâm thần bất an theo y lý cổ truyền chủ yếu do **Tâm Tỳ Lưỡng Hư** hoặc **Âm Hư Hỏa Vượng**. Khi lo nghĩ quá độ làm hao tổn tâm huyết, tỳ khí suy nhược khiến huyết không dưỡng được tâm, thần không có nơi trú ngụ khí thần bất ổn.<br><br>🌿 **Phương Dược Cổ Truyền**: Lương y khuyên dùng bài thuốc cổ phương **Quy Tỳ Thang** để dưỡng tâm, kiện tỳ, an thần bồi bổ khí huyết.<br>- **Thành phần**: Nhân sâm (12g), Bạch truật (12g), Phục linh (12g), Hoàng kỳ (12g), Toan táo nhân (12g), Long nhãn (12g), Đương quy (12g), Viễn chí (6g), Mộc hương (6g), Cam thảo (3g).<br>- **Cách dùng**: Sắc với 3 lát gừng và 2 quả táo tàu. Sắc ngày 1 thang, chia 2 lần uống ấm sau ăn.<br><br>🗺️ **Di Sản Thảo Dược**: Các thảo dược hỗ trợ an thần tự nhiên như Toan táo nhân và Phục linh hiện đang được trồng bảo tồn hữu cơ sạch tại khu bảo tồn thảo dược **đỉnh Bà Nà** (Đà Nẵng), nơi có khí hậu mát mẻ lý tưởng giúp cây tích lũy tối đa hoạt chất an thần tinh khiết.`;
        }
        
        if (q.includes('khớp') || q.includes('đau lưng') || q.includes('mỏi gối') || q.includes('tê bì') || q.includes('vai gáy') || q.includes('tê mỏi') || q.includes('xương')) {
            return `🩺 **Y Lý Phương Đông**: Các chứng đau mỏi khớp thuộc phạm vi **Chứng Tý** trong y lý cổ truyền. Nguyên nhân chủ yếu do phong - hàn - thấp tà xâm nhập kinh lạc lúc cơ thể suy nhược, làm khí huyết ứ trệ, không thông sinh ra đau đớn ("bất thông thống").<br><br>🌿 **Phương Dược Cổ Truyền**: Lương y khuyên dùng bài thuốc đệ nhất trị khớp **Độc Hoạt Ký Sinh Thang** để khu phong, trừ thấp, bổ can thận và ích khí dưỡng huyết.<br>- **Thành phần**: Độc hoạt (12g), Tang ký sinh (16g), Đỗ trọng (12g), Đương quy (12g), Bạch thược (12g), Xuyên khung (8g), Địa hoàng (12g), Nhân sâm (12g), Phục linh (12g), Quế chi (6g), Cam thảo (6g).<br>- **Cách dùng**: Sắc nước ngày 1 thang uống ấm nóng, tránh gió lạnh sau khi uống thuốc.<br><br>🗺️ **Di Sản Thảo Dược**: Dây Tang ký sinh quý báu đang được các nhà khoa học trạm sinh vật tại **Bán đảo Sơn Trà** bảo tồn nhân giống tự nhiên dưới tán rừng nguyên sinh, hấp thụ tinh hoa đất trời Sơn Trà đạt hàm lượng kháng viêm tự nhiên tuyệt hảo.`;
        }
        
        if (q.includes('ho') || q.includes('cảm') || q.includes('họng') || q.includes('sốt') || q.includes('phổi') || q.includes('đờm')) {
            return `🩺 **Y Lý Phương Đông**: Cảm lạnh, ho gió, ho đờm hoặc ôn nhiệt do ngoại tà phong nhiệt xâm nhập trực tiếp qua đường mũi miệng vào phế vệ, làm mất chức năng tuyên giáng khí của tạng **Phế**, khí nghịch lên gây ra ho sốt.<br><br>🌿 **Phương Dược Cổ Truyền**: Lương y khuyên dùng bài thuốc kinh điển **Ngân Kiều Tán** để thanh nhiệt giải độc, sơ phong giải biểu, thông phế chỉ khái.<br>- **Thành phần**: Kim ngân hoa (15g), Liên kiều (15g), Cát cánh (9g), Bạc hà (6g), Kinh giới tuệ (12g), Đạm đậu xị (9g), Cam thảo (6g).<br>- **Cách dùng**: Sắc uống nóng ấm, kết hợp xông hơi sả chanh bưởi để ra mồ hôi giải biểu hàn hiệu quả.<br><br>🗺️ **Di Sản Thảo Dược**: Cây Kim ngân hoa hoang dã bản địa tại vùng sườn dốc mát mẻ của núi đá **đèo Hải Vân** có dược lực sát khuẩn tự nhiên vô cùng mạnh mẽ, là vị thuốc vàng chữa ôn dịch phổi của người xưa.`;
        }
        
        if (q.includes('yếu') || q.includes('mệt') || q.includes('suy nhược') || q.includes('nhạt') || q.includes('thiếu huyết') || q.includes('suy huyết') || q.includes('thiếu máu')) {
            return `🩺 **Y Lý Phương Đông**: Thể trạng gầy yếu, ăn uống không tiêu, cơ thể suy nhược mệt mỏi kinh niên là biểu hiện rõ nét của **Khí Huyết Song Hao**. Tỳ vị suy yếu làm mất đi nguồn sinh hóa khí huyết nuôi dưỡng ngũ tạng lục phủ toàn thân.<br><br>🌿 **Phương Dược Cổ Truyền**: Lương y khuyên dùng bài thuốc hoàn hảo **Thập Toàn Đại Bổ** để đại bổ cả khí lẫn huyết, bồi bổ nguyên khí tận gốc.<br>- **Thành phần**: Nhân sâm (12g), Bạch truật (12g), Phục linh (12g), Đương quy (12g), Xuyên khung (8g), Bạch thược (12g), Thục địa (15g), Hoàng kỳ (12g), Cam thảo chích (6g), Nhục quế (4g).<br>- **Cách dùng**: Sắc nước ngày 1 thang, chia 2 lần uống lúc ấm. Kiêng kỵ đồ sống lạnh khó tiêu.<br><br>🗺️ **Di Sản Thảo Dược**: Đương quy và Hoàng kỳ hiện đang được nghiên cứu trồng trọt thí điểm tại thung lũng sinh thái sạch **Hòa Bắc** (Hòa Vang, Đà Nẵng) theo tiêu chuẩn xanh ngặt nghèo, đảm bảo rễ thuốc hoàn toàn tinh khiết không hóa chất.`;
        }
        
        if (q.includes('dạ dày') || q.includes('bao tử') || q.includes('tiêu hóa') || q.includes('ruột') || q.includes('bụng') || q.includes('tiêu chảy')) {
            return `🩺 **Y Lý Phương Đông**: Đau dạ dày, viêm loét đường tiêu hóa hoặc trào ngược tỳ vị phát sinh do **Can Khí Phạm Vị** hoặc **Tỳ Vị Hư Hàn**. Tâm lý uất ức lo nghĩ (thuộc Can) kết hợp ăn uống thiếu khoa học làm tỳ vị mất vận hóa khí, khí nghịch gây đau tức nóng rát.<br><br>🌿 **Phương Dược Cổ Truyền**: Lương y khuyên dùng bài thuốc **Tứ Quân Tử Thang** để kiện tỳ vị, ích khí, hòa trung tiêu giảm trào ngược.<br>- **Thành phần**: Đảng sâm (12g), Bạch truật (12g), Phục linh (12g), Cam thảo chích (6g), Sa nhân (6g), Trần bì (6g).<br>- **Cách dùng**: Sắc uống ấm nóng trước bữa ăn 30 phút, ngày 1 thang.<br><br>🗺️ **Di Sản Thảo Dược**: Tinh bột nghệ đỏ bản địa Sơn Trà cùng Phục linh hữu cơ được bảo tồn tại **Hòa Phú** (Đà Nẵng) chứa chất curcumin tự nhiên cùng các saponin giúp kháng viêm dạ dày cực tốt, xoa dịu các vết loét tỳ vị thần tốc.`;
        }
        
        return text ? (warningPrefix + text) : (warningPrefix + `🩺 **Y Lý Phương Đông**: Theo y học cổ truyền Đông y, sức khỏe và bệnh tật của con người nằm ở sự mất cân bằng giữa **Âm và Dương**, sự tắc nghẽn kinh lạc hoặc suy giảm chức năng **Tạng Phủ**. Cơ thể là một khối thống nhất, cần điều hòa từ gốc thay vì chỉ chữa ngọn.<br><br>🌿 **Phương Dược Cổ Truyền**: Để nâng cao sức khỏe căn bản và thanh lọc tạng phủ hằng ngày, lương y khuyên dưỡng sinh:<br>- **Dưỡng sinh Tỳ Vị**: Ăn uống đúng giờ, tránh xa đồ chiên rán cay nóng. Uống trà bồ công anh hoặc trà hoa cúc mỗi sáng.<br>- **Dưỡng Thận - Cân bằng Âm Dương**: Ngâm chân nước ấm với gừng + muối hạt 15 phút trước khi ngủ.<br>- **Thông Kinh Hoạt Lạc**: Tập dưỡng sinh Thái Cực Quyền hoặc đi bộ sáng sớm 30 phút.<br><br>🗺️ **Di Sản Thảo Dược**: Mời quý nhân trải nghiệm cẩm nang 20+ bài thuốc cổ phương Đông y và bản đồ vườn thảo dược bảo tồn xanh Đà Nẵng ngay trên hệ thống EcoHeritage AI.`);
    }

    // Hàm chuyển đổi Markdown đơn giản sang HTML cho chatbot
    // Hàm chuyển đổi Markdown đơn giản sang HTML cho chatbot nâng cấp v6.5
    function formatChatMarkdown(text) {
        if (!text) return '';
        
        let escaped = escapeHTML(text);
        
        // Chuyển đổi in đậm và in nghiêng chuẩn Markdown
        let formatted = escaped
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>');

        // Định dạng block Khuyến cáo y khoa (Màu đỏ/cảnh báo)
        const khuyenCaoRegex = /(⚠️\s*KHUYẾN CÁO Y KHOA:[^]*?)(?=(🩺|🌿|🗺️|$))/gi;
        formatted = formatted.replace(khuyenCaoRegex, (match, p1) => {
            return '<div class="alert alert-danger d-flex align-items-start gap-2 border-0 rounded-3 p-2.5 mb-3 shadow-sm" style="background: rgba(239, 68, 68, 0.08); color: #dc3545; font-size: 0.85rem;">' +
                '<i class="bi bi-exclamation-triangle-fill flex-shrink-0 mt-0.5" style="font-size: 1.1rem;"></i>' +
                '<div>' + p1.replace(/⚠️\s*KHUYẾN CÁO Y KHOA:/i, '<strong>⚠️ KHUYẾN CÁO Y KHOA:</strong>') + '</div>' +
            '</div>';
        });

        // Định dạng block Y Lý Phương Đông (Màu xanh lá nhẹ)
        const yLyRegex = /(🩺\s*(?:<strong>)?Y Lý Phương Đông(?:<\/strong>)?:[^]*?)(?=(🌿|🗺️|⚠️|$))/gi;
        formatted = formatted.replace(yLyRegex, (match, p1) => {
            const cleanText = p1.replace(/🩺\s*(?:<strong>)?Y Lý Phương Đông(?:<\/strong>)?:/i, '').trim();
            return '<div class="premium-chat-section mb-3 p-3 rounded-3" style="background: rgba(46, 179, 102, 0.05); border-left: 4px solid var(--primary);">' +
                '<div class="fw-bold mb-2 text-success" style="font-size: 0.95rem;"><i class="bi bi-heart-pulse-fill me-2"></i>🩺 Y Lý Phương Đông</div>' +
                '<div style="font-size: 0.9rem; line-height: 1.6; color: var(--text-main);">' + cleanText + '</div>' +
            '</div>';
        });

        // Định dạng block Phương Dược Cổ Truyền (Màu xanh dương nhẹ)
        const phuongDuocRegex = /(🌿\s*(?:<strong>)?Phương Dược Cổ Truyền(?:<\/strong>)?:[^]*?)(?=(🩺|🗺️|⚠️|$))/gi;
        formatted = formatted.replace(phuongDuocRegex, (match, p1) => {
            const cleanText = p1.replace(/🌿\s*(?:<strong>)?Phương Dược Cổ Truyền(?:<\/strong>)?:/i, '').trim();
            return '<div class="premium-chat-section mb-3 p-3 rounded-3" style="background: rgba(13, 110, 253, 0.05); border-left: 4px solid #0d6efd;">' +
                '<div class="fw-bold mb-2 text-primary" style="font-size: 0.95rem;"><i class="bi bi-mortar-pestle me-2"></i>🌿 Phương Dược Cổ Truyền</div>' +
                '<div style="font-size: 0.9rem; line-height: 1.6; color: var(--text-main);">' + cleanText + '</div>' +
            '</div>';
        });

        // Định dạng block Di Sản Thảo Dược (Màu cam nhẹ)
        const diSanRegex = /(🗺️\s*(?:<strong>)?Di Sản Thảo Dược(?:<\/strong>)?:[^]*?)(?=(🩺|🌿|⚠️|$))/gi;
        formatted = formatted.replace(diSanRegex, (match, p1) => {
            const cleanText = p1.replace(/🗺️\s*(?:<strong>)?Di Sản Thảo Dược(?:<\/strong>)?:/i, '').trim();
            return '<div class="premium-chat-section mb-3 p-3 rounded-3" style="background: rgba(245, 158, 11, 0.05); border-left: 4px solid #f59e0b;">' +
                '<div class="fw-bold mb-2" style="font-size: 0.95rem; color: #b45309;"><i class="bi bi-geo-alt-fill me-2"></i>🗺️ Di Sản Thảo Dược</div>' +
                '<div style="font-size: 0.9rem; line-height: 1.6; color: var(--text-main);">' + cleanText + '</div>' +
            '</div>';
        });

        // Thay thế các ký tự xuống dòng bằng br
        formatted = formatted.replace(/\n/g, '<br>');
        
        return formatted;
    }

    // Gọi Gemini API hoặc fallback nội bộ
    async function fetchGeminiResponse(query) {
        const systemPrompt = `Bạn là Lương Y số EcoBot - một chuyên gia y học cổ truyền Đông y Việt Nam. Bạn tư vấn bài thuốc cổ phương, thảo dược, dược tính, y lý Đông y. Luôn trả lời bằng tiếng Việt và gắn liền với hệ sinh thái bảo tồn thảo dược Đà Nẵng. BẮT BUỘC đầu câu trả lời phải có câu khuyến cáo viết hoa nổi bật: "⚠️ KHUYẾN CÁO Y KHOA: Mọi thông tin tư vấn từ chatbot chỉ mang tính tham khảo, không thay thế việc bắt mạch và chỉ định từ bác sĩ y học cổ truyền." Nội dung trả lời phải có 3 phần rõ ràng: 🩺 Y Lý Phương Đông, 🌿 Phương Dược Cổ Truyền (kèm thành phần + liều lượng + cách dùng), 🗺️ Di Sản Thảo Dược (liên kết với các vùng bảo tồn Đà Nẵng).`;

        // 1. Thử gọi qua Vercel API Proxy trước (để ẩn API key)
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, systemPrompt })
            });
            if (response.ok) {
                const data = await response.json();
                if (data.text) return data.text;
            } else {
                console.warn('Vercel Proxy chat lỗi, chuyển sang gọi trực tiếp từ client...');
            }
        } catch (error) {
            console.log('Không tìm thấy API Proxy hoặc chạy offline, gọi trực tiếp từ client...');
        }

        // 2. Fallback gọi trực tiếp từ client-side nếu có config.js apiKey
        if (!apiKey) {
            return getLocalPremiumFallback(query);
        }

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ parts: [{ text: query }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024
                    }
                })
            });

            if (!response.ok) throw new Error('Gemini API error: ' + response.status);
            
            const data = await response.json();
            const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (aiText) {
                return aiText;
            }
            return getLocalPremiumFallback(query);
        } catch (error) {
            console.warn('Gemini API không khả dụng, dùng fallback nội bộ:', error);
            return getLocalPremiumFallback(query);
        }
    }

    // Biến DOM và cấu hình Chatbot
    const $chatBody = $('#chatBody');
    const $chatInput = $('#chatInput');
    let lastChatTime = 0;
    const CHAT_COOLDOWN_MS = 2000;

    // Toggle hiển thị cửa sổ chat
    $(document).on('click', '#toggleChatBtn', function() {
        $('#floatingChatWindow').toggleClass('active');
    });

    // Sự kiện Click nút gợi ý nhanh
    $(document).on('click', '.quick-reply-btn', function() {
        const cleanText = $(this).text().replace(/^[^\w\s]+/, '').trim();
        $chatInput.val(cleanText);
        $('#chatSend').trigger('click');
    });

    // Load lịch sử chat từ LocalStorage
    function loadChatHistory() {
        if (!$chatBody.length) return;
        const history = readStorage('eco_bot_chats_history', []) || [];
        if (Array.isArray(history) && history.length > 0) {
            $chatBody.empty();
            history.forEach(msg => {
                addChatMessage(msg.text, msg.isUser, false);
            });
        }
    }

    // Hàm chèn tin nhắn chat
    function addChatMessage(text, isUser = false, saveToHistory = true) {
        if (!$chatBody.length) return;
        const time = new Date().getHours().toString().padStart(2, '0') + ':' + new Date().getMinutes().toString().padStart(2, '0');
        
        let processedText = text;
        if (!isUser && !text.includes('<div class="ai-local-reply">')) {
            processedText = formatChatMarkdown(text) +
                `<br><small class="text-danger d-block fw-semibold mt-2" style="font-size: 0.72rem; line-height: 1.3;"><i class="bi bi-exclamation-triangle-fill me-1"></i> Khuyến cáo: Mọi tư vấn và bài thuốc chỉ mang tính chất tham khảo học thuật, vui lòng bắt mạch bốc thuốc trực tiếp tại cơ sở y tế y học cổ truyền trước khi áp dụng.</small>`;
        }
        
        const html = isUser ? `
            <div class="chat-message user-message">
                <div class="message-content">
                    <div class="message-bubble user-bubble"><p class="mb-0">${text}</p></div>
                    <span class="message-time d-block text-end" style="font-size:0.7rem; color:#a5bcb0; margin-top:2px;">${time}</span>
                </div>
            </div>` : `
            <div class="chat-message ai-message">
                <div class="message-avatar"><i class="bi bi-robot text-primary"></i></div>
                <div class="message-content">
                    <div class="message-bubble ai-bubble">${processedText}</div>
                    <span class="message-time d-block" style="font-size:0.7rem; color:#a5bcb0; margin-top:2px; margin-left:10px;">${time} - Lương Y EcoBot</span>
                </div>
            </div>`;
            
        $chatBody.append(html);
        
        // Cuộn mượt bằng gán trực tiếp scrollTop = scrollHeight kết hợp trì hoãn để đảm bảo DOM render hoàn tất
        if ($chatBody[0]) {
            $chatBody[0].scrollTop = $chatBody[0].scrollHeight;
            setTimeout(() => {
                if ($chatBody[0]) $chatBody[0].scrollTop = $chatBody[0].scrollHeight;
            }, 50);
            setTimeout(() => {
                if ($chatBody[0]) $chatBody[0].scrollTop = $chatBody[0].scrollHeight;
            }, 150);
        }

        if (saveToHistory) {
            let history = readStorage('eco_bot_chats_history', []) || [];
            if (!Array.isArray(history)) history = [];
            history.push({ text: text, isUser: isUser, time: time });
            // Giữ lại 30 tin nhắn gần nhất thay vì 10 để trải nghiệm mạch lạc hơn
            if (history.length > 30) {
                history.shift();
            }
            writeStorage('eco_bot_chats_history', history);
        }
    }

    let isChatting = false;
    
    // Cho phép nhấn Enter để gửi chat
    $(document).on('keypress', '#chatInput', function(e) {
        if (e.which === 13 && !e.shiftKey) {
            e.preventDefault();
            $('#chatSend').trigger('click');
        }
    });

    $('#chatSend').on('click', async function () {
        if (isChatting) return;
        
        // Rate-limiting: Chặn spam 2 giây giữa các tin nhắn
        const now = Date.now();
        if (now - lastChatTime < CHAT_COOLDOWN_MS) {
            showToast('Vui lòng đợi vài giây trước khi gửi tin tiếp theo!', 'warning');
            return;
        }
        lastChatTime = now;
        
        const query = $chatInput.val().trim();
        if (!query) return;

        isChatting = true;
        $('#chatSend').prop('disabled', true).html('<i class="bi bi-hourglass-split"></i>');

        addChatMessage(query, true);
        $chatInput.val('');

        // Thêm bong bóng chờ gõ
        const typingId = 'typing-' + Date.now();
        $chatBody.append(`
            <div class="chat-message ai-message" id="${typingId}">
                <div class="message-avatar"><i class="bi bi-robot text-primary"></i></div>
                <div class="message-content">
                    <div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>
                </div>
            </div>
        `);
        $chatBody.animate({ scrollTop: $chatBody[0].scrollHeight }, 300);

        // Lưu lượt chat vào LocalStorage phục vụ thành tựu
        const currentUserForChat = readStorage('gh_user', null);
        if (currentUserForChat && currentUserForChat.email) {
            let chatCount = parseInt(localStorage.getItem('eco_bot_chats_' + currentUserForChat.email) || 0);
            chatCount++;
            localStorage.setItem('eco_bot_chats_' + currentUserForChat.email, chatCount);
            localStorage.setItem('eco_bot_chats', chatCount);
        } else {
            let chatCount = parseInt(localStorage.getItem('eco_bot_chats') || 0);
            chatCount++;
            localStorage.setItem('eco_bot_chats', chatCount);
        }

        const lowerQuery = query.toLowerCase();
        
        setTimeout(async () => {
            $('#' + typingId).remove();

            // 1. Phản hồi chào hỏi vị Lương Y
            const greetings = ['chào', 'hello', 'xin chào', 'bạn là ai', 'helo'];
            const isGreeting = greetings.some(g => lowerQuery.includes(g) || lowerQuery === g.trim());

            if (isGreeting) {
                addChatMessage(`Kính chào quý nhân! 🙏 Tôi là Lương y số EcoBot của hệ sinh thái **EcoHeritage AI**. Tôi có thể bốc thuốc, tư vấn y lý dược tính thảo dược Đà Nẵng. Quý nhân cần tra cứu vị thuốc nào hằng ngày?`, false);
                finishChatting();
                return;
            }

            // 2. Tra cứu cơ sở dữ liệu bài thuốc 20+ nội bộ trước (Chính xác 100%)
            const localMatch = db.herbs.find(h => 
                lowerQuery.includes(h.name.toLowerCase()) || 
                h.name.toLowerCase().includes(lowerQuery)
            );

            if (localMatch) {
                const localHtml = `
                    <div class="ai-local-reply">
                        <p class="mb-1"><i class="bi bi-check-circle-fill text-success"></i> Thưa quý nhân, tôi tìm thấy cẩm nang <strong>${localMatch.name}</strong>:</p>
                        <ul class="mb-3 ps-3 small text-secondary">
                            <li><strong>Khoa học:</strong> <em>${localMatch.scientific}</em></li>
                            <li><strong>Phân nhóm:</strong> ${localMatch.category}</li>
                            <li><strong>Dược chất:</strong> ${localMatch.ingredients.substring(0, 100)}...</li>
                            <li><strong>Cách dùng chính:</strong> ${localMatch.efficacy}</li>
                        </ul>
                        <button class="btn btn-sm btn-success w-100 py-2 fw-bold btn-view-detail" data-id="${localMatch.id}">
                            <i class="bi bi-eye"></i> Xem quy trình bào chế sắc thuốc chi tiết
                        </button>
                        <small class="text-danger d-block fw-semibold mt-2" style="font-size: 0.72rem; line-height: 1.3;"><i class="bi bi-exclamation-triangle-fill me-1"></i> Khuyến cáo: Mọi tư vấn và bài thuốc chỉ mang tính chất tham khảo học thuật, vui lòng bắt mạch bốc thuốc trực tiếp tại cơ sở y tế y học cổ truyền trước khi áp dụng.</small>
                    </div>
                `;
                addChatMessage(localHtml, false);
            } else {
                // 3. Không khớp nội bộ -> Gọi Gemini API
                const aiResponse = await fetchGeminiResponse(query);
                addChatMessage(aiResponse, false);
            }

            finishChatting();
        }, 800);
    });

    function finishChatting() {
        isChatting = false;
        $('#chatSend').prop('disabled', false).html('<i class="bi bi-send-fill fs-5"></i>');
    }


    // ─── 13. KHỞI CHẠY HỆ THỐNG BIỂU ĐỒ & TRANG WEB ─────────────
    function initCharts() {
        const $yieldCanvas = $('#yieldChart');
        const $categoryCanvas = $('#categoryChart');

        if ($yieldCanvas.length) {
            const ctxYield = $yieldCanvas[0].getContext('2d');
            new Chart(ctxYield, {
                type: 'bar',
                data: {
                    labels: ['Sơn Trà', 'Bà Nà', 'Ngũ Hành Sơn', 'Hải Vân', 'Hòa Bắc', 'Hòa Phú'],
                    datasets: [{
                        label: 'Sản lượng dược liệu sạch (Tấn/Năm)',
                        data: [42, 65, 18, 29, 35, 21],
                        backgroundColor: [
                            'rgba(46, 179, 102, 0.85)',
                            'rgba(220, 53, 69, 0.85)',
                            'rgba(255, 193, 7, 0.85)',
                            'rgba(13, 110, 253, 0.85)',
                            'rgba(23, 162, 184, 0.85)',
                            'rgba(111, 66, 193, 0.85)'
                        ],
                        borderColor: ['#2eb366', '#dc3545', '#ffc107', '#0d6efd', '#17a2b8', '#6f42c1'],
                        borderWidth: 1.5,
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.03)' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        if ($categoryCanvas.length) {
            const ctxCategory = $categoryCanvas[0].getContext('2d');
            // Tính toán số lượng bài thuốc theo nhóm phân loại từ dữ liệu thực
            const categoryCounts = {};
            const categoryColors = {
                'Chữa bệnh': '#dc3545',
                'An thần': '#ffc107', 
                'Bổ dưỡng': '#0d6efd',
                'Giải độc': '#2eb366',
                'Làm đẹp': '#e91e8c',
                'Khác': '#6f42c1'
            };
            db.herbs.forEach(h => {
                const cat = h.category || 'Khác';
                categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
            });
            const categoryLabels = Object.keys(categoryCounts);
            const categoryData = Object.values(categoryCounts);
            const categoryBgColors = categoryLabels.map(label => categoryColors[label] || '#6f42c1');

            new Chart(ctxCategory, {
                type: 'doughnut',
                data: {
                    labels: categoryLabels,
                    datasets: [{
                        data: categoryData,
                        backgroundColor: categoryBgColors,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { font: { family: 'Outfit', size: 12 } }
                        }
                    },
                    cutout: '60%'
                }
            });
        }
    }

    // Đăng ký nhận bản tin ở Footer
    $('.newsletter-group').each(function() {
        const $group = $(this);
        const $button = $group.find('button');
        const $input = $group.find('input[type="email"]');
        
        $button.on('click', function(e) {
            e.preventDefault();
            const email = $input.val().trim();
            if (!email || !isValidEmail(email)) {
                showToast('Email nhận tin không hợp lệ!', 'error');
                return;
            }
            $input.val('');
            showToast('Đăng ký nhận tin tức sức khỏe thành công! 📬', 'success');
        });
        
        $input.on('keypress', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                $button.trigger('click');
            }
        });
    });

    // ==========================================================================
    // ECOHERITAGE AI - PHASE 2 ADDITIONS (ANIMATION & PREMIUM UI SYSTEMS)
    // ==========================================================================

    function initLenis() {
        // Đã tắt Lenis vì gây lag cuộn trang và chặn scroll chatbot.
        // Sử dụng native CSS scroll-behavior: smooth thay thế.
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    function initVanillaTilt() {
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
                max: 12,
                speed: 300,
                glare: true,
                "max-glare": 0.2,
            });
        }
    }

    function initTextScramble() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        function scramble(el, text, duration = 1500) {
            let iteration = 0;
            const interval = setInterval(() => {
                el.innerText = text.split('').map((char, index) => {
                    if (index < iteration) {
                        return text[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('');
                if (iteration >= text.length) {
                    clearInterval(interval);
                }
                iteration += text.length / (duration / 30);
            }, 30);
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const $el = $(entry.target);
                    const originalText = $el.data('original-text') || $el.text();
                    $el.data('original-text', originalText);
                    scramble(entry.target, originalText);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        $('.scramble-text').each(function() {
            observer.observe(this);
        });
    }

    function initScrollProgressBar() {
        const $bar = $('#scrollProgressBar');
        if (!$bar.length) return;
        $(window).on('scroll', function() {
            const scrolled = $(window).scrollTop();
            const docHeight = $(document).height() - $(window).height();
            const pct = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
            $bar.css('width', pct + '%');
        });
    }

    function initStaggerScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = $(entry.target).find('.stagger-item');
                    items.each(function(index) {
                        const $item = $(this);
                        setTimeout(() => {
                            $item.addClass('in-view').css({
                                opacity: 1,
                                transform: 'translateY(0)'
                            });
                        }, index * 120);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        $('.stagger-container').each(function() {
            $(this).find('.stagger-item').css({
                opacity: 0,
                transform: 'translateY(30px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease'
            });
            observer.observe(this);
        });
    }

    function initParallaxSections() {
        $(window).on('scroll', function() {
            const scrolled = $(window).scrollTop();
            $('.parallax-bg').each(function() {
                const speed = parseFloat($(this).data('parallax-speed') || 0.15);
                const offset = -(scrolled * speed);
                $(this).css('background-position-y', offset + 'px');
            });
        });
    }
    // ─── 14. NÚT CUỘN LÊN ĐẦU TRANG (BACK TO TOP) ─────────────
    function initBackToTop() {
        const $btn = $('#backToTopBtn');
        if (!$btn.length) return;

        // Hiện/ẩn nút khi cuộn trang — xuất hiện khi scroll > 300px
        $(window).on('scroll', function() {
            if ($(window).scrollTop() > 300) {
                $btn.addClass('visible');
            } else {
                $btn.removeClass('visible');
            }
        });

        // Click cuộn mượt lên đầu trang
        $btn.on('click', function() {
            $('html, body').animate({ scrollTop: 0 }, 600, 'swing');
        });
    }

    // ─── 15. XÓA LỊCH SỬ CHATBOT ──────────────────────────────
    $(document).on('click', '#clearChatHistoryBtn', function() {
        if (!confirm('Bạn có chắc muốn xóa toàn bộ lịch sử trò chuyện?')) return;
        
        // Xóa lịch sử trong LocalStorage
        localStorage.removeItem('eco_bot_chats_history');
        
        // Xóa nội dung chat body, giữ lại tin nhắn chào mừng mặc định
        const $chatBody = $('#chatBody');
        if ($chatBody.length) {
            $chatBody.html(`
                <div class="chat-message ai-message mt-2">
                    <div class="message-avatar"><i class="bi bi-robot"></i></div>
                    <div class="message-content">
                        <div class="message-bubble ai-bubble">
                            <p class="mb-0">Kính chào quý nhân! 🙏 Tôi là <strong>Lương y số EcoBot</strong>. Tôi có thể tư vấn đầy đủ về các bài thuốc cổ truyền (VD: Thập Toàn Đại Bổ, Quy Tỳ Thang...). Bạn đang gặp vấn đề sức khỏe nào?</p>
                        </div>
                        <span class="message-time d-block" style="font-size: 0.7rem; color: #8fa096; margin-top: 4px; margin-left: 10px;">EcoHeritage AI</span>
                    </div>
                </div>
            `);
        }
        
        showToast('Đã xóa lịch sử trò chuyện thành công! 🗑️', 'success');
    });

    // ─── 16. HỖ TRỢ TRUY CẬP (ACCESSIBILITY) ───────────────────
    function initAccessibility() {
        $('#darkModeToggle').attr('aria-label', 'Chuyển đổi giao diện tối sáng');
        $('.password-toggle-btn').attr('aria-label', 'Hiển thị mật khẩu');
        $('.btn-close:not([aria-label])').attr('aria-label', 'Đóng');
        $('#searchClearBtn').attr('aria-label', 'Xóa từ khóa tìm kiếm');
    }

    // KHỞI CHẠY TỔNG HỢP CÁC TRANG
    initDarkMode();
    autoSetActiveNav();
    checkAuthStatus();
    initHeroSection();
    renderHerbs();
    initMap();
    initCharts();
    initProfilePage();
    initAdminPage();
    loadChatHistory();

    // Khởi chạy Phase 2 premium systems
    initLenis();
    initVanillaTilt();
    // initTextScramble(); // Đã tắt — không còn phần tử .scramble-text nào
    initScrollProgressBar();
    initStaggerScroll();
    initParallaxSections();
    initBackToTop(); // Phase 4: Nút cuộn lên đầu trang
    initAccessibility(); // Tự động hóa aria-label cho Accessibility

});
