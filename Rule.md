# 🌿 EcoHeritage AI — Bộ Ràng Buộc & Kế Hoạch Nâng Cấp Toàn Diện
> **Phiên bản:** v7.0 | **Ngày cập nhật:** 2026 | **Áp dụng cho:** HTML5 · CSS3 · Bootstrap 5.3 · jQuery 3.7 · Vanilla JS
> **Mục tiêu:** Bộ quy tắc bắt buộc AI / lập trình viên phải tuân thủ khi code, test, sửa lỗi dự án EcoHeritage AI

---

## 📋 MỤC LỤC

1. [Tổng Quan Dự Án](#1-tổng-quan-dự-án)
2. [Bộ Ràng Buộc Bắt Buộc (AI MUST Rules)](#2-bộ-ràng-buộc-bắt-buộc)
3. [Kế Hoạch Nâng Cấp Còn Lại](#3-kế-hoạch-nâng-cấp-còn-lại)
4. [QA Checklist Bắt Buộc](#4-qa-checklist-bắt-buộc)
5. [Danh Sách Lỗi & Trạng Thái](#5-danh-sách-lỗi--trạng-thái)
6. [Quy Tắc Màu Sắc & Thiết Kế](#6-quy-tắc-màu-sắc--thiết-kế)
7. [Quy Tắc Bảo Mật Bắt Buộc](#7-quy-tắc-bảo-mật-bắt-buộc)
8. [Chuẩn Dữ Liệu LocalStorage](#8-chuẩn-dữ-liệu-localstorage)

---

## 1. TỔNG QUAN DỰ ÁN

| Thuộc tính | Giá trị |
|---|---|
| **Tên dự án** | EcoHeritage AI v7.0 |
| **Mô tả** | Nền tảng tra cứu thảo dược + bản đồ GPS di sản y học cổ truyền Đà Nẵng |
| **Stack bắt buộc** | HTML5 · CSS3 · Bootstrap 5.3.2 · jQuery 3.7.1 · Vanilla JS (ES6+) |
| **CDN chính** | Bootstrap Icons 1.11.1 · AOS 2.3.4 · Chart.js · Leaflet.js · Vanilla Tilt 1.8.1 |
| **Font chính** | `Outfit` (Google Fonts) — KHÔNG thay đổi |
| **Màu chủ đạo** | `hsl(145, 63%, 42%)` — Xanh lá thảo dược |
| **CSDL** | LocalStorage — key cố định: `eco_heritage_db_v7` |
| **AI Chatbot** | Google Gemini 2.0 Flash — key tại `config.js` |
| **Weather API** | Open-Meteo (free, không cần key) |
| **Deploy** | Vercel — `https://ecoheritage-ai.vercel.app` |

### Cấu trúc file bắt buộc

```
ecoheritage/
├── index.html          ← Trang chủ (Hero + AQI Dashboard + Charts)
├── dictionary.html     ← Từ điển 20+ bài thuốc + modal chi tiết
├── map.html            ← Bản đồ Leaflet GPS 12+ vùng + đánh giá
├── profile.html        ← Hồ sơ cá nhân + thành tựu gamification
├── admin.html          ← Cổng quản trị CRUD (chỉ admin)
├── data.js             ← Database trung tâm (EcoHeritageDefaultData)
├── script.js           ← Logic tổng hợp toàn bộ trang (~2700 dòng)
├── style.css           ← CSS Design Tokens + layout cơ bản
├── v5-premium.css      ← CSS nâng cao premium
├── config.js           ← API Keys (trong .gitignore)
└── Rule.md             ← File này — đọc trước khi code
```

### Thứ tự load script (BẮT BUỘC, không thay đổi)

```html
<!-- Trong <head> -->
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.36/dist/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanilla-tilt@1.8.1/dist/vanilla-tilt.min.js"></script>
<link rel="stylesheet" href="style.css?v=12.0">
<link rel="stylesheet" href="v5-premium.css?v=12.0">

<!-- Trước </body> -->
<script src="jquery@3.7.1"></script>
<script src="bootstrap@5.3.2/bundle"></script>
<script src="chart.js"></script>
<script src="aos@2.3.4"></script>
<script src="config.js"></script>      <!-- 1. Config trước -->
<script src="data.js"></script>        <!-- 2. Seed data -->
<script src="script.js?v=12.0"></script> <!-- 3. Logic cuối -->
```

---

## 2. BỘ RÀNG BUỘC BẮT BUỘC

> ⚠️ **AI / lập trình viên phải đọc và tuân thủ 100% các quy tắc dưới đây trước khi viết bất kỳ dòng code nào.**

---

### 🔴 NHÓM A — QUY TẮC TUYỆT ĐỐI (Vi phạm = từ chối build)

#### A1. Không được thay đổi tech stack

```
❌ CẤM TUYỆT ĐỐI:
- Thêm React, Vue, Angular, Svelte, TypeScript
- Thêm Node.js / backend server
- Thêm Database thực (MySQL, MongoDB, Firebase...)
- Thay jQuery bằng fetch API thuần
- Thay Bootstrap bằng Tailwind / Material UI

✅ CHỈ DÙNG:
- HTML5 + CSS3 + Bootstrap 5.3.2
- jQuery 3.7.1 ($ syntax)
- Vanilla JS ES6+
- LocalStorage làm CSDL
```

#### A2. Không được phá vỡ CSDL LocalStorage

```javascript
// ✅ ĐÚNG — Luôn dùng key cố định
const DB_KEY      = 'eco_heritage_db_v7';   // CSDL chính
const USER_KEY    = 'gh_user';               // Session hiện tại
const USERS_KEY   = 'eco_heritage_users';    // Danh sách tài khoản
const DARK_KEY    = 'eco_dark_mode';         // Dark mode preference

// ❌ SAI — Tuyệt đối không đổi tên key hay tạo key mới thay thế
localStorage.setItem('eco_db_new', ...);     // CẤM
localStorage.setItem('ecoheritage', ...);    // CẤM
```

#### A3. Luôn dùng `escapeHTML()` khi render dữ liệu người dùng vào DOM

```javascript
// ✅ ĐÚNG — Chặn XSS
$('#element').html(escapeHTML(userInput));
$('#element').text(userInput); // .text() tự escape, an toàn

// ❌ SAI — XSS nguy hiểm
$('#element').html(userInput);                      // CẤM TUYỆT ĐỐI
document.getElementById('el').innerHTML = userInput; // CẤM TUYỆT ĐỐI

// ✅ NGOẠI LỆ hợp lệ — HTML do chính code tạo ra (không phải user nhập)
$('#herbGrid').html(generateHerbCardHTML(herb));
```

#### A4. Luôn bảo vệ trang Admin với guard kép

```javascript
// ✅ ĐÚNG — Kiểm tra ở đầu mỗi function admin
function initAdminPage() {
    const now = Date.now();
    const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 phút
    const user = readStorage('gh_user', null);

    // Guard 1: Chưa đăng nhập hoặc không phải admin
    if (!user || user.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }
    // Guard 2: Session timeout
    if (!user.lastLoginTime || (now - user.lastLoginTime > SESSION_TIMEOUT)) {
        showToast('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.', 'warning');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }
    // Gia hạn session
    user.lastLoginTime = now;
    writeStorage('gh_user', user);
}
```

#### A5. Không hardcode API key trong source code

```javascript
// ❌ SAI — API key lộ trong source
const GEMINI_API_KEY = "AIzaSyXXXXXXXXXXXXXXX";  // NGUY HIỂM

// ✅ ĐÚNG — Đặt trong config.js (đã có trong .gitignore)
// config.js:
const ECO_CONFIG = {
    GEMINI_API_KEY: 'YOUR_KEY_HERE'
};

// Dùng trong script.js:
const apiKey = (typeof ECO_CONFIG !== 'undefined') ? ECO_CONFIG.GEMINI_API_KEY : '';
```

> ⚠️ **QUAN TRỌNG:** `config.js` phải có trong `.gitignore`. Nếu key đã bị push lên GitHub, phải **rotate key mới ngay** tại [Google AI Studio](https://aistudio.google.com/apikey).

---

### 🟡 NHÓM B — QUY TẮC CHẤT LƯỢNG (Vi phạm = cần sửa trước khi merge)

#### B1. Chuẩn jQuery — Luôn dùng `$(document).ready()`

```javascript
// ✅ ĐÚNG
$(document).ready(function() {
    // toàn bộ code chính bên trong đây
});

// ❌ SAI
window.onload = function() { ... }       // Không nhất quán với codebase
document.addEventListener('DOMContentLoaded', ...); // Không dùng
```

#### B2. Mọi thao tác LocalStorage phải dùng `readStorage()` / `writeStorage()`

```javascript
// ✅ ĐÚNG — Dùng hàm helper có try/catch
const data = readStorage('eco_heritage_db_v7', null);
writeStorage('eco_heritage_db_v7', data);

// ❌ SAI — Trực tiếp, không xử lý lỗi JSON parse
const data = JSON.parse(localStorage.getItem('eco_heritage_db_v7')); // CẤM
localStorage.setItem('eco_heritage_db_v7', JSON.stringify(data));    // CẤM
```

#### B3. Luôn có fallback cho ảnh

```html
<!-- ✅ ĐÚNG -->
<img src="./images/herb.png"
     loading="lazy"
     alt="Mô tả ảnh"
     onerror="this.src='./images/hero_vector.png'">

<!-- ❌ SAI -->
<img src="./images/herb.png">
```

#### B4. Luôn debounce sự kiện input tìm kiếm

```javascript
// ✅ ĐÚNG
$('#searchHerbInput').on('input', debounce(function() {
    renderHerbs();
}, 300));

// ❌ SAI — Gọi render mỗi keystroke, giật lag
$('#searchHerbInput').on('input', function() {
    renderHerbs(); // KHÔNG debounce
});
```

#### B5. Luôn dùng `e.preventDefault()` trong form submit

```javascript
// ✅ ĐÚNG
$('#loginForm').on('submit', async function(e) {
    e.preventDefault();
    // xử lý login
});
```

#### B6. Mọi button xóa phải confirm trước khi thực hiện

```javascript
// ✅ ĐÚNG — Dùng Bootstrap modal hoặc confirm()
$(document).on('click', '.btn-admin-delete-remedy', function() {
    if (!confirm('Bạn có chắc muốn xóa bài thuốc này? Hành động này không thể hoàn tác.')) return;
    // thực hiện xóa
});
```

#### B7. Không dùng `!important` vô tội vạ trong CSS

```css
/* ✅ ĐÚNG — Chỉ dùng !important để override Bootstrap cụ thể */
.hero-premium-bg { background: linear-gradient(...) !important; }

/* ❌ SAI — !important tràn lan */
.my-button { color: red !important; margin: 10px !important; padding: 5px !important; }
```

#### B8. Interval phải lưu reference để có thể clear

```javascript
// ✅ ĐÚNG
let weatherIntervalId = setInterval(initWeatherDashboard, 30000);

document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        clearInterval(weatherIntervalId);
        weatherIntervalId = null;
    } else {
        initWeatherDashboard();
        if (!weatherIntervalId) {
            weatherIntervalId = setInterval(initWeatherDashboard, 30000);
        }
    }
});

// ❌ SAI — Không lưu ref, không thể clear
setInterval(initWeatherDashboard, 30000);
```

---

### 🟢 NHÓM C — QUY TẮC TỐI ƯU (Khuyến nghị mạnh)

#### C1. CSS Variables — Dùng token có sẵn, không hardcode màu

```css
/* ✅ ĐÚNG */
color: var(--primary);
background: var(--bg-offwhite);
box-shadow: var(--shadow-md);

/* ❌ SAI */
color: #2eb366;      /* hardcode */
background: #F4F7F5; /* hardcode */
```

#### C2. Responsive Mobile First — Kiểm tra ≤576px trước

```css
/* ✅ Viết mobile default, sau đó override desktop */
.hero-title { font-size: 2rem; }

@media (min-width: 992px) {
    .hero-title { font-size: 3.5rem; }
}
```

#### C3. Mọi animation phải có `prefers-reduced-motion`

```css
/* ✅ ĐÚNG — Thêm vào cuối style.css hoặc v5-premium.css */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

> ⚠️ **Chú ý:** Quy tắc này chưa được implement. Cần thêm vào cuối `v5-premium.css`.

#### C4. Lazy load ảnh nặng

```html
<!-- ✅ ĐÚNG — Thêm loading="lazy" cho mọi <img> không phải hero/above-fold -->
<img src="herb.png" loading="lazy" alt="Sâm Ngọc Linh">

<!-- ❌ SAI — Chưa có lazy load -->
<img src="herb.png" alt="...">
```

> ⚠️ **Chú ý:** Toàn bộ 5 file HTML hiện tại đều chưa có `loading="lazy"`. Cần thêm vào tất cả `<img>` ngoại trừ ảnh hero đầu trang.

#### C5. Luôn có `alt` mô tả cho img

```html
<!-- ✅ ĐÚNG -->
<img src="map.png" alt="Bản đồ vùng bảo tồn Sơn Trà">

<!-- ❌ SAI -->
<img src="map.png" alt="">  <!-- alt rỗng -->
<img src="map.png">          <!-- không có alt -->
```

#### C6. Open Graph tags cho mọi trang

```html
<!-- ✅ ĐÚNG — Thêm vào <head> của TẤT CẢ file HTML -->
<meta property="og:title" content="EcoHeritage AI | Trang [Tên trang]">
<meta property="og:description" content="Mô tả ngắn trang này">
<meta property="og:type" content="website">
<meta property="og:image" content="https://ecoheritage-ai.vercel.app/images/ban_do/son_tra_map.png">
<link rel="canonical" href="https://ecoheritage-ai.vercel.app/[tên-file].html">
```

> ⚠️ **Chú ý:** `index.html` đã có. Các trang `dictionary.html`, `map.html`, `profile.html`, `admin.html` chưa có.

---

## 3. KẾ HOẠCH NÂNG CẤP CÒN LẠI

> Giai đoạn 1, 2, 3 đã hoàn thành. Chỉ còn Giai đoạn 4.

---

### 🟢 GIAI ĐOẠN 4 — Tối Ưu Performance & Hoàn Thiện

**Ưu tiên: BÌNH THƯỜNG | Thời gian: 1–2 ngày**

#### 4.1 Lazy Load ảnh (Chưa làm — 5 phút fix)

Thêm `loading="lazy"` vào tất cả `<img>` trong 5 file HTML, ngoại trừ:
- Ảnh hero đầu trang (above-fold — không lazy)
- Ảnh avatar navbar

#### 4.2 prefers-reduced-motion (Chưa làm — 5 phút fix)

Thêm vào cuối `v5-premium.css`:

```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    .particles-container { display: none !important; }
    [data-aos] { opacity: 1 !important; transform: none !important; }
}
```

#### 4.3 Open Graph cho các trang còn lại

Thêm OG tags vào: `dictionary.html`, `map.html`, `profile.html`, `admin.html`.

#### 4.4 Canonical URL đúng chuẩn

```html
<!-- ❌ Hiện tại — relative path sai chuẩn SEO -->
<link rel="canonical" href="index.html">

<!-- ✅ Cần đổi thành absolute URL -->
<link rel="canonical" href="https://ecoheritage-ai.vercel.app/index.html">
```

#### 4.5 Google Login — Làm rõ Demo

Button "Đăng nhập bằng Google" hiện tạo user mock. Thêm label rõ ràng:

```html
<!-- ✅ Đổi thành -->
<button type="button" id="googleLoginBtn" class="btn btn-outline-light ...">
    <i class="bi bi-google text-danger me-2"></i> Google (Demo)
</button>
```

#### 4.6 PWA Manifest (Tùy chọn — thêm điểm thuyết trình)

Tạo file `manifest.json`:

```json
{
    "name": "EcoHeritage AI",
    "short_name": "EcoHeritage",
    "start_url": "/index.html",
    "display": "standalone",
    "background_color": "#F4F7F5",
    "theme_color": "#2eb366",
    "description": "Nền tảng tra cứu thảo dược và bản đồ di sản y học Đà Nẵng",
    "icons": [
        { "src": "./images/icon-192.png", "sizes": "192x192", "type": "image/png" },
        { "src": "./images/icon-512.png", "sizes": "512x512", "type": "image/png" }
    ]
}
```

Thêm vào `<head>` tất cả file HTML:
```html
<link rel="manifest" href="manifest.json">
```

#### 4.7 Structured Data JSON-LD (Tùy chọn — SEO)

Thêm vào `<head>` của `index.html`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "EcoHeritage AI",
  "description": "Nền tảng tra cứu thảo dược và di sản y học cổ truyền Việt Nam",
  "url": "https://ecoheritage-ai.vercel.app",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://ecoheritage-ai.vercel.app/dictionary.html?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```

---

## 4. QA CHECKLIST BẮT BUỘC

> ✅ = Phải pass trước khi deploy | ⚠️ = Nên kiểm tra

### 4.1 Checklist Chức Năng — index.html

- [x] ✅ Hero section hiển thị đúng trên mobile (≤576px)
- [x] ✅ Counter animation 20+, 12+, 100% hoạt động đúng suffix
- [x] ✅ Typing animation tagline hoạt động
- [x] ✅ AQI Dashboard tải dữ liệu live từ Open-Meteo API
- [x] ✅ AQI gauge SVG animate theo giá trị thực
- [x] ✅ Interval dừng khi tab không active (visibilitychange)
- [x] ✅ Bar Chart và Doughnut Chart render không lỗi
- [x] ✅ Chatbot EcoBot mở/đóng đúng khi click button
- [x] ✅ Chatbot gửi tin nhắn và nhận phản hồi (Gemini hoặc fallback)
- [x] ✅ Quick reply buttons hoạt động
- [x] ✅ Chat scroll xuống cuối tự động
- [x] ✅ Rate limiting chatbot 2 giây
- [x] ✅ Navbar sticky hoạt động khi scroll
- [x] ✅ Dark mode toggle lưu preference vào LocalStorage
- [x] ✅ Scroll progress bar hiển thị đúng
- [x] ✅ VanillaTilt hoạt động trên AQI param cards
- [x] ✅ Footer newsletter validate email trước khi submit
- [ ] ⚠️ `loading="lazy"` cho tất cả ảnh non-hero

### 4.2 Checklist Chức Năng — dictionary.html

- [x] ✅ Tải đủ 20+ bài thuốc từ LocalStorage
- [x] ✅ Skeleton loader hiển thị khi đang tải
- [x] ✅ Tìm kiếm real-time có debounce hoạt động
- [x] ✅ Lọc theo phân loại (Bổ dưỡng / An thần / Giải độc / Chữa bệnh)
- [x] ✅ Sắp xếp hoạt động
- [x] ✅ Grid view / List view toggle
- [x] ✅ Nút Xem chi tiết mở đúng modal với đúng bài thuốc
- [x] ✅ Nút lưu tim ❤️ lưu vào profile user đang đăng nhập
- [x] ✅ Nếu chưa đăng nhập → click tim → mở modal đăng nhập
- [x] ✅ Nút chia sẻ copy link có `?q=tên` vào clipboard
- [x] ✅ URL param `?q=tên` tự động điền vào ô tìm kiếm
- [ ] ⚠️ `loading="lazy"` cho ảnh bài thuốc trong cards

### 4.3 Checklist Chức Năng — map.html

- [x] ✅ Bản đồ Leaflet tải đúng, không có ô xám (invalidateSize x3)
- [x] ✅ 12+ markers hiển thị đúng vị trí GPS tại Đà Nẵng
- [x] ✅ Click marker → mở popup với ảnh và thông tin
- [x] ✅ Click sidebar item → bản đồ flyTo đúng vị trí
- [x] ✅ Đánh giá sao 1-5 hoạt động
- [x] ✅ Submit review lưu vào CSDL và cập nhật rating
- [x] ✅ Người chưa đăng nhập không thể submit review
- [x] ✅ Chuyển đổi layer bản đồ (OSM / Satellite / Hybrid)
- [x] ✅ Nút "Tìm vùng gần nhất" dùng GPS Geolocation

### 4.4 Checklist Auth

- [x] ✅ Đăng ký tài khoản mới thành công
- [x] ✅ Đăng ký email trùng → thông báo lỗi
- [x] ✅ Password hash SHA-256 trước khi lưu
- [x] ✅ Đăng nhập đúng email/password → thành công
- [x] ✅ Đăng nhập sai password → thông báo lỗi
- [x] ✅ Đăng nhập `admin@gmail.com` / `admin123` → hiện badge Admin
- [x] ✅ Đăng xuất xóa session và redirect về index.html
- [x] ✅ Cập nhật ảnh đại diện (dưới 1.5MB) → hiển thị ngay
- [x] ✅ Đổi mật khẩu với mật khẩu cũ sai → thông báo lỗi

### 4.5 Checklist Admin

- [x] ✅ Truy cập khi chưa đăng nhập → redirect về index.html
- [x] ✅ Truy cập với tài khoản thường → redirect về index.html
- [x] ✅ Session timeout 15 phút → redirect về index.html
- [x] ✅ Thêm / Sửa / Xóa bài thuốc → cập nhật đúng trong CSDL
- [x] ✅ Thêm / Sửa / Xóa địa điểm bản đồ
- [x] ✅ Gỡ bỏ review vi phạm → rating tự cập nhật
- [x] ✅ Xuất CSV danh sách bài thuốc
- [x] ✅ Confirm dialog trước khi xóa

### 4.6 Checklist Responsive

| Breakpoint | Thiết bị | Cần kiểm tra |
|---|---|---|
| ≤576px | Mobile nhỏ (iPhone SE) | Navbar collapse, hero text 2rem, cards 1 cột, chatbot thu gọn |
| 576–768px | Mobile lớn | Cards 2 cột, bản đồ layout |
| 768–992px | Tablet | Sidebar bản đồ, auth modal |
| 992–1200px | Laptop | Layout đầy đủ |
| ≥1200px | Desktop | Tất cả tính năng, VanillaTilt |

### 4.7 Checklist Trình Duyệt

- [ ] ⚠️ Chrome ≥ 90 — Bắt buộc hoạt động 100%
- [ ] ⚠️ Firefox ≥ 88 — Bắt buộc hoạt động 100%
- [ ] ⚠️ Edge ≥ 90 — Khuyến nghị test
- [ ] ⚠️ Safari iOS — Kiểm tra `backdrop-filter`, `position:fixed`, `crypto.subtle`

---

## 5. DANH SÁCH LỖI & TRẠNG THÁI

| ID | File | Mô tả lỗi | Mức độ | Trạng thái |
|---|---|---|---|---|
| BUG-01 | `data.js` | Overwrite CSDL người dùng mỗi lần tải trang | 🔴 Cao | ✅ Đã sửa |
| BUG-02 | `config.js` | API key Gemini push lên GitHub public | 🔴 Cao | ✅ Đã sửa — Cần rotate key nếu chưa làm |
| BUG-03 | `script.js` | Password lưu plaintext | 🔴 Cao | ✅ Đã sửa — SHA-256 via SubtleCrypto |
| BUG-04 | `map.html` | Gray tiles Leaflet khi chuyển tab | 🟡 TB | ✅ Đã sửa — invalidateSize x3 |
| BUG-05 | `index.html` | Newsletter input text không thấy | 🟢 Thấp | ✅ Đã sửa — v5-premium.css |
| BUG-06 | `admin.html` | Không có confirm dialog khi xóa | 🟡 TB | ✅ Đã sửa |
| BUG-07 | `script.js` | Chat không scroll xuống cuối tự động | 🟢 Thấp | ✅ Đã sửa |
| BUG-08 | `profile.html` | Achievement badge đôi khi không unlock | 🟡 TB | ✅ Đã sửa |
| BUG-09 | `script.js` | `eco_heritage_users` có thể có user trùng | 🟡 TB | ✅ Đã sửa |
| BUG-10 | `style.css` | `#herbDetailImg` bị kéo dài trên mobile | 🟢 Thấp | ✅ Đã sửa |
| BUG-11 | `script.js` | `setInterval` không lưu reference | 🟡 TB | ✅ Đã sửa |
| BUG-12 | `index.html` | Counter thứ 3 hiện `100+` thay vì `100%` | 🟢 Thấp | ✅ Đã sửa — dùng suffix từ originalText |
| **TODO-01** | Tất cả HTML | Thiếu `loading="lazy"` trên ảnh | 🟡 TB | ⏳ Chưa làm |
| **TODO-02** | CSS | Thiếu `prefers-reduced-motion` | 🟡 TB | ⏳ Chưa làm |
| **TODO-03** | 4 file HTML | Thiếu Open Graph tags | 🟢 Thấp | ⏳ Chưa làm |
| **TODO-04** | Tất cả HTML | Canonical URL dùng relative path | 🟢 Thấp | ⏳ Chưa làm |
| **TODO-05** | `index.html` | Nút Google Login không có label "(Demo)" | 🟢 Thấp | ⏳ Chưa làm |

---

## 6. QUY TẮC MÀU SẮC & THIẾT KẾ

### 6.1 Color Tokens — KHÔNG được thay đổi

```css
/* BẮT BUỘC dùng các biến này, KHÔNG hardcode màu */
--primary:          hsl(145, 63%, 42%)   /* #2eb366 — Xanh thảo dược chính */
--primary-dark:     hsl(145, 75%, 32%)   /* #1a8c4e — Xanh đậm hover */
--primary-light:    hsl(145, 60%, 65%)   /* #70c994 — Xanh nhạt glow */
--accent-orange:    hsl(35, 95%, 50%)    /* #f59e0b — Cam cảnh báo UV */
--accent-blue:      hsl(210, 95%, 45%)   /* #0d6efd — Xanh dương humidity */
--bg-dark-premium:  #0D1611              /* Nền tối admin/footer */
--bg-offwhite:      #F4F7F5              /* Nền sáng mặc định */
--text-main:        #1A2E22              /* Chữ chính light mode */
--text-muted:       #6c757d             /* Chữ phụ light mode */
```

### 6.2 Dark Mode Variables

```css
html.dark-mode {
    --bg-white:    #0D1611;
    --bg-offwhite: #111A14;
    --bg-light:    #162019;
    --text-main:   #E8F5E9;
    --text-muted:  #A5BCB0;
}
```

### 6.3 Typography — KHÔNG được thay đổi

```css
font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Thang cỡ chữ */
--fs-hero:    3.5rem;  /* Hero title */
--fs-section: 2.2rem;  /* Section title */
--fs-card:    1.1rem;  /* Card title */
--fs-body:    1rem;    /* Body text */
--fs-small:   0.85rem; /* Caption / badge */
```

### 6.4 Border Radius — KHÔNG được thay đổi

```css
--radius-sm:   10px;  /* Input, Badge */
--radius-md:   16px;  /* Card, Panel */
--radius-lg:   24px;  /* Section, Modal */
--radius-xl:   32px;  /* Hero, Dashboard */
--radius-full: 50%;   /* Avatar, dot */
```

### 6.5 Quy Tắc Z-index

```
z-index: 1000  → Navbar fixed top
z-index: 1050  → Modal backdrop
z-index: 1055  → Modal dialog
z-index: 1100  → Toast notifications
z-index: 9999  → Chatbot floating button
z-index: 10000 → Chatbot window khi mở
```

### 6.6 Animation Standards

| Element | Animation | Duration |
|---|---|---|
| Sections scroll | AOS fade-up | 600ms |
| Hero | AOS fade-right / zoom-in | 800ms |
| Hover cards | CSS scale(1.03) | 200ms |
| Chatbot toggle | CSS slide-up + opacity | 300ms |
| Particles nền | CSS floatParticle | 8–15s |
| Counter numbers | jQuery animate | 1500ms |
| AQI gauge | CSS stroke-dashoffset | 1000ms |
| VanillaTilt | max: 12°, speed: 300ms | — |

---

## 7. QUY TẮC BẢO MẬT BẮT BUỘC

### 7.1 Xử lý Input — Bắt buộc escapeHTML

```javascript
// HÀM BẮT BUỘC — Không được xóa hoặc bỏ qua
function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, function(char) {
        return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char];
    });
}

// QUY TẮC: Mọi nơi render data từ CSDL hoặc user input vào HTML đều phải qua escapeHTML()
// NGOẠI LỆ: Chỉ bỏ qua khi HTML do chính code tạo ra (không phải user nhập)
```

### 7.2 Bảo vệ Admin Route

```javascript
// PATTERN BẮT BUỘC — Guard clause là dòng ĐẦU TIÊN
function anyAdminFunction() {
    const now = Date.now();
    const SESSION_TIMEOUT = 15 * 60 * 1000;
    const user = readStorage('gh_user', null);

    if (!user || user.role !== 'admin') {
        showToast('Quyền truy cập bị từ chối!', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }
    if (!user.lastLoginTime || (now - user.lastLoginTime > SESSION_TIMEOUT)) {
        showToast('Phiên làm việc hết hạn!', 'warning');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }
    // ... code admin logic bên dưới
}
```

### 7.3 Validate Đầu Vào Form

```javascript
// BẮT BUỘC validate trước khi lưu vào CSDL
function validateHerbInput(data) {
    const errors = [];
    if (!data.name?.trim() || data.name.trim().length < 2)
        errors.push('Tên bài thuốc phải từ 2 ký tự');
    if (!data.scientific?.trim() || data.scientific.trim().length < 2)
        errors.push('Tên khoa học không hợp lệ');
    if (!data.category)
        errors.push('Phải chọn phân loại');
    if (!data.usage?.trim() || data.usage.trim().length < 10)
        errors.push('Công dụng phải từ 10 ký tự');
    return errors; // [] = hợp lệ
}
```

### 7.4 Rate Limiting Chatbot

```javascript
// BẮT BUỘC — Chặn spam chatbot
let lastChatTime = 0;
const CHAT_COOLDOWN_MS = 2000;

$('#chatSend').on('click', async function() {
    const now = Date.now();
    if (now - lastChatTime < CHAT_COOLDOWN_MS) {
        showToast('Vui lòng chờ trước khi gửi tiếp!', 'warning');
        return;
    }
    lastChatTime = now;
    // ... xử lý chat
});
```

### 7.5 Password Security

```javascript
// BẮT BUỘC — Không bao giờ lưu plaintext
async function hashPassword(password) {
    if (/^[0-9a-fA-F]{64}$/.test(password)) return password; // Đã hash
    try {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
        // Fallback bitwise khi crypto.subtle không khả dụng
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            hash = ((hash << 5) - hash) + password.charCodeAt(i);
            hash = hash & hash;
        }
        return String(hash);
    }
}
```

---

## 8. CHUẨN DỮ LIỆU LOCALSTORAGE

### 8.1 LocalStorage Keys

| Key | Kiểu | Mô tả |
|---|---|---|
| `eco_heritage_db_v7` | `{herbs: Herb[], regions: Region[]}` | CSDL chính |
| `eco_heritage_users` | `User[]` | Danh sách tài khoản |
| `gh_user` | `User` | Phiên đăng nhập hiện tại |
| `eco_dark_mode` | `"true"` / `"false"` | Dark mode preference |
| `eco_bot_chats` | `string(number)` | Đếm số lần chat (achievement) |
| `eco_bot_chats_history` | `string[]` | Lịch sử 10 câu hỏi gần nhất |

### 8.2 Schema Bài Thuốc (Herb)

```javascript
{
    id: String,           // "h1", "h2", ... (BẮT BUỘC - unique)
    name: String,         // "Thập Toàn Đại Bổ" (BẮT BUỘC)
    scientific: String,   // Tên nguồn gốc / khoa học (BẮT BUỘC)
    category: String,     // "Bổ dưỡng" | "An thần" | "Giải độc" | "Chữa bệnh" (BẮT BUỘC)
    usage: String,        // Mô tả công dụng chính (BẮT BUỘC)
    emoji: String,        // "🌿" (1 emoji)
    image: String,        // Đường dẫn ảnh "./images/bai_thuoc/..."
    fallbackImage: String,// Ảnh dự phòng khi image lỗi
    ingredients: String,  // Danh sách vị thuốc
    efficacy: String,     // Công dụng y lý chi tiết
    time: String,         // "Sắc uống: 45 phút"
    steps: String[],      // ["Bước 1...", "Bước 2..."]
    benefits: String,     // Lợi ích lâm sàng
    keywords: String      // Từ khóa tìm kiếm không dấu
}
```

### 8.3 Schema Địa Điểm (Region)

```javascript
{
    id: String,                  // "r1", "r2", ...
    name: String,                // Tên địa điểm
    location: String,            // Địa chỉ đầy đủ
    coords: [Number, Number],    // [latitude, longitude] — GPS thực tế Đà Nẵng
    type: String,                // "primary" | "success" | "warning" | "danger" | "info"
    image: String,               // Đường dẫn ảnh thumbnail
    herbs: String[],             // ["Tên thảo dược 1", ...]
    desc: String,                // Mô tả địa điểm
    rating: Number,              // 1.0–5.0 (tính trung bình từ reviewsList)
    reviewsCount: Number,        // = reviewsList.length (tự tính lại)
    reviewsList: Array<{
        user: String,
        rating: Number,          // 1–5
        comment: String
    }>
}
```

### 8.4 Schema Tài Khoản (User)

```javascript
{
    name: String,            // Họ tên hiển thị
    email: String,           // Email (unique key, lowercase)
    password: String,        // ✅ Hash SHA-256 (64 ký tự hex)
    role: String,            // "user" | "admin"
    avatar: String,          // Base64 data URL hoặc rỗng ""
    saved: String[],         // ["h1", "h3", ...] — ID bài thuốc đã lưu
    rated: String[],         // ["r1", "r4", ...] — ID địa điểm đã review
    lastLoginTime: Number    // Date.now() — dùng cho session timeout admin
}
```

### 8.5 Tài Khoản Mặc Định

| Vai trò | Email | Mật khẩu | Ghi chú |
|---|---|---|---|
| 👑 Admin | `admin@gmail.com` | `admin123` | Tự động tạo lần đầu |
| 👤 User | `minhhung@vku.edu.vn` | `user123` | Tự động tạo lần đầu |

---

## 📌 GHI CHÚ CUỐI

### Trước khi code — Đọc theo thứ tự

1. Đọc file `Rule.md` này
2. Kiểm tra quy tắc nhóm A — có vi phạm không?
3. Xem phần 5 — TODO nào liên quan đến task?

### Sau khi code — Checklist nhanh

```
□ Có dùng escapeHTML() cho user data render không?
□ Có dùng readStorage/writeStorage không?
□ Có debounce cho input search không?
□ Có fallback ảnh không?
□ Có loading="lazy" cho ảnh mới thêm không?
□ Có e.preventDefault() cho form submit không?
□ Có confirm() trước khi xóa không?
□ CSS có dùng var(--...) thay hardcode màu không?
```

### Trước khi deploy

```
□ config.js có trong .gitignore không?
□ API key chưa bị push lên git chưa?
□ Chạy QA Checklist mục 4 đầy đủ
□ Test trên Chrome + Firefox + mobile
□ TODO-01, TODO-02 đã xử lý chưa?
```

---

*© 2026 EcoHeritage AI Project — Đồ án môn học Web · VKU (Đà Nẵng)*
*Rule.md v7.0 — Cập nhật theo codebase thực tế, tất cả BUG-01 đến BUG-12 đã được fix*