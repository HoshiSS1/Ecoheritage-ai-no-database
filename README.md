# 🌿 EcoHeritage AI - Trợ lý Sức khỏe & Di sản Y học Việt Nam

![EcoHeritage AI](https://img.shields.io/badge/EcoHeritage-AI%20v5.0-2eb366?style=for-the-badge&logo=leaf&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)

## 📋 Giới thiệu

**EcoHeritage AI** là nền tảng web ứng dụng trí tuệ nhân tạo Gemini 2.0 Flash để bảo tồn và phát huy di sản y học cổ truyền Đông y tại Đà Nẵng, Việt Nam. Hệ thống tích hợp chatbot Lương Y số AI, bản đồ vệ tinh GPS theo dõi vườn thảo dược, từ điển 20+ bài thuốc cổ phương và cổng quản trị CMS hoàn chỉnh.

> ⚠️ **Lưu ý**: Dự án không sử dụng backend/database, toàn bộ dữ liệu được lưu trữ trên **LocalStorage** của trình duyệt.

## ✨ Tính năng chính

### 🏠 Trang chủ
- Dashboard môi trường Đà Nẵng (AQI, Nhiệt độ, Độ ẩm, UV, Gió) - **Live API** từ Open-Meteo
- Hiệu ứng particles nền chuyển động, counter animation, typing effect
- Dark Mode toggle toàn trang
- Scroll progress bar

### 📖 Từ điển Bài thuốc Đông y
- **20+ bài thuốc cổ phương** với công dụng, dược chất, quy trình bào chế chi tiết
- Tìm kiếm real-time (debounce), lọc theo phân loại, sắp xếp
- Chế độ xem Grid / List
- Lưu bài thuốc yêu thích (thả tim ❤️)
- Chia sẻ liên kết bài thuốc

### 🗺️ Bản đồ Di sản Sinh học
- Bản đồ **Leaflet** tương tác với 6+ khu bảo tồn thảo dược Đà Nẵng
- Multi-layer: OpenStreetMap, Google Road, Satellite, Hybrid
- Hệ thống đánh giá 1-5 sao & viết nhận xét cho mỗi địa điểm
- Tìm vùng gần nhất bằng **GPS Geolocation**
- Custom pin markers theo phân loại

### 🤖 Chatbot Lương Y số EcoBot
- Tích hợp **Google Gemini 2.0 Flash API** với system prompt chuyên biệt y học cổ truyền
- Tra cứu trực tiếp CSDL nội bộ 20+ bài thuốc (chính xác 100%)
- **6 fallback responses** chi tiết khi API offline (mất ngủ, đau khớp, ho cảm, suy nhược, dạ dày, tổng quát)
- Lưu lịch sử 10 tin nhắn gần nhất
- Rate-limiting chống spam (2 giây cooldown)
- Nút gợi ý nhanh (quick reply)
- Widget floating trên tất cả các trang

### 👤 Trang cá nhân
- Cập nhật họ tên & ảnh đại diện (Base64 → LocalStorage)
- Đổi mật khẩu (SHA-256 hash)
- Xóa tài khoản vĩnh viễn
- Sổ tay bài thuốc đã lưu
- Vườn thảo dược đã đánh giá
- Lịch sử câu hỏi đã hỏi Lương Y
- **6 huy chương thành tựu** gamification

### 🛡️ Cổng Quản trị Admin CMS
- Dashboard thống kê tổng quan
- CRUD bài thuốc (Thêm/Sửa/Xóa)
- CRUD địa điểm bản đồ
- Quản lý tài khoản người dùng
- Moderation đánh giá (Gỡ bỏ review + tính lại rating)
- Xuất CSV danh sách bài thuốc
- Phiên đăng nhập admin timeout 15 phút

## 🔐 Tài khoản mặc định

| Vai trò | Email | Mật khẩu |
|---------|-------|-----------|
| 👑 Admin | `admin@gmail.com` | `admin123` |
| 👤 User | `minhhung@vku.edu.vn` | `user123` |

## 🛠️ Công nghệ sử dụng

| Công nghệ | Mục đích |
|------------|----------|
| HTML5 / CSS3 | Cấu trúc & giao diện |
| JavaScript (ES6+) | Logic nghiệp vụ |
| jQuery 3.7 | DOM manipulation |
| Bootstrap 5.3 | Responsive UI framework |
| Leaflet.js | Bản đồ tương tác |
| Chart.js | Biểu đồ thống kê |
| AOS.js | Scroll animations |
| Google Gemini 2.0 Flash | AI Chatbot API |
| Open-Meteo API | Dữ liệu thời tiết & AQI |
| Web Crypto API (SHA-256) | Mã hóa mật khẩu |
| LocalStorage | Lưu trữ dữ liệu client-side |

## 📁 Cấu trúc dự án

```
Web CK/
├── index.html          # Trang chủ
├── dictionary.html     # Từ điển bài thuốc
├── map.html           # Bản đồ di sản
├── profile.html       # Trang cá nhân
├── admin.html         # Cổng quản trị CMS
├── script.js          # Logic JavaScript chính (~2400 dòng)
├── style.css          # CSS Design System
├── v5-premium.css     # Premium UI overrides
├── data.js            # Dữ liệu mặc định (herbs + regions)
├── config.js          # API key configuration
├── images/            # Ảnh bài thuốc & assets
└── README.md          # Tài liệu dự án
```

## 🚀 Cài đặt & Chạy

### Yêu cầu
- Trình duyệt web hiện đại (Chrome, Firefox, Edge)
- Không cần cài đặt backend hay database

### Chạy local
```bash
# Clone repo
git clone https://github.com/HoshiSS1/Ecoheritage-ai-no-database.git
cd Ecoheritage-ai-no-database

# Mở bằng Live Server (VS Code) hoặc http-server
npx -y http-server -p 8080

# Truy cập: http://localhost:8080
```

## 🎨 Thiết kế

- **Glassmorphism** navbar & chatbot
- **HSL Color Palette** xanh thảo dược tươi
- **Dark Mode** toàn trang
- **Micro-animations** hover, scroll, typing
- **Responsive** mobile-first design
- **Premium typography** (Outfit font)

## 👨‍💻 Tác giả

**Nguyễn Minh Hùng** - Sinh viên VKU (Đại học CNTT & Truyền thông Việt - Hàn)

## 📄 License

Dự án phục vụ mục đích học tập (Bài thi cuối kỳ môn Lập trình Web).

---

> 🌿 *"Bảo tồn di sản y học cổ truyền bằng công nghệ hiện đại"*
