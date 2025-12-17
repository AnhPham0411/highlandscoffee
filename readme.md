Bạn bắt buộc phải tạo "Mật khẩu ứng dụng" (App Password). Dưới đây là từng bước chi tiết để lấy mật khẩu này:

Bước 1: Bật xác minh 2 bước (Bắt buộc)
Truy cập vào trang quản lý tài khoản Google: https://myaccount.google.com/

Chọn mục Bảo mật (Security) ở menu bên trái.

Tìm phần "Cách bạn đăng nhập vào Google".

Bật chế độ Xác minh 2 bước (2-Step Verification) lên (liên kết với số điện thoại của bạn).

Lưu ý: Nếu chưa bật cái này, Google sẽ không cho tạo mật khẩu ứng dụng.

Bước 2: Tạo Mật khẩu ứng dụng
Vẫn ở trang Bảo mật, sau khi đã bật xác minh 2 bước.

Ở thanh tìm kiếm trên cùng của trang, gõ từ khóa: "Mật khẩu ứng dụng" (hoặc "App passwords").

Chọn kết quả Mật khẩu ứng dụng.

Đặt tên cho ứng dụng (Ví dụ: Web Ban Hang) rồi bấm Tạo (Create).

Google sẽ cấp cho bạn một chuỗi 16 ký tự (ví dụ: abcd efgh ijkl mnop).

Hãy copy chuỗi này lại, đây chính là pass bạn cần điền vào code.

Bước 3: Điền vào Code
Bạn quay lại file utils/mailer.js và điền như sau:

JavaScript

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // Email chính của bạn (người gửi)
        user: 'pham.tuan.anh@gmail.com', 
        
        // Mật khẩu ứng dụng 16 ký tự vừa lấy (KHÔNG PHẢI PASS ĐĂNG NHẬP)
        // Bạn có thể để nguyên khoảng trắng hoặc xóa đi đều được
        pass: 'abcd efgh ijkl mnop'      
    }
});