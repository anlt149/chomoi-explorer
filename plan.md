# Backend & Database Integration Plan

Our project relies on a Cloud-based Backend-as-a-Service approach to ensure it remains scalable, low-cost (Free Tier focused), and high-performance. We have chosen **Supabase** (PostgreSQL + Auto-generated APIs) to satisfy this requirement.

## Phase 1: Initial Backend Setup (Completed/Scaffolded)
- [x] Configure connection file (`src/supabaseClient.js`).
- [x] Integrate environment variables securely (`.env`).
- [x] Design PostgreSQL schema and Seed format (`supabase_seed.sql`).
- [x] Connect `App.jsx` to fetch data asynchronously with a fallback to mock data.

## Phase 2: Live Data Migration (Pending)
Currently, the application fetches from Supabase but falls back to `src/data/mockData.js` since the live Supabase Keys are either placeholders or the cloud database hasn't been seeded. 

**Steps to Complete:**
1. Populate your Supabase project with actual keys in `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
2. Execute the setup queries from `supabase_seed.sql` on the Supabase SQL Editor.
3. Completely remove `mockData.js` from the Local Source code to enforce live-database queries only.

## Phase 3: Admin Actions & CRUD Capabilities (Completed)
To make the application fully self-sustaining without needing database SQL tools:
- [x] **Build an Admin/Management Component:** Developed a UI modal toggleable via the header `+ Admin Dashboard` button to allow authorized users to quickly add new restaurants (Name, Categories, Image links, Open/Close hours) into the Database securely.
- [x] **Set up Authentication:** Used Supabase Auth (Email/Password) to protect the write permissions to the `restaurants` table. Unverified users will be challenged with a Secure Login modal before they can see or access the Admin tool. Row Level Security guarantees data safety.
- [ ] **Storage:** Use Supabase Storage to upload real image files instead of referencing `unsplash` URLs.

## Phase 4: Future Improvements Action Plan

Dựa trên kiến trúc hiện tại, dưới đây là những mục nâng cấp cần thiết và những điểm cộng sáng giá cho lộ trình dài hạn:

### 🔴 MUST HAVE (Thiết Yếu - Cần làm ngay)
1. **Chức năng Edit/Delete (Hoàn thiện CRUD)**: Admin hiện tại chỉ mới có thể "Thêm" (Create). Hệ thống bắt buộc phải có nút Sửa/Xóa để cập nhật quán ăn ngừng kinh doanh hoặc sai số điện thoại.
2. **Supabase Storage (Hình ảnh chuẩn)**: Không thể phụ thuộc vào URL ảnh (Hotlinking) bên ngoài vì link rất dễ chết. Cần tích hợp nút Upload File ở khung Admin đẩy trực tiếp hình ảnh món ăn lên Storage Bucket của Supabase.
3. **Search & Pagination Server-side**: Khi dữ liệu vượt qua con số hàng trăm quán, việc `select('*')` sập nguồn hệ thống. Cần tích hợp Phân Trang (Pagination) hoặc Scroll Load nhồi điểm từ Backend.
4. **Deployment & CI/CD**: Thiết lập project lên hệ sinh thái Vercel và map Domain thực tế.

### 🟢 GOOD TO HAVE (Nâng Cao - Cần để tạo lợi thế WOW)
1. **SSG/SSR (Tối ưu hóa SEO)**: Do React/Vite là ứng dụng Client-Side, Google Bot rất khó quét nội dung. Chuyển đổi/Xuất Web sang dạng Render Server (Next.js/Remix) nếu muốn đẩy mạnh SEO cho từng Menu quán ăn trên Google Search.
2. **Booking/Hệ thống Đánh Giá Tính Điểm (Review & Rating)**: Tính năng Rating đang là mock data `4.5`. Nên thiết kế Supabase Database Bảng `Reviews` lấy trung bình cộng để khách hàng thực có thể vote sao.
3. **Lưu Quán Yêu Thích (Bookmarks)**: Sử dụng đơn giản `LocalStorage` để khách vãng lai nhấn nút "Thích" lưu lại thành 1 list quán tủ đi ăn dần mà không cần tạo Account.
4. **Sắp xếp theo Vị trí độ gần xa (Geolocation Search)**: Bật API định vị thiết bị khách để tự xếp các danh sách quán cách < 1km lên trên cùng (dùng PostGIS trong Supabase).

## Phase 5: Image Optimization, Soft Delete & Query Tunning (Next Steps)

### Vấn đề 1: Tối ưu Hình ảnh (Performance & Cost)
- **Hình ảnh có được tối ưu tự động không?** Không, nếu chỉ lưu trữ ảnh Raw, dung lượng trang web tải có thể lên tới chục MB gây chậm và tốn tiền băng thông mạng/Cloud.
- **Giải pháp:** Sử dụng CDN biến đổi ảnh tại Client (Image Transformation). Có thể thiết đặt `Supabase Storage (Pro Plan)` hoặc tích hợp **Cloudinary** (Miễn phí 100% dung lượng lớn). Cloudinary cung cấp tham số URL (vd: `q_auto,f_auto,w_500`) giúp tự ép ảnh JPG 5MB về định dạng WebP siêu nét dưới 100KB tại thời gian thực (Giảm 80% băng thông tải web).

### Vấn đề 2: Cấp quyền Sửa/Xóa Quán Ăn (Soft Delete Component)
Thay vì thực hiện kỹ thuật Xóa Cứng (Hard Delete) triệt tiêu dữ liệu vĩnh viễn khỏi Database, ta sẽ áp dụng mô hình **Soft Delete (Xóa Mềm)** và Ẩn Quán.
- **Bổ sung cột:** Thêm trường `is_active` (BOOLEAN, mặc định `TRUE`) vào bảng `restaurants`. 
- **Chức năng Admin Panel:** 
  - Khung liệt kê dành riêng cho Admin có kèm theo nút [Edit] để mở lại Form thông tin và lưu đè.
  - Nút [Toggle/Delete]: Gạt giá trị `is_active` sang `FALSE`.
- **Hiển thị giao diện:** Quán có `is_active = FALSE` tự động bị che khỏi màn hình Khách. 

### Vấn đề 3: Tối ưu Database Query (Query Optimization)
Khi App truy vấn dữ liệu từ Supabase, lệnh `select('*')` đang lôi toàn bộ chữ nghĩa, description về dù List view chưa dùng đến. 
- **Data Pruning:** Chỉnh query chính thành `supabase.from('restaurants').select('id, name, image_url, category, has_delivery, rating, address').eq('is_active', true)`. Chỉ khi nào chạm vào Modal Chi tiết, ta mới truy vấn tải Description và Thời giờ hoạt động.
- Tránh việc lấy thừa chữ không cần thiết tốn băng thông Data Transfer Out của Supabase Free Tier.

## Phase 6: Deployment & Hosting (Chi phí cực kì rẻ gọn)
Để đưa ứng dụng lên mạng toàn cầu với độ ổn định cao mà gần như **Miễn Phí 100%**:
1. **Frontend Hosting (Vercel):** Nền tảng phù hợp nhất cho dự án mã nguồn Vite/React. Vercel cung cấp Free Tier vô cùng hào phóng, tự động cấp Chứng chỉ bảo mật (SSL/HTTPS), tích hợp cực tốt với GitHub (Code được push lên là tự động build ra live website tức thời).
2. **Backend / Database (Supabase):** Theo thiết lập hiện tại, Supabase Free Tier cho phép 50.000 User đăng nhập/tháng và Database lên tới 500MB miễn phí, dư sức phục vụ quy mô tìm đồ ăn của người dân trong toàn Huyện Chợ Mới.
3. **Domain (Tên miền):** Nếu muốn chuẩn thương hiệu, bạn chỉ tốn tiền mua tên miền (khoảng 200k/năm) để trỏ vào Vercel là xong. Mặc định Vercel vẫn cấp đường link `.vercel.app` an toàn và uy tín.
=> **Tổng chi phí duy trì hàng tháng: $0**

## Phase 8: Vercel Deployment & Secure Secrets Management
Thay vì lưu trữ khóa bí mật trong file `.env` cục bộ (có nguy cơ rò rỉ khi đẩy lên GitHub), chúng ta sẽ sử dụng hệ thống Quản lý Biến môi trường của Vercel:

1. **Deploy Frontend to Vercel:**
   - Kết nối Repository GitHub với Vercel.
   - Vercel sẽ tự động nhận diện project là Vite/React.

2. **Secure Variable Configuration (Thay thế file .env):**
   - Vào mục **Settings > Environment Variables** trên Vercel Dashboard.
   - Thêm 2 khóa: `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`.
   - Giá trị sẽ được Vercel mã hóa (Encrypted) và chỉ cung cấp cho App lúc Runtime. Điều này giúp loại bỏ hoàn toàn nhu cầu dùng file `.env` trong môi trường chạy thật.

3. **CI/CD Pipeline:**
   - Mỗi lần bạn `git push` code mới lên, Vercel sẽ tự động cập nhật bản live mà không cần thao tác tay.

4. **Bảo mật Database (Giai đoạn cuối):**
   - Đảm bảo **Row Level Security (RLS)** trên Supabase đã được bật (đã thiết lập ở Phase 7) để bảo vệ dữ liệu khỏi các truy cập trái phép từ bên ngoài dù có lộ Token.

## Phase 7: Database Migration & Version Control (Professional Workflow)
Thay vì chạy SQL script thủ công, chúng ta sẽ chuyển sang quy trình "Migration" như Flyway để quản trị DB ổn định hơn:
1. **Supabase CLI Integration:** 
   - Cài đặt Supabase CLI trên máy local.
   - Dùng `supabase init` để khởi tạo cấu trúc project database.
2. **Migration Files:** 
   - Thay vì `supabase_seed.sql`, mỗi thay đổi sẽ nằm trong `supabase/migrations/<timestamp>_init.sql`.
   - Dùng lệnh `supabase db push` để đẩy code lên server thật.
3. **Local Development:** Cho phép lập trình viên chạy server Supabase dưới local để test tính năng Auth/DB mà không cần dùng internet.
