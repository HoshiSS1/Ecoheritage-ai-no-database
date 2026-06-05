# ðŸŒ¿ EcoHeritage AI â€” Bá»™ RÃ ng Buá»™c & Káº¿ Hoáº¡ch NÃ¢ng Cáº¥p ToÃ n Diá»‡n
> **PhiÃªn báº£n:** v6.0 | **NgÃ y láº­p:** 2026 | **Ãp dá»¥ng cho:** Bootstrap + CSS + JS + jQuery + HTML  
> **Má»¥c tiÃªu:** Bá»™ quy táº¯c báº¯t buá»™c AI / láº­p trÃ¬nh viÃªn pháº£i tuÃ¢n thá»§ khi code, test, sá»­a lá»—i dá»± Ã¡n EcoHeritage AI

---

## ðŸ“‹ Má»¤C Lá»¤C

1. [Tá»•ng Quan Dá»± Ãn](#1-tá»•ng-quan-dá»±-Ã¡n)
2. [Bá»™ RÃ ng Buá»™c Báº¯t Buá»™c (AI MUST Rules)](#2-bá»™-rÃ ng-buá»™c-báº¯t-buá»™c-ai-must-rules)
3. [Káº¿ Hoáº¡ch NÃ¢ng Cáº¥p 4 Giai Äoáº¡n](#3-káº¿-hoáº¡ch-nÃ¢ng-cáº¥p-4-giai-Ä‘oáº¡n)
4. [Kiá»ƒm Tra & Test Báº¯t Buá»™c (QA Checklist)](#4-kiá»ƒm-tra--test-báº¯t-buá»™c-qa-checklist)
5. [Danh SÃ¡ch Lá»—i ÄÃ£ Biáº¿t Pháº£i Sá»­a](#5-danh-sÃ¡ch-lá»—i-Ä‘Ã£-biáº¿t-pháº£i-sá»­a)
6. [Quy Táº¯c MÃ u Sáº¯c & Thiáº¿t Káº¿](#6-quy-táº¯c-mÃ u-sáº¯c--thiáº¿t-káº¿)
7. [Quy Táº¯c Báº£o Máº­t Báº¯t Buá»™c](#7-quy-táº¯c-báº£o-máº­t-báº¯t-buá»™c)
8. [Chuáº©n Dá»¯ Liá»‡u LocalStorage](#8-chuáº©n-dá»¯-liá»‡u-localstorage)

---

## 1. Tá»”NG QUAN Dá»° ÃN

| Thuá»™c tÃ­nh | GiÃ¡ trá»‹ |
|---|---|
| **TÃªn dá»± Ã¡n** | EcoHeritage AI |
| **MÃ´ táº£** | Ná»n táº£ng tra cá»©u tháº£o dÆ°á»£c + báº£n Ä‘á»“ GPS di sáº£n y há»c cá»• truyá»n ÄÃ  Náºµng |
| **Stack báº¯t buá»™c** | HTML5 Â· CSS3 Â· Bootstrap 5.3.2 Â· jQuery 3.7.1 Â· Vanilla JS (ES6+) |
| **CDN chÃ­nh** | Bootstrap Icons 1.11.1 Â· AOS 2.3.4 Â· Chart.js Â· Leaflet.js |
| **Font chÃ­nh** | `Outfit` (Google Fonts) â€” KHÃ”NG thay Ä‘á»•i |
| **MÃ u chá»§ Ä‘áº¡o** | `hsl(145, 63%, 42%)` â€” Xanh lÃ¡ tháº£o dÆ°á»£c |
| **CSDL** | LocalStorage â€” key: `eco_heritage_db_v7` |
| **File cá»‘t lÃµi** | `data.js` â†’ `script.js` â†’ `style.css` â†’ `v5-premium.css` |

### Cáº¥u trÃºc file báº¯t buá»™c

```
ecoheritage/
â”œâ”€â”€ index.html          â† Trang chá»§ (Hero + Dashboard + Charts)
â”œâ”€â”€ dictionary.html     â† Tá»« Ä‘iá»ƒn 20+ bÃ i thuá»‘c + modal chi tiáº¿t
â”œâ”€â”€ map.html            â† Báº£n Ä‘á»“ Leaflet GPS 12+ vÃ¹ng + Ä‘Ã¡nh giÃ¡
â”œâ”€â”€ profile.html        â† Há»“ sÆ¡ cÃ¡ nhÃ¢n + thÃ nh tá»±u
â”œâ”€â”€ admin.html          â† Cá»•ng quáº£n trá»‹ CRUD (chá»‰ admin)
â”œâ”€â”€ data.js             â† Database trung tÃ¢m (EcoHeritageDefaultData)
â”œâ”€â”€ script.js           â† Logic tá»•ng há»£p toÃ n bá»™ trang
â”œâ”€â”€ style.css           â† CSS Design Tokens + layout cÆ¡ báº£n
â””â”€â”€ v5-premium.css      â† CSS nÃ¢ng cao premium
```

---

## 2. Bá»˜ RÃ€NG BUá»˜C Báº®T BUá»˜C (AI MUST RULES)

> âš ï¸ **AI / láº­p trÃ¬nh viÃªn pháº£i Ä‘á»c vÃ  tuÃ¢n thá»§ 100% cÃ¡c quy táº¯c dÆ°á»›i Ä‘Ã¢y trÆ°á»›c khi viáº¿t báº¥t ká»³ dÃ²ng code nÃ o.**

---

### ðŸ”´ NHÃ“M A â€” QUY Táº®C TUYá»†T Äá»I (Vi pháº¡m = tá»« chá»‘i build)

#### A1. KhÃ´ng Ä‘Æ°á»£c thay Ä‘á»•i tech stack
```
âŒ Cáº¤MTUYá»†T Äá»I:
- ThÃªm React, Vue, Angular, Svelte
- ThÃªm TypeScript
- ThÃªm Node.js / backend server
- ThÃªm Database thá»±c (MySQL, MongoDB...)
- Thay jQuery báº±ng fetch API thuáº§n
- Thay Bootstrap báº±ng Tailwind / Material UI

âœ… CHá»ˆ DÃ™NG:
- HTML5 + CSS3 + Bootstrap 5.3.2
- jQuery 3.7.1 ($ syntax)
- Vanilla JS ES6+
- LocalStorage lÃ m CSDL
```

#### A2. KhÃ´ng Ä‘Æ°á»£c phÃ¡ vá»¡ CSDL LocalStorage
```javascript
// âœ… ÄÃšNG â€” LuÃ´n dÃ¹ng key cá»‘ Ä‘á»‹nh
const DB_KEY = 'eco_heritage_db_v7';
const USER_KEY = 'gh_user';
const USERS_LIST_KEY = 'eco_heritage_users';

// âŒ SAI â€” Tuyá»‡t Ä‘á»‘i khÃ´ng Ä‘á»•i tÃªn key
localStorage.setItem('eco_db_new', ...);   // Cáº¤MTUYá»†T Äá»I
localStorage.setItem('database', ...);      // Cáº¤MTUYá»†T Äá»I
```

#### A3. LuÃ´n dÃ¹ng hÃ m `escapeHTML()` khi render dá»¯ liá»‡u ngÆ°á»i dÃ¹ng vÃ o DOM
```javascript
// âœ… ÄÃšNG
$('#element').html(escapeHTML(userInput));

// âŒ SAI â€” XSS nguy hiá»ƒm
$('#element').html(userInput);             // Cáº¤MTUYá»†T Äá»I
document.getElementById('el').innerHTML = userInput; // Cáº¤MTUYá»†T Äá»I
```

#### A4. LuÃ´n báº£o vá»‡ trang Admin
```javascript
// âœ… ÄÃšNG â€” Kiá»ƒm tra á»Ÿ Ä‘áº§u má»—i function admin
function initAdminPage() {
    const user = readStorage('gh_user', null);
    if (!user || user.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }
    // ... code admin
}
```

#### A5. KhÃ´ng hardcode API key trong code production
```javascript
// âŒ SAI â€” API key lá»™ trong source code
const GEMINI_API_KEY = "AIzaSyXXXXXXXXXXXXXXX";  // NGUY HIá»‚M

// âœ… ÄÃšNG â€” Äáº·t trong config tÃ¡ch biá»‡t hoáº·c biáº¿n mÃ´i trÆ°á»ng
// File: config.js (thÃªm vÃ o .gitignore náº¿u dÃ¹ng git)
const APP_CONFIG = { geminiKey: 'YOUR_KEY_HERE' };
```

---

### ðŸŸ¡ NHÃ“M B â€” QUY Táº®C CHáº¤T LÆ¯á»¢NG (Vi pháº¡m = cáº§n sá»­a trÆ°á»›c khi merge)

#### B1. Chuáº©n jQuery â€” LuÃ´n dÃ¹ng `$(document).ready()`
```javascript
// âœ… ÄÃšNG
$(document).ready(function() {
    // toÃ n bá»™ code chÃ­nh
});

// âŒ SAI
window.onload = function() { ... }  // KhÃ´ng nháº¥t quÃ¡n vá»›i codebase
```

#### B2. KhÃ´ng dÃ¹ng `!important` vÃ´ tá»™i váº¡ trong CSS
```css
/* âœ… ÄÃšNG â€” Chá»‰ dÃ¹ng !important Ä‘á»ƒ override Bootstrap cá»¥ thá»ƒ */
.hero-premium-bg { background: linear-gradient(...) !important; }

/* âŒ SAI â€” !important trÃ n lan */
.my-button { color: red !important; margin: 10px !important; ... }
```

#### B3. LuÃ´n cÃ³ fallback cho áº£nh
```html
<!-- âœ… ÄÃšNG -->
<img src="./images/herb.png" 
     onerror="this.src='./images/hero_vector.png'" 
     alt="MÃ´ táº£ áº£nh">

<!-- âŒ SAI -->
<img src="./images/herb.png">
```

#### B4. Má»i thao tÃ¡c LocalStorage pháº£i dÃ¹ng `readStorage()` / `writeStorage()`
```javascript
// âœ… ÄÃšNG â€” DÃ¹ng hÃ m helper cÃ³ try/catch
const data = readStorage('eco_heritage_db_v7', null);

// âŒ SAI â€” Trá»±c tiáº¿p, khÃ´ng xá»­ lÃ½ lá»—i JSON parse
const data = JSON.parse(localStorage.getItem('eco_heritage_db_v7'));
```

#### B5. LuÃ´n debounce sá»± kiá»‡n input tÃ¬m kiáº¿m
```javascript
// âœ… ÄÃšNG
$('#searchHerbInput').on('input', debounce(function() {
    renderHerbs();
}, 250));

// âŒ SAI â€” Gá»i render má»—i keystroke, giáº­t lag
$('#searchHerbInput').on('input', function() {
    renderHerbs();  // KHÃ”NG debounce
});
```

#### B6. LuÃ´n dÃ¹ng `e.preventDefault()` trong form submit
```javascript
// âœ… ÄÃšNG
$('#loginForm').on('submit', function(e) {
    e.preventDefault();
    // xá»­ lÃ½ login
});
```

#### B7. Má»i button nguy hiá»ƒm pháº£i confirm trÆ°á»›c khi xÃ³a
```javascript
// âœ… ÄÃšNG â€” Trong admin: xÃ³a bÃ i thuá»‘c
$(document).on('click', '.btn-admin-delete-remedy', function() {
    if (!confirm('Báº¡n cÃ³ cháº¯c muá»‘n xÃ³a bÃ i thuá»‘c nÃ y?')) return;
    // thá»±c hiá»‡n xÃ³a
});
```

---

### ðŸŸ¢ NHÃ“M C â€” QUY Táº®C Tá»I Æ¯U (Khuyáº¿n nghá»‹ máº¡nh)

#### C1. CSS Variables â€” DÃ¹ng token cÃ³ sáºµn, khÃ´ng hardcode mÃ u
```css
/* âœ… ÄÃšNG */
color: var(--primary);
background: var(--bg-offwhite);

/* âŒ SAI */
color: #2eb366;        /* hardcode */
background: #F4F7F5;   /* hardcode */
```

#### C2. Responsive Mobile First â€” Kiá»ƒm tra â‰¤576px trÆ°á»›c
```css
/* âœ… Viáº¿t mobile default, sau Ä‘Ã³ override desktop */
.hero-title { font-size: 2rem; }

@media (min-width: 992px) {
    .hero-title { font-size: 3.5rem; }
}
```

#### C3. Má»i animation pháº£i cÃ³ `prefers-reduced-motion`
```css
/* âœ… ÄÃšNG */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

#### C4. Lazy load áº£nh náº·ng
```html
<!-- âœ… ÄÃšNG -->
<img src="herb.png" loading="lazy" alt="...">
```

#### C5. LuÃ´n cÃ³ `alt` cho img
```html
<!-- âœ… ÄÃšNG -->
<img src="map.png" alt="Báº£n Ä‘á»“ vÃ¹ng báº£o tá»“n SÆ¡n TrÃ ">

<!-- âŒ SAI -->
<img src="map.png">
```

---

## 3. Káº¾ HOáº CH NÃ‚NG Cáº¤P 4 GIAI ÄOáº N

> Má»—i giai Ä‘oáº¡n pháº£i hoÃ n thiá»‡n vÃ  test xong trÆ°á»›c khi sang giai Ä‘oáº¡n tiáº¿p theo.

---

### ðŸ”µ GIAI ÄOáº N 1 â€” Sá»­a lá»—i & á»”n Ä‘á»‹nh ná»n táº£ng (Fix & Stabilize)

**Æ¯u tiÃªn: CAO NHáº¤T | Thá»i gian: 1â€“2 ngÃ y**

#### 1.1 Sá»­a lá»—i Logic CSDL

| # | Lá»—i hiá»‡n táº¡i | Cáº§n sá»­a |
|---|---|---|
| L1 | `data.js` ghi Ä‘Ã¨ LocalStorage má»—i láº§n load | Chá»‰ ghi náº¿u chÆ°a cÃ³ key `eco_heritage_db_v7` |
| L2 | HÃ m `normalizeDB()` Ä‘Ã´i khi reset data ngÆ°á»i dÃ¹ng Ä‘Ã£ sá»­a | Merge thay vÃ¬ overwrite |
| L3 | Admin xÃ³a review khÃ´ng cáº­p nháº­t láº¡i rating Ä‘Ãºng khi list rá»—ng | Fix hÃ m `renderAdminReviewsTable()` |
| L4 | `eco_heritage_users` cÃ³ user trÃ¹ng khi Ä‘Äƒng kÃ½ nhiá»u láº§n | ThÃªm kiá»ƒm tra unique email |

**Code fix cho L1 (Báº®T BUá»˜C):**
```javascript
// data.js â€” Thay Ä‘oáº¡n cuá»‘i báº±ng:
if (typeof window !== 'undefined') {
    const CURRENT_DB_VERSION = 'eco_heritage_db_v7';
    // CHá»ˆ ghi náº¿u chÆ°a cÃ³ â€” khÃ´ng overwrite data ngÆ°á»i dÃ¹ng
    if (!localStorage.getItem(CURRENT_DB_VERSION)) {
        localStorage.setItem(CURRENT_DB_VERSION, JSON.stringify(EcoHeritageDefaultData));
    }
}
```

#### 1.2 Sá»­a lá»—i UI/UX

| # | Lá»—i hiá»‡n táº¡i | File | Cáº§n sá»­a |
|---|---|---|---|
| U1 | Báº£n Ä‘á»“ Leaflet Ä‘Ã´i khi hiá»‡n Ã´ xÃ¡m (gray tiles) | `script.js` | TÄƒng `invalidateSize()` láº§n 3 sau 3000ms |
| U2 | Mobile menu khÃ´ng Ä‘Ã³ng sau khi click nav-link | `script.js` | ÄÃ£ cÃ³ fix nhÆ°ng cáº§n test láº¡i trÃªn iOS |
| U3 | Chat bubble khÃ´ng scroll xuá»‘ng cuá»‘i khi tin dÃ i | `script.js` | DÃ¹ng `scrollHeight` thay `animate` |
| U4 | Modal herb detail áº£nh bá»‹ kÃ©o dÃ i trÃªn mobile | `style.css` | Add `max-height: 300px; object-fit: cover` cho `#herbDetailImg` |
| U5 | Footer newsletter input mÃ u text tráº¯ng khÃ´ng tháº¥y trÃªn ná»n tráº¯ng | `index.html` | Äá»•i class input hoáº·c thÃªm `color: var(--text-main)` |

#### 1.3 Sá»­a lá»—i Báº£o máº­t

| # | Lá»—i | Má»©c Ä‘á»™ | Fix |
|---|---|---|---|
| S1 | API key Gemini hardcode trong `script.js` | ðŸ”´ NGHIÃŠM TRá»ŒNG | TÃ¡ch ra `config.js`, thÃªm vÃ o `.gitignore` |
| S2 | KhÃ´ng cÃ³ rate limiting cho chatbot | ðŸŸ¡ TRUNG BÃŒNH | ThÃªm cooldown 2 giÃ¢y giá»¯a cÃ¡c láº§n gá»­i |
| S3 | Admin route khÃ´ng kiá»ƒm tra session timeout | ðŸŸ¡ TRUNG BÃŒNH | ThÃªm kiá»ƒm tra `lastLoginTime` |
| S4 | Password lÆ°u plaintext trong LocalStorage | ðŸ”´ NGHIÃŠM TRá»ŒNG | Hash báº±ng hÃ m Ä‘Æ¡n giáº£n (SHA-256 via SubtleCrypto) |

---

### ðŸŸ£ GIAI ÄOáº N 2 â€” NÃ¢ng cáº¥p UI/UX & Dark Mode

**Æ¯u tiÃªn: CAO | Thá»i gian: 2â€“3 ngÃ y**

#### 2.1 Dark Mode (Báº¯t buá»™c triá»ƒn khai)

**CÆ¡ cháº¿:** Toggle button trÃªn navbar, lÆ°u preference vÃ o LocalStorage.

```javascript
// ThÃªm vÃ o script.js
function initDarkMode() {
    const saved = localStorage.getItem('eco_dark_mode') === 'true';
    if (saved) $('html').addClass('dark-mode');
    
    $('#darkModeToggle').on('click', function() {
        $('html').toggleClass('dark-mode');
        const isDark = $('html').hasClass('dark-mode');
        localStorage.setItem('eco_dark_mode', isDark);
        $(this).find('i').toggleClass('bi-moon-fill bi-sun-fill');
    });
}
```

**CSS Variables cáº§n thÃªm vÃ o `style.css`:**
```css
/* Dark Mode Variables */
html.dark-mode {
    --bg-white: #0D1611;
    --bg-offwhite: #111A14;
    --bg-light: #162019;
    --text-main: #E8F5E9;
    --text-muted: #A5BCB0;
    --shadow-sm: 0 4px 10px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 8px 30px rgba(0, 0, 0, 0.4);
}

html.dark-mode .navbar {
    background: rgba(13, 22, 17, 0.92) !important;
    border-bottom-color: rgba(46, 179, 102, 0.15) !important;
}

html.dark-mode .card,
html.dark-mode .modal-content,
html.dark-mode .dropdown-menu {
    background: var(--bg-light) !important;
    border-color: rgba(46, 179, 102, 0.12) !important;
    color: var(--text-main) !important;
}

html.dark-mode .text-dark { color: var(--text-main) !important; }
html.dark-mode .text-muted { color: var(--text-muted) !important; }
html.dark-mode .bg-white { background: var(--bg-white) !important; }
html.dark-mode .bg-light { background: var(--bg-light) !important; }

html.dark-mode .form-control,
html.dark-mode .input-group {
    background: var(--bg-light) !important;
    border-color: rgba(46, 179, 102, 0.2) !important;
    color: var(--text-main) !important;
}
```

**HTML â€” ThÃªm button Dark Mode vÃ o navbar (táº¥t cáº£ file HTML):**
```html
<!-- ThÃªm trÆ°á»›c desktopAuthSection -->
<button id="darkModeToggle" class="btn btn-outline-secondary rounded-circle border-0 p-2" 
        title="Chuyá»ƒn cháº¿ Ä‘á»™ tá»‘i/sÃ¡ng" style="width:40px;height:40px;">
    <i class="bi bi-moon-fill"></i>
</button>
```

#### 2.2 NÃ¢ng cáº¥p Navbar

| NÃ¢ng cáº¥p | MÃ´ táº£ |
|---|---|
| Breadcrumb | Hiá»ƒn thá»‹ vá»‹ trÃ­ trang hiá»‡n táº¡i dÆ°á»›i navbar |
| Active state | Tá»± Ä‘á»™ng detect trang nÃ o Ä‘ang má»Ÿ vÃ  highlight nav-link |
| Scroll progress bar | Thanh tiáº¿n trÃ¬nh Ä‘á»c trang mÃ u xanh lÃ¡ dá»c theo header |

**Auto detect active nav-link:**
```javascript
// ThÃªm vÃ o script.js â€” Trong $(document).ready()
(function autoSetActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    $('.navbar-nav .nav-link').each(function() {
        const href = $(this).attr('href');
        if (href === currentPage) {
            $('.navbar-nav .nav-link').removeClass('active');
            $(this).addClass('active');
        }
    });
})();
```

#### 2.3 NÃ¢ng cáº¥p Hero Section (index.html)

- [ ] ThÃªm animated counter cho sá»‘ liá»‡u thá»‘ng kÃª (20+ bÃ i thuá»‘c, 12+ vÃ¹ng)
- [ ] ThÃªm typing animation cho tagline
- [ ] NÃºt CTA cÃ³ pulse animation má»—i 3 giÃ¢y Ä‘á»ƒ thu hÃºt click

```javascript
// Counter animation
function animateCounter($el, target, duration) {
    $({ count: 0 }).animate({ count: target }, {
        duration: duration,
        step: function() { $el.text(Math.floor(this.count) + '+'); }
    });
}
// Gá»i khi pháº§n tá»­ visible
$('[data-counter]').each(function() {
    animateCounter($(this), parseInt($(this).data('counter')), 1500);
});
```

#### 2.4 NÃ¢ng cáº¥p Cards BÃ i Thuá»‘c (dictionary.html)

- [ ] ThÃªm skeleton loader khi render cards
- [ ] ThÃªm nÃºt "Chia sáº»" (copy link cÃ³ ?q=tÃªn thuá»‘c)
- [ ] Grid view / List view toggle
- [ ] Sáº¯p xáº¿p theo: Má»›i nháº¥t / TÃªn A-Z / PhÃ¢n loáº¡i

```javascript
// Sort function
$('#sortSelect').on('change', function() {
    const val = $(this).val();
    if (val === 'name') db.herbs.sort((a,b) => a.name.localeCompare(b.name, 'vi'));
    if (val === 'category') db.herbs.sort((a,b) => a.category.localeCompare(b.category));
    renderHerbs();
});
```

---

### ðŸŸ  GIAI ÄOáº N 3 â€” HoÃ n thiá»‡n Chá»©c NÄƒng & TÄƒng TÃ­nh NÄƒng

**Æ¯u tiÃªn: TRUNG BÃŒNH | Thá»i gian: 3â€“4 ngÃ y**

#### 3.1 Chatbot EcoBot â€” NÃ¢ng cáº¥p

| TÃ­nh nÄƒng | Hiá»‡n táº¡i | Má»¥c tiÃªu |
|---|---|---|
| Giao diá»‡n | Chat bubble Ä‘Æ¡n giáº£n | Hiá»ƒn thá»‹ typing animation mÆ°á»£t hÆ¡n |
| Input | Chá»‰ text | ThÃªm nÃºt quick-reply (Máº¥t ngá»§ / Äau khá»›p / Cáº£m cÃºm) |
| History | KhÃ´ng lÆ°u | LÆ°u 10 tin nháº¯n cuá»‘i vÃ o LocalStorage |
| Offline | Fallback cá»‘ Ä‘á»‹nh | Fallback thÃ´ng minh hÆ¡n theo keyword |

**Quick reply buttons:**
```html
<!-- ThÃªm vÃ o chat-footer, trÆ°á»›c input -->
<div class="d-flex gap-2 overflow-auto pb-2 mb-2" id="quickReplies">
    <button class="btn btn-sm btn-outline-success rounded-pill text-nowrap quick-reply-btn">ðŸ’¤ Máº¥t ngá»§</button>
    <button class="btn btn-sm btn-outline-success rounded-pill text-nowrap quick-reply-btn">ðŸ¦´ Äau khá»›p</button>
    <button class="btn btn-sm btn-outline-success rounded-pill text-nowrap quick-reply-btn">ðŸ¤§ Cáº£m cÃºm</button>
    <button class="btn btn-sm btn-outline-success rounded-pill text-nowrap quick-reply-btn">ðŸ’Š Bá»• dÆ°á»¡ng</button>
</div>
```

```javascript
// Quick reply handler
$(document).on('click', '.quick-reply-btn', function() {
    const text = $(this).text().replace(/^[^\w\s]+/, '').trim();
    $('#chatInput').val(text);
    $('#chatSend').trigger('click');
});
```

#### 3.2 Báº£n Äá»“ â€” NÃ¢ng cáº¥p

| TÃ­nh nÄƒng | MÃ´ táº£ |
|---|---|
| Cluster markers | Gom nhÃ³m markers khi zoom out (cáº§n Leaflet.markercluster) |
| Filter theo loáº¡i | Button lá»c: Khu báº£o tá»“n / VÆ°á»n dÆ°á»£c / Há»£p tÃ¡c xÃ£ |
| Heatmap layer | Hiá»ƒn thá»‹ máº­t Ä‘á»™ tháº£o dÆ°á»£c theo vÃ¹ng |
| Geolocation | NÃºt "TÃ¬m vÃ¹ng gáº§n tÃ´i nháº¥t" dÃ¹ng `navigator.geolocation` |

**Filter theo loáº¡i:**
```javascript
// ThÃªm button group vÃ o map.html
$('#mapTypeFilter .btn').on('click', function() {
    $('#mapTypeFilter .btn').removeClass('active');
    $(this).addClass('active');
    currentMapFilter = $(this).data('type');
    renderMapSidebarAndMarkers();
});

// Trong renderMapSidebarAndMarkers â€” thÃªm filter
const filtered = db.regions.filter(reg => {
    const matchSearch = /* ... existing ... */;
    const matchType = (currentMapFilter === 'all') || reg.type === currentMapFilter;
    return matchSearch && matchType;
});
```

**Geolocation:**
```javascript
$('#findNearMeBtn').on('click', function() {
    if (!navigator.geolocation) {
        showToast('TrÃ¬nh duyá»‡t khÃ´ng há»— trá»£ Ä‘á»‹nh vá»‹!', 'error'); return;
    }
    navigator.geolocation.getCurrentPosition(function(pos) {
        const { latitude, longitude } = pos.coords;
        map.flyTo([latitude, longitude], 13);
        
        // TÃ¬m vÃ¹ng gáº§n nháº¥t
        const nearest = db.regions.reduce((prev, curr) => {
            const d = (lat, lon) => Math.sqrt(
                Math.pow(lat - latitude, 2) + Math.pow(lon - longitude, 2)
            );
            return d(curr.coords[0], curr.coords[1]) < d(prev.coords[0], prev.coords[1]) ? curr : prev;
        });
        showToast(`VÃ¹ng gáº§n báº¡n nháº¥t: ${nearest.name}`, 'success');
    }, function() {
        showToast('KhÃ´ng thá»ƒ láº¥y vá»‹ trÃ­ cá»§a báº¡n!', 'error');
    });
});
```

#### 3.3 Admin Panel â€” NÃ¢ng cáº¥p

| TÃ­nh nÄƒng | MÃ´ táº£ |
|---|---|
| Export CSV | Xuáº¥t danh sÃ¡ch bÃ i thuá»‘c / Ä‘á»‹a Ä‘iá»ƒm ra file CSV |
| Import JSON | Nháº­p dá»¯ liá»‡u hÃ ng loáº¡t tá»« file JSON |
| TÃ¬m kiáº¿m trong báº£ng | Ã” tÃ¬m kiáº¿m nhanh cho tá»«ng báº£ng CRUD |
| XÃ¡c nháº­n xÃ³a modal | Thay `confirm()` báº±ng Bootstrap modal Ä‘áº¹p hÆ¡n |
| Thá»‘ng kÃª trá»±c quan | Mini chart cho admin dashboard |

**Export CSV:**
```javascript
$('#exportHerbsCSV').on('click', function() {
    const headers = ['ID', 'TÃªn', 'Khoa há»c', 'PhÃ¢n loáº¡i', 'CÃ´ng dá»¥ng'];
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
    showToast('ÄÃ£ xuáº¥t file CSV thÃ nh cÃ´ng!', 'success');
});
```

#### 3.4 Profile â€” NÃ¢ng cáº¥p

| TÃ­nh nÄƒng | MÃ´ táº£ |
|---|---|
| XÃ³a tÃ i khoáº£n | NÃºt xÃ³a tÃ i khoáº£n cÃ³ confirm 2 bÆ°á»›c |
| Lá»‹ch sá»­ chat | Hiá»ƒn thá»‹ 10 cÃ¢u há»i Ä‘Ã£ há»i chatbot |
| Thá»‘ng kÃª cÃ¡ nhÃ¢n | Biá»ƒu Ä‘á»“ nhá» sá»‘ bÃ i thuá»‘c lÆ°u theo thá»i gian |
| Chia sáº» há»“ sÆ¡ | Táº¡o link chia sáº» há»“ sÆ¡ cÃ´ng khai |

---

### ðŸŸ¢ GIAI ÄOáº N 4 â€” Tá»‘i Æ¯u Performance & PWA

**Æ¯u tiÃªn: BÃŒNH THÆ¯á»œNG | Thá»i gian: 2â€“3 ngÃ y**

#### 4.1 Performance

| Tá»‘i Æ°u | CÃ¡ch thá»±c hiá»‡n |
|---|---|
| Lazy load áº£nh | ThÃªm `loading="lazy"` cho táº¥t cáº£ `<img>` |
| Minify CSS/JS | DÃ¹ng tool online minify trÆ°á»›c khi deploy |
| Preload font | `<link rel="preload" href="..." as="font">` |
| Compress images | DÃ¹ng WebP thay PNG (náº¿u server há»— trá»£) |
| Throttle API calls | Chá»‰ gá»i AQI API khi tab visible (Page Visibility API) |

```javascript
// Chá»‰ refresh AQI khi tab visible
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        initWeatherDashboard();
    }
});
```

#### 4.2 SEO CÆ¡ báº£n

**ThÃªm vÃ o `<head>` cá»§a táº¥t cáº£ file HTML:**
```html
<!-- Open Graph cho chia sáº» máº¡ng xÃ£ há»™i -->
<meta property="og:title" content="EcoHeritage AI | Tháº£o DÆ°á»£c ÄÃ  Náºµng">
<meta property="og:description" content="Tra cá»©u 20+ bÃ i thuá»‘c cá»• truyá»n vÃ  báº£n Ä‘á»“ 12+ vÃ¹ng dÆ°á»£c liá»‡u ÄÃ  Náºµng">
<meta property="og:type" content="website">
<meta property="og:image" content="./images/hero_vector.png">

<!-- Canonical URL -->
<link rel="canonical" href="https://ecoheritage.vn/index.html">

<!-- Structured Data (JSON-LD) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "EcoHeritage AI",
  "description": "Ná»n táº£ng tra cá»©u tháº£o dÆ°á»£c vÃ  di sáº£n y há»c Viá»‡t Nam",
  "url": "https://ecoheritage.vn"
}
</script>
```

#### 4.3 PWA (Progressive Web App) â€” Tuá»³ chá»n

**Táº¡o `manifest.json`:**
```json
{
    "name": "EcoHeritage AI",
    "short_name": "EcoHeritage",
    "start_url": "/index.html",
    "display": "standalone",
    "background_color": "#F4F7F5",
    "theme_color": "#2eb366",
    "icons": [
        { "src": "./images/icon-192.png", "sizes": "192x192", "type": "image/png" },
        { "src": "./images/icon-512.png", "sizes": "512x512", "type": "image/png" }
    ]
}
```

**ThÃªm vÃ o `<head>`:**
```html
<link rel="manifest" href="manifest.json">
```

---

## 4. KIá»‚M TRA & TEST Báº®T BUá»˜C (QA CHECKLIST)

> âœ… = Pháº£i pass trÆ°á»›c khi deploy | âš ï¸ = NÃªn kiá»ƒm tra

### 4.1 Checklist Chá»©c NÄƒng â€” index.html

- [ ] âœ… Hero section hiá»ƒn thá»‹ Ä‘Ãºng trÃªn mobile (â‰¤576px)
- [ ] âœ… Dashboard AQI táº£i dá»¯ liá»‡u live tá»« API (hoáº·c fallback simulation)
- [ ] âœ… Biá»ƒu Ä‘á»“ Bar Chart vÃ  Doughnut Chart render khÃ´ng lá»—i
- [ ] âœ… Chatbot EcoBot má»Ÿ/Ä‘Ã³ng Ä‘Ãºng khi click button
- [ ] âœ… Chatbot gá»­i tin nháº¯n vÃ  nháº­n pháº£n há»“i (Gemini hoáº·c fallback)
- [ ] âœ… Thanh Ä‘iá»u hÆ°á»›ng sticky hoáº¡t Ä‘á»™ng khi scroll
- [ ] âœ… Particles ná»n khÃ´ng lag trÃªn mobile
- [ ] âœ… Footer newsletter validate email trÆ°á»›c khi submit

### 4.2 Checklist Chá»©c NÄƒng â€” dictionary.html

- [ ] âœ… Táº£i Ä‘á»§ 20 bÃ i thuá»‘c tá»« LocalStorage
- [ ] âœ… TÃ¬m kiáº¿m theo tÃªn, cÃ´ng dá»¥ng, tá»« khÃ³a hoáº¡t Ä‘á»™ng
- [ ] âœ… Lá»c theo phÃ¢n loáº¡i (Bá»• dÆ°á»¡ng / An tháº§n / Giáº£i Ä‘á»™c / Chá»¯a bá»‡nh)
- [ ] âœ… NÃºt Xem chi tiáº¿t má»Ÿ Ä‘Ãºng modal vá»›i Ä‘Ãºng bÃ i thuá»‘c
- [ ] âœ… NÃºt lÆ°u tim â¤ï¸ lÆ°u vÃ o profile user Ä‘ang Ä‘Äƒng nháº­p
- [ ] âœ… Náº¿u chÆ°a Ä‘Äƒng nháº­p â†’ click tim â†’ má»Ÿ modal Ä‘Äƒng nháº­p
- [ ] âœ… URL param `?q=tÃªn` tá»± Ä‘á»™ng Ä‘iá»n vÃ o Ã´ tÃ¬m kiáº¿m

### 4.3 Checklist Chá»©c NÄƒng â€” map.html

- [ ] âœ… Báº£n Ä‘á»“ Leaflet táº£i Ä‘Ãºng, khÃ´ng cÃ³ Ã´ xÃ¡m
- [ ] âœ… 12 markers hiá»ƒn thá»‹ Ä‘Ãºng vá»‹ trÃ­ GPS
- [ ] âœ… Click marker â†’ má»Ÿ popup vá»›i áº£nh vÃ  thÃ´ng tin
- [ ] âœ… Click sidebar item â†’ báº£n Ä‘á»“ flyTo Ä‘Ãºng vá»‹ trÃ­
- [ ] âœ… ÄÃ¡nh giÃ¡ sao 1-5 hoáº¡t Ä‘á»™ng
- [ ] âœ… Submit review lÆ°u vÃ o CSDL vÃ  cáº­p nháº­t rating
- [ ] âœ… NgÆ°á»i chÆ°a Ä‘Äƒng nháº­p khÃ´ng thá»ƒ submit review
- [ ] âœ… Chuyá»ƒn Ä‘á»•i layer báº£n Ä‘á»“ (OSM / Google Satellite)

### 4.4 Checklist Chá»©c NÄƒng â€” Auth

- [ ] âœ… ÄÄƒng kÃ½ tÃ i khoáº£n má»›i thÃ nh cÃ´ng
- [ ] âœ… ÄÄƒng kÃ½ email trÃ¹ng â†’ thÃ´ng bÃ¡o lá»—i
- [ ] âœ… ÄÄƒng nháº­p Ä‘Ãºng email/password â†’ thÃ nh cÃ´ng
- [ ] âœ… ÄÄƒng nháº­p sai password â†’ thÃ´ng bÃ¡o lá»—i
- [ ] âœ… ÄÄƒng nháº­p `admin@gmail.com` / `admin123` â†’ hiá»‡n badge Admin + link Quáº£n trá»‹
- [ ] âœ… ÄÄƒng xuáº¥t xÃ³a session vÃ  redirect vá» index.html
- [ ] âœ… Cáº­p nháº­t áº£nh Ä‘áº¡i diá»‡n (dÆ°á»›i 1.5MB) â†’ hiá»ƒn thá»‹ ngay
- [ ] âœ… Äá»•i máº­t kháº©u vá»›i máº­t kháº©u cÅ© sai â†’ thÃ´ng bÃ¡o lá»—i

### 4.5 Checklist Chá»©c NÄƒng â€” admin.html

- [ ] âœ… Truy cáº­p khi chÆ°a Ä‘Äƒng nháº­p â†’ redirect vá» index.html
- [ ] âœ… Truy cáº­p vá»›i tÃ i khoáº£n thÆ°á»ng â†’ redirect vá» index.html
- [ ] âœ… Chá»‰ admin má»›i tháº¥y Ä‘á»§ panel
- [ ] âœ… ThÃªm bÃ i thuá»‘c má»›i â†’ hiá»‡n trong danh sÃ¡ch vÃ  dictionary.html
- [ ] âœ… Sá»­a bÃ i thuá»‘c â†’ cáº­p nháº­t Ä‘Ãºng trong CSDL
- [ ] âœ… XÃ³a bÃ i thuá»‘c â†’ biáº¿n máº¥t khá»i danh sÃ¡ch
- [ ] âœ… ThÃªm / Sá»­a / XÃ³a Ä‘á»‹a Ä‘iá»ƒm báº£n Ä‘á»“
- [ ] âœ… Gá»¡ bá» review vi pháº¡m â†’ rating tá»± cáº­p nháº­t

### 4.6 Checklist Responsive

| Breakpoint | Thiáº¿t bá»‹ | Cáº§n kiá»ƒm tra |
|---|---|---|
| â‰¤576px | Mobile nhá» (iPhone SE) | Navbar collapse, hero text, cards 1 cá»™t |
| 576â€“768px | Mobile lá»›n | Cards 2 cá»™t, báº£n Ä‘á»“ layout |
| 768â€“992px | Tablet | Sidebar báº£n Ä‘á»“, auth modal |
| 992â€“1200px | Laptop | Layout Ä‘áº§y Ä‘á»§ |
| â‰¥1200px | Desktop | Táº¥t cáº£ tÃ­nh nÄƒng |

### 4.7 Checklist TrÃ¬nh Duyá»‡t

- [ ] âš ï¸ Chrome (â‰¥ 90) â€” Báº¯t buá»™c hoáº¡t Ä‘á»™ng 100%
- [ ] âš ï¸ Firefox (â‰¥ 88) â€” Báº¯t buá»™c hoáº¡t Ä‘á»™ng 100%
- [ ] âš ï¸ Edge (â‰¥ 90) â€” Khuyáº¿n nghá»‹ test
- [ ] âš ï¸ Safari iOS â€” Kiá»ƒm tra backdrop-filter, position:fixed

---

## 5. DANH SÃCH Lá»–I ÄÃƒ BIáº¾T PHáº¢I Sá»¬A

| ID | File | MÃ´ táº£ lá»—i | Má»©c Ä‘á»™ | Tráº¡ng thÃ¡i |
|---|---|---|---|---|
| BUG-01 | `data.js` | Overwrite CSDL ngÆ°á»i dÃ¹ng má»—i láº§n táº£i trang | ðŸ”´ Cao | â³ ChÆ°a sá»­a |
| BUG-02 | `script.js` | API key Gemini lá»™ trong source | ðŸ”´ Cao | â³ ChÆ°a sá»­a |
| BUG-03 | `script.js` | Password lÆ°u plaintext | ðŸ”´ Cao | â³ ChÆ°a sá»­a |
| BUG-04 | `map.html` | Gray tiles Leaflet khi chuyá»ƒn tab | ðŸŸ¡ TB | â³ ChÆ°a sá»­a |
| BUG-05 | `index.html` | Newsletter input text khÃ´ng hiá»‡n | ðŸŸ¢ Tháº¥p | â³ ChÆ°a sá»­a |
| BUG-06 | `admin.html` | KhÃ´ng cÃ³ confirm dialog khi xÃ³a | ðŸŸ¡ TB | â³ ChÆ°a sá»­a |
| BUG-07 | `script.js` | Chat khÃ´ng scroll xuá»‘ng cuá»‘i tá»± Ä‘á»™ng | ðŸŸ¢ Tháº¥p | â³ ChÆ°a sá»­a |
| BUG-08 | `profile.html` | Achievement badge Ä‘Ã´i khi khÃ´ng unlock | ðŸŸ¡ TB | â³ ChÆ°a sá»­a |
| BUG-09 | `script.js` | `eco_heritage_users` cÃ³ thá»ƒ cÃ³ user trÃ¹ng | ðŸŸ¡ TB | â³ ChÆ°a sá»­a |
| BUG-10 | `style.css` | `#herbDetailImg` bá»‹ kÃ©o dÃ i trÃªn mobile | ðŸŸ¢ Tháº¥p | â³ ChÆ°a sá»­a |

---

## 6. QUY Táº®C MÃ€U Sáº®C & THIáº¾T Káº¾

### 6.1 Color Tokens â€” KHÃ”NG Ä‘Æ°á»£c thay Ä‘á»•i

```css
/* Báº®T BUá»˜C dÃ¹ng cÃ¡c biáº¿n nÃ y, KHÃ”NG hardcode mÃ u */
--primary:          hsl(145, 63%, 42%)   /* #2eb366 â€” Xanh tháº£o dÆ°á»£c */
--primary-dark:     hsl(145, 75%, 32%)   /* #1a8c4e â€” Xanh Ä‘áº­m */
--primary-light:    hsl(145, 60%, 65%)   /* #70c994 â€” Xanh nháº¡t */
--accent-orange:    hsl(35, 95%, 50%)    /* #f59e0b â€” Cam cáº£nh bÃ¡o */
--accent-blue:      hsl(210, 95%, 45%)   /* #0d6efd â€” Xanh dÆ°Æ¡ng */
--bg-dark-premium:  #0D1611              /* Ná»n tá»‘i admin/footer */
--text-main:        #1A2E22              /* Chá»¯ chÃ­nh */
```

### 6.2 Typography â€” KHÃ”NG Ä‘Æ°á»£c thay Ä‘á»•i

```css
/* Font duy nháº¥t Ä‘Æ°á»£c dÃ¹ng */
font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Thang cá»¡ chá»¯ */
/* Hero title:    3.5rem (56px) */
/* Section title: 2.2rem (35px) */
/* Card title:    1.1rem (18px) */
/* Body text:     1rem   (16px) */
/* Small/caption: 0.85rem(14px) */
```

### 6.3 Border Radius â€” KHÃ”NG Ä‘Æ°á»£c thay Ä‘á»•i

```css
--radius-sm:   10px   /* Input, Badge nhá» */
--radius-md:   16px   /* Card, Panel */
--radius-lg:   24px   /* Section, Modal */
--radius-xl:   32px   /* Hero, Dashboard */
--radius-full: 50%    /* Avatar, dot */
```

### 6.4 Quy Táº¯c Z-index

```
z-index: 1000  â†’ Navbar fixed
z-index: 1050  â†’ Modal backdrop
z-index: 1055  â†’ Modal dialog
z-index: 1100  â†’ Toast notifications
z-index: 9999  â†’ Chatbot floating button
z-index: 10000 â†’ Chatbot window khi má»Ÿ
```

---

## 7. QUY Táº®C Báº¢O Máº¬T Báº®T BUá»˜C

### 7.1 Xá»­ lÃ½ Input â€” Báº¯t buá»™c escapeHTML

```javascript
// HÃ€M Báº®T BUá»˜C â€” KhÃ´ng Ä‘Æ°á»£c xÃ³a hoáº·c bá» qua
function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, function(char) {
        return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char];
    });
}

// QUY Táº®C: Má»i nÆ¡i render data tá»« CSDL hoáº·c user input vÃ o HTML Ä‘á»u pháº£i qua escapeHTML()
// NGOáº I Lá»†: Chá»‰ bá» qua khi data lÃ  HTML an toÃ n do chÃ­nh code táº¡o ra (khÃ´ng pháº£i user nháº­p)
```

### 7.2 Báº£o vá»‡ Admin Route

```javascript
// PATTERN Báº®T BUá»˜C cho táº¥t cáº£ function dÃ nh riÃªng admin
function anyAdminFunction() {
    const user = readStorage('gh_user', null);
    
    // Guard clause â€” pháº£i lÃ  dÃ²ng Äáº¦U TIÃŠN
    if (!user || user.role !== 'admin') {
        showToast('Quyá»n truy cáº­p bá»‹ tá»« chá»‘i!', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }
    
    // ... code admin logic bÃªn dÆ°á»›i
}
```

### 7.3 Validate Äáº§u VÃ o Form

```javascript
// Báº®T BUá»˜C validate trÆ°á»›c khi lÆ°u vÃ o CSDL
function validateHerbInput(data) {
    const errors = [];
    if (!data.name || data.name.trim().length < 2) errors.push('TÃªn bÃ i thuá»‘c pháº£i tá»« 2 kÃ½ tá»±');
    if (!data.scientific || data.scientific.trim().length < 2) errors.push('TÃªn khoa há»c khÃ´ng há»£p lá»‡');
    if (!data.category) errors.push('Pháº£i chá»n phÃ¢n loáº¡i');
    if (!data.usage || data.usage.trim().length < 10) errors.push('CÃ´ng dá»¥ng pháº£i tá»« 10 kÃ½ tá»±');
    return errors;
}
```

### 7.4 Rate Limiting Chatbot

```javascript
// Báº®T BUá»˜C â€” Cháº·n spam chatbot
let lastChatTime = 0;
const CHAT_COOLDOWN_MS = 2000; // 2 giÃ¢y giá»¯a cÃ¡c láº§n gá»­i

$('#chatSend').on('click', async function() {
    const now = Date.now();
    if (now - lastChatTime < CHAT_COOLDOWN_MS) {
        showToast('Vui lÃ²ng chá» trÆ°á»›c khi gá»­i tiáº¿p!', 'warning');
        return;
    }
    lastChatTime = now;
    // ... xá»­ lÃ½ chat
});
```

---

## 8. CHUáº¨N Dá»® LIá»†U LOCALSTORAGE

### 8.1 Schema bÃ i thuá»‘c (Herb)

```javascript
{
    id: String,           // "h1", "h2", ... (Báº®T BUá»˜C - unique)
    name: String,         // "Tháº­p ToÃ n Äáº¡i Bá»•" (Báº®T BUá»˜C)
    scientific: String,   // "Táº­p Nghiá»‡m LÆ°Æ¡ng PhÆ°Æ¡ng" (Báº®T BUá»˜C)
    category: String,     // "Bá»• dÆ°á»¡ng" | "An tháº§n" | "Giáº£i Ä‘á»™c" | "Chá»¯a bá»‡nh" (Báº®T BUá»˜C)
    usage: String,        // MÃ´ táº£ cÃ´ng dá»¥ng chÃ­nh (Báº®T BUá»˜C)
    emoji: String,        // "ðŸŒ¿" (1 emoji)
    image: String,        // ÄÆ°á»ng dáº«n áº£nh hoáº·c URL
    fallbackImage: String,// áº¢nh dá»± phÃ²ng khi image lá»—i
    ingredients: String,  // Danh sÃ¡ch vá»‹ thuá»‘c
    efficacy: String,     // CÃ´ng dá»¥ng y lÃ½ chi tiáº¿t
    time: String,         // "Sáº¯c uá»‘ng: 45 phÃºt"
    steps: Array<String>, // ["BÆ°á»›c 1...", "BÆ°á»›c 2..."]
    benefits: String,     // Lá»£i Ã­ch lÃ¢m sÃ ng
    keywords: String      // Tá»« khÃ³a tÃ¬m kiáº¿m khÃ´ng dáº¥u
}
```

### 8.2 Schema Ä‘á»‹a Ä‘iá»ƒm (Region)

```javascript
{
    id: String,              // "r1", "r2", ...
    name: String,            // TÃªn Ä‘á»‹a Ä‘iá»ƒm
    location: String,        // Äá»‹a chá»‰ Ä‘áº§y Ä‘á»§
    coords: [Number, Number],// [latitude, longitude]
    type: String,            // "primary" | "success" | "warning" | "danger" | "info"
    image: String,           // ÄÆ°á»ng dáº«n áº£nh
    herbs: Array<String>,    // ["TÃªn tháº£o dÆ°á»£c 1", ...]
    desc: String,            // MÃ´ táº£ Ä‘á»‹a Ä‘iá»ƒm
    rating: Number,          // 1.0 - 5.0 (tÃ­nh trung bÃ¬nh tá»« reviewsList)
    reviewsCount: Number,    // = reviewsList.length
    reviewsList: Array<{     // Danh sÃ¡ch Ä‘Ã¡nh giÃ¡
        user: String,
        rating: Number,      // 1-5
        comment: String
    }>
}
```

### 8.3 Schema tÃ i khoáº£n ngÆ°á»i dÃ¹ng (User)

```javascript
{
    name: String,            // Há» tÃªn hiá»ƒn thá»‹
    email: String,           // Email (unique key)
    password: String,        // âš ï¸ Hiá»‡n plaintext â€” cáº§n hash vá» sau
    role: String,            // "user" | "admin"
    avatar: String,          // Base64 data URL hoáº·c rá»—ng
    saved: Array<String>,    // ["h1", "h3", ...] â€” ID bÃ i thuá»‘c Ä‘Ã£ lÆ°u
    rated: Array<String>     // ["r1", "r4", ...] â€” ID Ä‘á»‹a Ä‘iá»ƒm Ä‘Ã£ review
}
```

### 8.4 CÃ¡c LocalStorage keys

| Key | Loáº¡i | MÃ´ táº£ |
|---|---|---|
| `eco_heritage_db_v7` | Object `{herbs, regions}` | CSDL chÃ­nh |
| `eco_heritage_users` | Array<User> | Danh sÃ¡ch tÃ i khoáº£n |
| `gh_user` | User | PhiÃªn Ä‘Äƒng nháº­p hiá»‡n táº¡i |
| `eco_bot_chats` | Number | Äáº¿m sá»‘ láº§n chat (cho achievement) |
| `eco_dark_mode` | Boolean string | Tráº¡ng thÃ¡i dark mode |

---

## ðŸ“Œ GHI CHÃš CUá»I

1. **Má»i AI / láº­p trÃ¬nh viÃªn** khi nháº­n task pháº£i Ä‘á»c file nÃ y trÆ°á»›c
2. **TrÆ°á»›c khi code** â€” Kiá»ƒm tra quy táº¯c nhÃ³m A (tuyá»‡t Ä‘á»‘i) cÃ³ vi pháº¡m khÃ´ng
3. **Sau khi code** â€” Cháº¡y QA Checklist má»¥c 4 Ä‘á»ƒ Ä‘áº£m báº£o khÃ´ng regression
4. **TrÆ°á»›c khi deploy** â€” Xá»­ lÃ½ toÃ n bá»™ BUG Ä‘á» trong má»¥c 5
5. File nÃ y cáº§n cáº­p nháº­t má»—i khi cÃ³ nÃ¢ng cáº¥p lá»›n má»›i

---

*Â© 2026 EcoHeritage AI Project â€” Äá»“ Ã¡n mÃ´n há»c Web Â· VKU*  
*File rÃ ng buá»™c Ä‘Æ°á»£c táº¡o tá»± Ä‘á»™ng báº±ng AI analysis tá»« codebase thá»±c táº¿*
