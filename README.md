# 🌿 EcoHeritage AI - Trợ lý Sức khỏe & Di sản Y học Việt Nam

![EcoHeritage AI](https://img.shields.io/badge/EcoHeritage-AI%20v7.2-2eb366?style=for-the-badge&logo=leaf&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![Bootstrap 5](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

---

## 📋 Giới thiệu Dự án

**EcoHeritage AI** là một ứng dụng Web (Single-Page logic/Client-side) được phát triển nhằm mục đích số hóa, bảo tồn và quảng bá di sản y học cổ truyền Đông y tại khu vực Đà Nẵng, Việt Nam. Nền tảng kết hợp công nghệ bản đồ tương tác vệ tinh Leaflet, biểu đồ phân tích Chart.js, hệ thống quản trị dữ liệu CMS, và mô hình Generative AI (Google Gemini API) đóng vai trò là Lương Y Số tư vấn sức khỏe.

> ⚠️ **Đặc điểm kiến trúc**: Dự án hoạt động độc lập không cần cơ sở dữ liệu backend phức tạp. Toàn bộ dữ liệu người dùng, bài thuốc tự tạo, đánh giá bản đồ và nhật ký hoạt động được tự động đồng bộ hóa hai chiều thông qua **LocalStorage** của trình duyệt web (sử dụng key cơ sở dữ liệu `eco_heritage_db_v11` và cơ chế di trú tự động để bảo toàn dữ liệu khi có phiên bản nâng cấp mới).

---

## ✨ Các Tính năng Chính

### 1. 🏠 Trang chủ & Dashboard Thời tiết - Khí hậu
* **Chỉ số thời tiết & AQI Real-time**: Kết nối **Open-Meteo API** tự động cập nhật mỗi **15 phút** cho khu vực Đà Nẵng (AQI, Nhiệt độ, Độ ẩm, Tốc độ gió, Chỉ số tia UV).
* **Khuyến nghị thu hái thông minh**: Đưa ra lời khuyên y học cổ truyền tương ứng theo thời gian thực (ví dụ: nhiệt độ cao khuyên hái lá làm mát, độ ẩm cao khuyên bảo quản dược liệu chống ẩm mốc).
* **Giao diện Premium**: Counter animation sinh động, hiệu ứng hạt sinh học trôi nổi nhẹ nhàng ở nền (particles), thanh tiến trình đọc trang (scroll progress bar) và hiệu ứng chữ gõ tự động (typing effect).
* **Hệ thống chuyển đổi Giao diện**: Nút bật/tắt Dark Mode toàn phần phủ sóng 100% các trang, tối ưu độ tương phản cho người cao tuổi sử dụng ban đêm.

### 2. 📖 Từ điển Bài thuốc Cổ phương & Trình so sánh Dược liệu
* **Cơ sở dữ liệu y học cổ truyền**: Lưu trữ chi tiết 20+ bài thuốc quý Đông y (Thập Toàn Đại Bổ, Lục Vị Địa Hoàng Hoàn, Bát Vị Quế Phụ...) kèm thành phần dược chất, liều lượng, cách bào chế và tài liệu tham khảo chính thống từ Dược điển Việt Nam V.
* **Bộ lọc và Tìm kiếm nâng cao**: Hỗ trợ tìm kiếm thời gian thực (Debounce) kết hợp các nút phân loại bài thuốc (Bồi bổ, Xương khớp, Thanh nhiệt, An thần...).
* **Chế độ hiển thị linh hoạt**: Dễ dàng chuyển đổi giữa dạng lưới (Grid) trực quan và danh sách (List) chi tiết.
* **Bảng so sánh Bài thuốc song song (Comparison Modal)**:
  * Cho phép chọn 2 bài thuốc bất kỳ để so sánh chi tiết các tiêu chí: Công dụng, Chống chỉ định, Liều lượng, Nguồn gốc y văn.
  * Thiết kế z-index tối ưu 1065 ngăn chặn hiện tượng bị che khuất bởi backdrop.
  * Tích hợp Dark Mode hoàn chỉnh cho bảng biểu so sánh, đảm bảo dễ đọc.
* **Chức năng thả tim yêu thích**: Lưu trữ các bài thuốc quan tâm vào Sổ tay bài thuốc cá nhân.

### 3. 🗺️ Bản đồ Dược liệu Đà Nẵng tương tác
* **Bản đồ vệ tinh Leaflet**: Hiển thị chính xác tọa độ của 12+ khu bảo tồn thiên nhiên (Sơn Trà, Bà Nà), vùng trồng dược liệu sạch và các hợp tác xã thảo dược tại Đà Nẵng.
* **Tích hợp Bản đồ đa tầng**: Chuyển đổi linh hoạt giữa 4 bản đồ nền: OpenStreetMap, Google Maps Road, Google Maps Vệ tinh và Bản đồ Hybrid.
* **Tính năng định vị GPS**: Nhấp nút định vị để tìm vùng trồng thảo dược gần vị trí của người dùng nhất dựa trên khoảng cách địa lý Harvesine.
* **Hệ thống Đánh giá & Phản hồi**: Thành viên đăng nhập có thể đánh giá từ 1 đến 5 sao và viết nhận xét cho từng địa điểm. Hệ thống tự động tính toán lại điểm rating trung bình tức thời.
* **Premium Dark Mode**: Bản đồ và Popups thông tin được phủ CSS tối (background dark forest green, văn bản light mint green) có độ tương phản xuất sắc.

### 4. 🤖 Trợ lý Lương Y số EcoBot (Gemini AI)
* **Trí tuệ Nhân tạo thông minh**: Tích hợp trực tiếp **Google Gemini API** (sử dụng API Key cấu hình linh hoạt trong `config.js`).
* **System Prompt y học chuyên sâu**: AI được huấn luyện đóng vai Lương y số am hiểu Đông y, có phong cách trả lời ân cần, luôn đề xuất giải pháp thảo dược an toàn kèm nguồn tham khảo y văn rõ ràng.
* **Cơ chế Fallback thông minh**: Tự động phát hiện và chuyển đổi sang bộ dữ liệu trả lời cục bộ ngoại tuyến (Offline Response Engine) gồm 6 nhóm bệnh phổ biến (mất ngủ, ho cảm, đau khớp, dạ dày, suy nhược, tra cứu bài thuốc nội bộ) nếu không có mạng hoặc API Key hết lượt dùng.
* **Lịch sử hội thoại**: Tự động lưu 10 tin nhắn gần nhất vào LocalStorage, nút dọn dẹp lịch sử tiện lợi và nút tắt nhanh chatbot thiết kế chuẩn chỉ.
* **Giao diện Markdown đẹp mắt**: Phản hồi từ AI được định dạng bằng Markdown sạch sẽ, bọc trong các Bootstrap alert/card để làm nổi bật tên bài thuốc, liều lượng.

### 5. 👤 Trang cá nhân & Thành tựu (Gamification)
* **Hồ sơ thành viên**: Cho phép cập nhật ảnh đại diện (chuyển sang Base64 lưu trực tiếp vào LocalStorage) và đổi mật khẩu an toàn (mã hóa SHA-256).
* **Sổ tay bài thuốc**: Quản lý danh sách các bài thuốc đã thả tim.
* **Nhật ký Đánh giá & Câu hỏi**: Xem lại toàn bộ nhận xét bản đồ và lịch sử các câu hỏi đã đặt ra cho Lương Y Số.
* **Hệ thống 6 Huy chương Danh giá**: Tự động mở khóa huy chương dựa trên hoạt động thực tế của tài khoản (Đăng ký thành công, Thả tim 3 bài thuốc, Viết đánh giá địa điểm, Quản trị viên...).

### 6. 🛡️ Cổng Quản trị Admin CMS (Quản lý toàn diện)
* **Dashboard thống kê thời gian thực**: Biểu đồ hình quạt (Doughnut Chart) biểu diễn cơ cấu bài thuốc theo phân loại y học và các thông số tổng quan hệ thống.
* **Quản trị Bài thuốc & Địa điểm**: Form CRUD (Thêm, Sửa, Xóa) bài thuốc đông y và địa điểm bản đồ trực tiếp trên giao diện, cập nhật ngay lập tức vào cơ sở dữ liệu client.
* **Kiểm duyệt Đánh giá (Feedback Moderation)**: Danh sách tổng hợp toàn bộ đánh giá của người dùng trên bản đồ, cho phép Admin gỡ bỏ phản hồi tiêu cực/spam.
* **Xuất báo cáo**: Tính năng xuất danh sách bài thuốc thành file CSV tiện dụng.
* **Bảo mật**: Cơ chế tự động khóa phiên làm việc và đăng xuất Admin sau **15 phút** không hoạt động để tránh rò rỉ dữ liệu.

---

## 🔐 Tài khoản Trải nghiệm Mặc định

Bạn có thể đăng nhập bằng các tài khoản có sẵn dưới đây để trải nghiệm đầy đủ quyền user và admin:

| Vai trò | Email | Mật khẩu | Chức năng nổi bật |
|---------|-------|-----------|--------------------|
| 👑 **Quản trị viên (Admin)** | `admin@gmail.com` | `admin123` | Truy cập Cổng Quản trị CMS, CRUD bài thuốc/địa điểm, kiểm duyệt đánh giá, xem biểu đồ Chart.js |
| 👤 **Thành viên (User)** | `minhhung@vku.edu.vn` | `user123` | Đánh giá địa điểm bản đồ, thả tim bài thuốc, đổi avatar, tích lũy huy chương |

---

## 🛠️ Công nghệ Sử dụng

* **Front-end Core**: HTML5, CSS3 (Custom variables / HSL color system), JavaScript (ES6+).
* **Libraries**: jQuery 3.7.1, Bootstrap 5.3.2 (Giao diện đáp ứng & Lưới hệ thống), AOS.js (Hiệu ứng cuộn trang).
* **Maps**: Leaflet.js 1.9.4.
* **Charts**: Chart.js.
* **AI Service**: Google Gemini API.
* **Weather API**: Open-Meteo API (Da Nang station).
* **Security**: Web Crypto API (SHA-256 mã hóa mật khẩu phía client).

---

## 📁 Cấu trúc Thư mục Dự án

```
Ecoheritage-ai-no-database/
├── index.html          # Trang chủ chính & Dashboard thời tiết
├── dictionary.html     # Tra cứu từ điển bài thuốc & So sánh dược liệu
├── map.html           # Bản đồ dược liệu vệ tinh Đà Nẵng & Reviews
├── profile.html       # Hồ sơ cá nhân & Hệ thống huy chương thành tựu
├── admin.html         # Cổng quản trị Admin CMS & Thống kê
├── script.js          # Logic JavaScript điều khiển toàn hệ thống (~4300 dòng)
├── style.css          # Hệ thống Design System gốc và biến màu
├── components-extra.css     # CSS nâng cấp Premium giao diện, Dark Mode overrides
├── data.js            # Cơ sở dữ liệu mặc định y học (20+ bài thuốc & 12+ địa điểm)
├── config.js          # Cấu hình API Key và Google Client ID
├── manifest.json      # Tệp manifest hỗ trợ PWA
└── README.md          # Tài liệu hướng dẫn dự án (Tệp tin này)
```

---

## 🚀 Cài đặt & Hướng dẫn Chạy Local

Do dự án là ứng dụng Client-side thuần túy, việc cài đặt và chạy vô cùng đơn giản:

### Cách 1: Chạy trực tiếp từ thư mục
1. Tải toàn bộ mã nguồn hoặc clone repository:
   ```bash
   git clone https://github.com/HoshiSS1/Ecoheritage-ai-no-database.git
   ```
2. Mở thư mục dự án và khởi chạy tệp tin `index.html` trên trình duyệt web của bạn.

### Cách 2: Khởi chạy Máy chủ Cục bộ (Khuyên dùng)
Để các tính năng PWA (Manifest) hoạt động tối ưu, hãy chạy dự án dưới dạng HTTP Server:
1. Mở terminal tại thư mục dự án.
2. Khởi chạy máy chủ cục bộ bằng `npx`:
   ```bash
   npx -y http-server -p 8080
   ```
3. Truy cập địa chỉ: [http://localhost:8080](http://localhost:8080) trên trình duyệt.

### Cách 3: Chạy Kiểm tra Hệ thống & Chẩn đoán Lỗi (Diagnostics)
Trước khi chấm điểm hoặc bàn giao dự án, bạn có thể chạy công cụ kiểm tra tự động tích hợp sẵn để quét toàn bộ lỗi:
1. Mở terminal tại thư mục dự án.
2. Chạy script chẩn đoán bằng Node.js:
   ```bash
   node validate.js
   ```
3. Công cụ sẽ quét lỗi cú pháp JavaScript, kiểm tra trùng lặp ID trong thẻ HTML, xác minh các liên kết tài nguyên cục bộ (CSS, JS, Images) và đảm bảo các tệp tin ảnh trong cơ sở dữ liệu `data.js` đều tồn tại đầy đủ trên ổ đĩa.

---

## 👨‍💻 Thông tin Phát triển

* **Môn học**: Phát triển Ứng dụng Web
* **Học viện**: Trường Đại học Công nghệ Thông tin và Truyền thông Việt - Hàn (VKU)
* **Ý tưởng**: 🌿 *"Bảo tồn giá trị văn hóa và nguồn gen dược liệu Việt Nam thông qua sức mạnh số hóa và trí tuệ nhân tạo"*
