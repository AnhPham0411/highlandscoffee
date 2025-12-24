import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import { formatCurrencyVND } from "../../Components/Common/finance";

const ProductDetail = () => {
  const [DetailProduct, setDetail] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  
  // State lưu user
  const [currentUser, setCurrentUser] = useState(null);

  const location = useLocation();
  const { addDetailToCart } = useCart();
  const { product } = location.state || {};

  // --- HÀM GIẢI MÃ TOKEN (JWT) ---
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  // --- 1. LẤY USER TỪ TOKEN & LOCALSTORAGE ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("Name");

    if (token) {
      // Giải mã token để lấy ID
      const decoded = parseJwt(token);
      
      if (decoded) {
        // Log ra xem trong token có chứa key nào là id không (thường là id, userId, hoặc idnguoidung)
        console.log("Decoded Token:", decoded);

        // Giả sử backend lưu ID với key là 'idnguoidung', 'id', hoặc 'userId'
        // Bạn hãy mở Console web lên xem nó in ra cái gì để sửa 'decoded.id' cho đúng nhé
        const userId = decoded.idnguoidung || decoded.id || decoded.userId || decoded.data?.idnguoidung;

        if (userId) {
          setCurrentUser({
            idnguoidung: userId,
            ten: name || decoded.ten || "User"
          });
        }
      }
    }
  }, []);

  // --- 2. LẤY DATA SẢN PHẨM ---
  useEffect(() => {
    if (!product) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getDetailProduct?idsp=${product.idsp}`
        );
        setDetail(response.data[0]);
        fetchReviews();
      } catch (err) {
        setError(err);
      }
    };
    fetchData();
  }, [product]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/getReviews?idsp=${product.idsp}`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- 3. GỬI ĐÁNH GIÁ ---
  const handleSubmitReview = async () => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để đánh giá!");
      return;
    }
    if (!userComment.trim()) {
      alert("Vui lòng nhập nội dung đánh giá");
      return;
    }
    
    // Kiểm tra ID lần cuối
    if (!currentUser.idnguoidung) {
      alert("Lỗi: Không tìm thấy ID trong token. Vui lòng liên hệ Admin.");
      console.log("Current User Error:", currentUser);
      return;
    }

    try {
      await axios.post("http://localhost:3000/addReview", {
        idnguoidung: currentUser.idnguoidung,
        idsp: product.idsp,
        so_sao: userRating,
        noi_dung: userComment
      });

      alert("Cảm ơn bạn đã đánh giá!");
      setUserComment("");
      setUserRating(5);
      fetchReviews();
      
      const response = await axios.get(`http://localhost:3000/getDetailProduct?idsp=${product.idsp}`);
      setDetail(response.data[0]);

    } catch (error) {
      console.error(error);
      alert("Lỗi khi gửi đánh giá");
    }
  };

  const increment = () => {
    if (DetailProduct && quantity < DetailProduct.soluong)
      setQuantity((prev) => prev + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        fill={index < rating ? "#f59e0b" : "none"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        className={`w-4 h-4 ${index < rating ? "text-yellow-500" : "text-gray-300"}`}
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  if (!product || !DetailProduct) return <div>Loading...</div>;

  const newdata = { ...product, ...DetailProduct };

  return (
    <div className="list-product py-11">
      <div className="news-wrapper px-[15px] max-w-[1200px] mx-auto">
        <div className="w-full">
          <div className="nav-link py-3 text-blue-400 text-sm flex gap-1">
            <NavLink to="/list-products">Thực đơn</NavLink>
            <p className="text-black">\ {newdata.tensp}</p>
          </div>

          <section className="text-gray-700 body-font overflow-hidden bg-white">
            <div className="container py-5 mx-auto">
              <div className="mx-auto flex flex-wrap">
                <img
                  alt="ecommerce"
                  className="lg:w-1/2 w-full object-cover object-center rounded border border-gray-200"
                  src={`http://localhost:3000/assets/${newdata.hinhanh}`}
                />

                <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                  <h2 className="text-sm title-font text-gray-500 tracking-widest">
                    {newdata.thuonghieu}
                  </h2>
                  <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                    {newdata.tensp}
                  </h1>

                  <div className="flex mb-4 items-center">
                    <div className="flex items-center">
                      {renderStars(Math.round(newdata.diem_danh_gia_tb || 5))}
                      <span className="text-gray-600 ml-3">
                        {newdata.diem_danh_gia_tb || 0}/5 ({newdata.so_luot_danh_gia || 0} đánh giá)
                      </span>
                    </div>
                  </div>

                  <p className="leading-relaxed mb-4">{DetailProduct?.motasanpham}</p>

                  <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
                    <div className="flex items-center">
                      <span className="mr-3">Số lượng</span>
                      <div className="quantity-control flex items-center border border-gray-300 rounded">
                        <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200" onClick={decrement}>-</button>
                        <span className="px-4 py-1">{quantity}</span>
                        <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200" onClick={increment}>+</button>
                      </div>
                      <span className="ml-4 text-sm text-gray-500">
                        {newdata.soluong} sản phẩm có sẵn
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="title-font font-medium text-2xl text-gray-900">
                      {formatCurrencyVND(newdata.giaban)}
                    </span>
                    {newdata.soluong === 0 ? (
                      <p className="text-red-500 font-bold">Tạm thời hết hàng</p>
                    ) : (
                      <button
                        onClick={() => addDetailToCart(product, quantity)}
                        className="flex ml-auto text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded"
                      >
                        Thêm vào giỏ
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* --- PHẦN BÌNH LUẬN --- */}
            <div className="container mx-auto mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá sản phẩm</h2>

              {/* Form gửi đánh giá */}
              {currentUser ? (
                <div className="bg-gray-50 p-6 rounded-lg mb-8 shadow-sm">
                  <h3 className="text-lg font-bold mb-3 text-gray-800">
                    Viết đánh giá (Chào {currentUser.ten})
                  </h3>
                  <div className="flex items-center mb-4">
                    <span className="mr-3 text-gray-700">Chất lượng:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        onClick={() => setUserRating(star)}
                        className={`w-8 h-8 cursor-pointer transition-colors ${
                          star <= userRating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Chia sẻ cảm nhận..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                  ></textarea>

                  <button
                    onClick={handleSubmitReview}
                    className="bg-[#b22830] text-white px-6 py-2 rounded hover:bg-[#901f26] transition duration-200 font-bold"
                  >
                    Gửi đánh giá
                  </button>
                </div>
              ) : (
                <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                  Vui lòng <NavLink to="/login" className="underline font-bold text-[#b22830]">đăng nhập</NavLink> để viết đánh giá.
                </div>
              )}

              {/* Danh sách reviews */}
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 italic">Chưa có đánh giá nào.</p>
                ) : (
                  reviews.map((item) => (
                    <div key={item.id_danhgia} className="border-b border-gray-100 pb-6">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold mr-4 flex-shrink-0">
                          {item.ten ? item.ten.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-bold text-gray-900">{item.ten}</h4>
                            <span className="text-gray-400 text-xs">
                              {new Date(item.ngay_danh_gia).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                          <div className="flex items-center mb-2">
                            {renderStars(item.so_sao)}
                          </div>
                          <p className="text-gray-700">{item.noi_dung}</p>
                          {item.phan_hoi && (
                            <div className="mt-3 bg-gray-50 p-4 rounded-lg border-l-4 border-[#b22830]">
                              <span className="text-xs font-bold text-[#b22830] uppercase bg-[#b22830] bg-opacity-10 px-2 py-0.5 rounded">
                                Phản hồi của Shop
                              </span>
                              <p className="text-gray-600 text-sm mt-1">{item.phan_hoi}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;