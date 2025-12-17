import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatCurrencyVND } from "../../Components/Common/finance"; 
// Đảm bảo đường dẫn tới file finance đúng

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy dữ liệu được truyền sang từ CartPage
  const { orderData } = location.state || {};

  // Nếu người dùng truy cập trực tiếp link này mà không qua đặt hàng -> Đẩy về trang chủ
  if (!orderData) {
    return (
        <div className="text-center py-20 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Không tìm thấy thông tin đơn hàng!</h2>
            <button 
                onClick={() => navigate("/")} 
                className="bg-[#b22830] text-white px-6 py-2 rounded hover:bg-red-700 transition"
            >
                Về trang chủ
            </button>
        </div>
    );
  }

  return (
    <div className="py-14 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full mx-4">
        {/* Header xác nhận */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
             <span className="text-green-500 text-5xl">✓</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Đặt hàng thành công!</h2>
          <p className="text-gray-600 mt-2">Cảm ơn bạn đã mua sắm tại Highlands Coffee.</p>
        </div>

        {/* Thông tin người nhận */}
        <div className="border-t border-b py-5 mb-5">
            <h3 className="font-bold text-lg mb-3 text-[#b22830] uppercase">Thông tin nhận hàng</h3>
            <div className="space-y-2 text-sm text-gray-700">
                <p><strong className="w-32 inline-block">Người nhận:</strong> {orderData.tennguoinhan}</p>
                <p><strong className="w-32 inline-block">Số điện thoại:</strong> {orderData.sdtnguoinhan}</p>
                <p><strong className="w-32 inline-block">Địa chỉ:</strong> {orderData.diachinhan}</p>
            </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="mb-6">
            <h4 className="font-semibold mb-3 text-lg">Sản phẩm đã đặt:</h4>
            <div className="bg-gray-50 rounded p-4">
                <ul className="space-y-3">
                    {orderData.cart.map((item, index) => (
                        <li key={index} className="flex justify-between text-sm border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                            <span className="font-medium text-gray-800">
                                {item.tensp} <span className="text-gray-500 font-normal">x{item.quantity}</span>
                            </span>
                            <span className="font-semibold text-gray-700">
                                {formatCurrencyVND((item.giaban * item.quantity).toString())}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* Tổng tiền */}
        <div className="border-t pt-5 mb-8">
            {/* Nếu có phí ship thì hiện, không thì thôi (hoặc hiện 0đ) */}
            {orderData.shippingFee > 0 && (
                 <div className="flex justify-between text-sm mb-2 text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span>{formatCurrencyVND(orderData.shippingFee.toString())}</span>
                </div>
            )}
             {/* Nếu có giảm giá */}
            {orderData.discount > 0 && (
                 <div className="flex justify-between text-sm mb-2 text-green-600">
                    <span>Voucher giảm giá:</span>
                    <span>-{formatCurrencyVND(orderData.discount.toString())}</span>
                </div>
            )}

            <div className="flex justify-between font-bold text-2xl mt-2">
                <span>Tổng thanh toán:</span>
                <span className="text-[#b22830]">{formatCurrencyVND(orderData.tongtien.toString())}</span>
            </div>
            <p className="text-xs text-gray-500 mt-3 italic text-center">
                *Hóa đơn chi tiết đã được gửi tới email của bạn.
            </p>
        </div>

        {/* Nút điều hướng */}
        <div className="flex flex-col sm:flex-row gap-4">
            <button 
                onClick={() => navigate("/")}
                className="flex-1 border border-gray-300 py-3 rounded-md font-semibold hover:bg-gray-100 transition duration-200"
            >
                Về trang chủ
            </button>
            <button 
                onClick={() => navigate("/Orders")} 
                className="flex-1 bg-[#b22830] text-white py-3 rounded-md font-semibold hover:bg-red-700 transition duration-200 shadow-md"
            >
                Xem lịch sử đơn hàng
            </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;