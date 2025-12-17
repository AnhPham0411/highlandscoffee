import React, { useEffect, useState } from "react";
import { useCart } from "../../Context/CartContext";
import { formatCurrencyVND } from "../../Components/Common/finance";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // State cho form
  const [formData, setFormData] = useState({
    diachinhan: "",
    tennguoinhan: "",
    sdtnguoinhan: "",
    city: "",
    trangthai: "Chờ xác nhận",
  });

  // State cho Shipping (Vận chuyển)
  const [shippings, setShippings] = useState([]);
  const [shipping, setShipping] = useState(0);
  const [city, setCity] = useState("");

  // State cho Voucher
  const [vouchers, setVouchers] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const name = localStorage.getItem("Name");

  // --- 1. Fetch dữ liệu ban đầu ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getProduct");
        setData(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const getShippings = async () => {
      try {
        const response = await axios.get("http://localhost:3000/shippings");
        setShippings(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const getVouchers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/vouchers");
        setVouchers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    getShippings();
    getVouchers();
  }, []);

  // --- 2. Tính toán tổng tiền sản phẩm (Subtotal) ---
  const solongsanpham = cart.reduce((total, item) => total + item.quantity, 0);
  const tongtien = cart.reduce(
    (accumulator, item) => accumulator + item.giaban * item.quantity,
    0
  );

  // --- 3. Xử lý Voucher ---
  useEffect(() => {
    if (voucherCode.trim() === "") {
      setDiscountAmount(0);
      return;
    }

    if (vouchers.length > 0) {
      try {
        const found = vouchers.find(
          (v) => v.code.toLowerCase() === voucherCode.toLowerCase()
        );
        if (found) {
          const discount =
            found.type === "percent"
              ? Math.floor((found.value / 100) * tongtien)
              : found.value;

          // Giảm giá không được vượt quá tổng tiền
          setDiscountAmount(discount > tongtien ? tongtien : discount);
        } else {
          setDiscountAmount(0);
        }
      } catch (e) {
        console.error("Lỗi xử lý voucher:", e);
      }
    }
  }, [voucherCode, cart, tongtien, vouchers]);

  // --- 4. Hàm Gửi đơn hàng (Đã sửa để return data) ---
  const postData = async (orderData) => {
    try {
      const response = await axios.post("http://localhost:3000/order", orderData);
      console.log("Order Response:", response.data);
      clearCart(); // Xóa giỏ hàng sau khi thành công
      return response.data; // QUAN TRỌNG: Trả về kết quả để hàm submit xử lý tiếp
    } catch (error) {
      console.error("Error adding order:", error);
      alert("Đặt hàng thất bại. Vui lòng kiểm tra lại kết nối!");
      return null;
    }
  };

  const handleConfirmCart = () => {
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // --- 5. Xử lý Submit Form (Chuyển hướng sang trang Success) ---
  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (!formData.diachinhan || !formData.tennguoinhan || !formData.sdtnguoinhan) {
      alert("Bạn cần nhập đầy đủ thông tin (Địa chỉ, Tên, SĐT)");
      return;
    }

    // Tính tổng tiền cuối cùng
    const finalTotal = parseFloat(tongtien) + parseFloat(shipping) - parseFloat(discountAmount);

    const orderPayload = {
      cart: cart,
      name: name, // Tên user lấy từ localStorage
      solongsanpham: solongsanpham,
      tongtien: finalTotal,
      trangthai: formData.trangthai,
      diachinhan: formData.diachinhan + " " + city,
      tennguoinhan: formData.tennguoinhan,
      sdtnguoinhan: formData.sdtnguoinhan,
      shippingFee: shipping, // Lưu thêm phí ship nếu cần
      discount: discountAmount // Lưu thêm tiền giảm giá nếu cần
    };

    // Gọi API
    const result = await postData(orderPayload);

    // Nếu có kết quả trả về (thành công)
    if (result) {
      // Chuyển hướng sang trang Success và truyền dữ liệu đơn hàng theo
      navigate("/order-success", {
        state: {
          orderData: orderPayload, // Dữ liệu mình vừa gửi đi
          result: result           // Dữ liệu server trả về (ví dụ iddonhang)
        }
      });
    }
  };

  // --- 6. Xử lý Tăng/Giảm số lượng ---
  const handleIncreaseQuantity = (productId) => {
    const productStock = data.find((item) => item.idsp === productId);
    const productInCart = cart.find((item) => item.idsp === productId);
    
    if (productInCart && productStock) {
      const newQuantity = productInCart.quantity + 1;
      if (newQuantity > productStock.soluong) {
        alert("Bạn không thể thêm quá số lượng tồn kho của sản phẩm");
        return;
      } else {
        updateQuantity(productId, newQuantity);
      }
    }
  };

  const handleDecreaseQuantity = (productId) => {
    const product = cart.find((item) => item.idsp === productId);
    if (product && product.quantity > 1) {
      const newQuantity = product.quantity - 1;
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div className="cart-page py-11">
      <div className="news-wrapper px-[15px] max-w-[1200px] mx-auto">
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">
            Tổng số lượng trong giỏ hàng: {solongsanpham}
          </h2>
          <h3 className="text-xl font-semibold mb-2">Chi tiết giỏ hàng:</h3>
          
          {cart.length > 0 ? (
            <>
              {/* Danh sách sản phẩm */}
              <ul className="grid grid-cols-1 gap-4">
                {cart.map((item) => (
                  <li
                    key={item.idsp}
                    className="flex items-center border p-4 rounded-md shadow-md"
                  >
                    <img
                      src={`http://localhost:3000/assets/${item.hinhanh}`}
                      alt={item.tensp}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-semibold">{item.tensp}</p>
                          <p className="text-gray-600 text-base">
                            {formatCurrencyVND(item.giaban.toString())}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => handleDecreaseQuantity(item.idsp)}
                              className="text-gray-500 border border-gray-300 px-2 py-1 rounded hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="text-base w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleIncreaseQuantity(item.idsp)}
                              className="text-gray-500 border border-gray-300 px-2 py-1 rounded hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.idsp)}
                          className="text-red-500 ml-4 hover:text-red-700 font-bold"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="inline-block border-[.5px] border-[#dbdbdb] w-full mt-5"></div>
            </>
          ) : (
            <p className="text-gray-500 italic">Giỏ hàng của bạn đang trống.</p>
          )}

          {/* Nút xác nhận để hiện Form */}
          {cart.length > 0 && !showForm && (
            <button
              onClick={handleConfirmCart}
              className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-600 transition"
            >
              Tiến hành thanh toán
            </button>
          )}

          {/* Form nhập thông tin */}
          {showForm && cart.length > 0 && (
            <form onSubmit={handleOrderSubmit} className="mt-6 border p-6 rounded-lg bg-gray-50">
              <h3 className="text-lg font-bold mb-4 border-b pb-2">Thông tin giao hàng</h3>
              
              {/* Input địa chỉ */}
              <div className="mb-4">
                <label htmlFor="diachinhan" className="block text-sm font-medium text-gray-700">
                  Địa chỉ cụ thể (Số nhà, đường, phường/xã)
                </label>
                <input
                  type="text"
                  id="diachinhan"
                  name="diachinhan"
                  value={formData.diachinhan}
                  onChange={handleInputChange}
                  required
                  placeholder="Ví dụ: 123 Đường Nguyễn Huệ..."
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Select Thành phố & Phí ship */}
              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Tỉnh / Thành phố
                </label>
                <select
                  name="city"
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    // Tìm shipping object dựa trên ID
                    const selectedShipping = shippings.find((s) => s.id === parseInt(selectedId));
                    
                    if (selectedShipping) {
                      setShipping(selectedShipping.price);
                      setCity(selectedShipping.city);
                    } else {
                        // Trường hợp chọn default
                        setShipping(0);
                        setCity("");
                    }
                    handleInputChange(e); // Cập nhật formData.city nếu cần
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  defaultValue=""
                >
                  <option value="" disabled>-- Chọn khu vực giao hàng --</option>
                  {shippings.map((ship) => (
                    <option key={ship.id} value={ship.id}>
                      {ship.city} - Phí: {formatCurrencyVND(ship.price.toString())}
                    </option>
                  ))}
                </select>
              </div>

              {/* Input Tên */}
              <div className="mb-4">
                <label htmlFor="tennguoinhan" className="block text-sm font-medium text-gray-700">
                  Tên người nhận
                </label>
                <input
                  type="text"
                  id="tennguoinhan"
                  name="tennguoinhan"
                  value={formData.tennguoinhan}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Input SĐT */}
              <div className="mb-4">
                <label htmlFor="sdtnguoinhan" className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="sdtnguoinhan"
                  name="sdtnguoinhan"
                  value={formData.sdtnguoinhan}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Input Voucher */}
              <div className="mb-4">
                <label htmlFor="voucher" className="block text-sm font-medium text-gray-700">
                  Mã khuyến mại
                </label>
                <div className="flex gap-2">
                    <input
                    type="text"
                    name="voucher"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Nhập mã voucher..."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                {discountAmount > 0 && (
                    <p className="text-green-600 text-sm mt-1">Đã áp dụng mã giảm giá!</p>
                )}
              </div>

              {/* Tổng kết tiền */}
              <div className="flex flex-col gap-2 py-4 border-t mt-4 bg-white p-4 rounded border">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <strong>{formatCurrencyVND(tongtien.toString())}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <strong>{formatCurrencyVND(shipping.toString())}</strong>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Khuyến mại:</span>
                  <strong>-{formatCurrencyVND(discountAmount.toString())}</strong>
                </div>
                <div className="flex justify-between text-[1.2rem] text-[#b22830] pt-2 border-t mt-2">
                  <span className="font-bold">Tổng thanh toán:</span>
                  <strong>
                    {formatCurrencyVND(
                      (parseFloat(tongtien) + parseFloat(shipping) - parseFloat(discountAmount)).toString()
                    )}
                  </strong>
                </div>
              </div>

              {/* Nút Submit */}
              <button
                type="submit"
                className="w-full bg-[#b22830] text-white font-bold px-4 py-3 mt-4 rounded-md hover:bg-red-700 focus:outline-none transition duration-200"
              >
                XÁC NHẬN ĐẶT HÀNG
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;