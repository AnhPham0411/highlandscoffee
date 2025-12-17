// utils/mailer.js
const nodemailer = require('nodemailer');

// 1. Cấu hình Transporter (Người vận chuyển)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bintuananh2003@gmail.com', // THAY EMAIL CỦA BẠN
        pass: 'ioma fpve ofsu gdxt'        // THAY MẬT KHẨU ỨNG DỤNG
    }
});

// 2. Hàm gửi hóa đơn sau khi đặt hàng
const sendOrderInvoice = async (toEmail, userName, orderId, total, cartItems, address, phone) => {
    try {
        // Tạo bảng danh sách sản phẩm HTML
        let itemsHtml = '';
        cartItems.forEach(item => {
            let thanhTien = item.giaban * item.quantity;
            itemsHtml += `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.tensp}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${parseInt(item.giaban).toLocaleString('vi-VN')}đ</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${thanhTien.toLocaleString('vi-VN')}đ</td>
                </tr>
            `;
        });

        // Nội dung Email (Hóa đơn)
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0;">
                <div style="background-color: #b22830; padding: 20px; text-align: center; color: white;">
                    <h2>XÁC NHẬN ĐƠN HÀNG</h2>
                </div>
                <div style="padding: 20px;">
                    <p>Xin chào <strong>${userName}</strong>,</p>
                    <p>Cảm ơn bạn đã đặt hàng tại Highlands Coffee. Đơn hàng của bạn đã được tiếp nhận.</p>
                    
                    <h3>Thông tin đơn hàng #${orderId}</h3>
                    <p><strong>Ngày đặt:</strong> ${new Date().toLocaleString('vi-VN')}</p>
                    <p><strong>Người nhận:</strong> ${userName}</p>
                    <p><strong>Số điện thoại:</strong> ${phone}</p>
                    <p><strong>Địa chỉ:</strong> ${address}</p>

                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 8px;">Sản phẩm</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">SL</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Đơn giá</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Thành tiền</th>
                        </tr>
                        ${itemsHtml}
                        <tr>
                            <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">Tổng cộng:</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: right; color: #b22830; font-weight: bold;">${parseInt(total).toLocaleString('vi-VN')}đ</td>
                        </tr>
                    </table>
                    
                    <p style="margin-top: 20px;">Đơn hàng sẽ sớm được giao đến bạn!</p>
                </div>
                <div style="background-color: #f9f9f9; padding: 10px; text-align: center; font-size: 12px; color: #666;">
                    Highlands Coffee Store - Hotline: 1900 1755
                </div>
            </div>
        `;

        // Gửi mail
        await transporter.sendMail({
            from: '"Highlands Coffee" <email_cua_ban@gmail.com>',
            to: toEmail,
            subject: `Xác nhận đơn hàng #${orderId} - Highlands Coffee`,
            html: htmlContent
        });

        console.log(`Đã gửi hóa đơn đến: ${toEmail}`);
        return true;
    } catch (error) {
        console.error("Lỗi gửi mail:", error);
        return false;
    }
};

// 3. Hàm gửi mail chào mừng khi Đăng ký
const sendWelcomeEmail = async (toEmail, userName) => {
    try {
        await transporter.sendMail({
            from: '"Highlands Coffee" <email_cua_ban@gmail.com>',
            to: toEmail,
            subject: "Chào mừng bạn đến với Highlands Coffee!",
            html: `
                <h3>Xin chào ${userName},</h3>
                <p>Chúc mừng bạn đã tạo tài khoản thành công.</p>
                <p>Hãy đặt ngay những ly cà phê thơm ngon nhé!</p>
            `
        });
    } catch (error) {
        console.error("Lỗi gửi mail đăng ký:", error);
    }
};

module.exports = { sendOrderInvoice, sendWelcomeEmail };