import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import { formatCurrencyVND } from "../../Components/Common/finance";
import Modal from "react-modal";
import Voucher from "../../Components/Voucher/Voucher";

const ListProduct = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [data, setData] = useState([]);
  const [types, setTypes] = useState([]);

  // --- STATE ---
  const [searchInput, setSearchInput] = useState(""); 
  const [selectedType, setSelectedType] = useState("All"); 
  const [sortBy, setSortBy] = useState("default"); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [modalLogin, setModalLogin] = useState(false);
  const token = localStorage.getItem("token");

  const [saveVouchers, setSaveVouchers] = useState([]);
  const [vouchers, setVouchers] = useState([]);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getProduct");
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const getVouchers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/vouchers");
        setVouchers(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchTypes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getType");
        setTypes(response.data);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    fetchData();
    getVouchers();
    fetchTypes();

    const saved = localStorage.getItem("saveVouchers");
    if (saved) {
      try {
        setSaveVouchers(JSON.parse(saved));
      } catch (e) {
        console.error("Lỗi parse JSON:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("saveVouchers", JSON.stringify(saveVouchers));
  }, [saveVouchers]);

  const saveVoucher = (voucher) => {
    setSaveVouchers((prev) => [...prev, voucher]);
  };

  // --- LOGIC LỌC & SẮP XẾP ---
  let filteredData = data.filter((item) => {
    const matchName = searchInput === "" || item.tensp.toLowerCase().includes(searchInput.toLowerCase());
    const matchType = selectedType === "All" || item.type_name === selectedType;
    return matchName && matchType;
  });

  if (sortBy === "rating_desc") {
    filteredData.sort((a, b) => (b.diem_danh_gia_tb || 0) - (a.diem_danh_gia_tb || 0));
  } else if (sortBy === "price_asc") {
    filteredData.sort((a, b) => Number(a.giaban) - Number(b.giaban));
  } else if (sortBy === "price_desc") {
    filteredData.sort((a, b) => Number(b.giaban) - Number(a.giaban));
  }

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1); 
  };

  const handleTypeSelect = (typeName) => {
    setSelectedType(typeName);
    setCurrentPage(1);
  };

  const onClickDetail = (product) => {
    navigate("/list-products/detail", { state: { product } });
  };

  const handleLoginRedirect = () => {
    navigate("/login");
    setModalLogin(false);
  };

  const onBuynow = (product) => {
    if (!token) {
      setModalLogin(true);
      return;
    }
    addToCart(product);
  };

  // --- PAGINATION ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="text-center py-10">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Lỗi: {error.message}</div>;

  return (
    <div className="list-product py-11 bg-gray-50 min-h-screen">
      <div className="news-wrapper px-[15px] max-w-[1200px] mx-auto">
        <div className="w-full">
          
          {/* --- VOUCHER --- */}
          <div className="mb-8">
            <h1 className="text-[30px] font-bold text-[#53382c] mb-4 uppercase border-b-2 border-[#b22830] inline-block pb-1">
              Khuyến mại
            </h1>
            <div className="overflow-x-auto pb-4">
              <div className="flex flex-nowrap gap-4">
                {vouchers.map((voucher) => (
                  <Voucher key={voucher.id} voucher={voucher} onSave={saveVoucher} isDisplay={true} />
                ))}
              </div>
            </div>
          </div>

          {/* --- HEADER SẢN PHẨM & CÔNG CỤ --- */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-[30px] font-bold text-[#53382c] uppercase leading-none">
                Thực đơn
              </h1>
              <p className="text-gray-500 text-sm mt-1">Khám phá hương vị tuyệt vời</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none w-full sm:w-48 py-2.5 px-4 pr-8 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#b22830] bg-white cursor-pointer shadow-sm hover:border-gray-400 transition-colors"
                >
                  <option value="default">Sắp xếp mặc định</option>
                  <option value="rating_desc">⭐ Đánh giá cao nhất</option>
                  <option value="price_asc">💰 Giá tăng dần</option>
                  <option value="price_desc">💎 Giá giảm dần</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleSearchChange}
                  placeholder="Tìm món..."
                  className="w-full py-2.5 pl-10 pr-4 outline-none border border-gray-300 rounded-lg focus:border-[#b22830] focus:ring-1 focus:ring-[#b22830] transition-all shadow-sm"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </span>
              </div>
            </div>
          </div>

          {/* --- BỘ LỌC (SỬA LẠI: KHÔNG ICON, CLEAN UI) --- */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => handleTypeSelect("All")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                ${selectedType === "All"
                  ? "bg-[#b22830] border-[#b22830] text-white shadow-md transform scale-105" // Active
                  : "bg-white border-gray-200 text-gray-600 hover:border-[#b22830] hover:text-[#b22830] hover:bg-red-50" // Inactive
                }`}
            >
              Tất cả
            </button>

            {types.map((type, index) => (
              <button
                key={index}
                onClick={() => handleTypeSelect(type.type_name)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                  ${selectedType === type.type_name
                    ? "bg-[#b22830] border-[#b22830] text-white shadow-md transform scale-105"
                    : "bg-white border-gray-200 text-gray-600 hover:border-[#b22830] hover:text-[#b22830] hover:bg-red-50"
                  }`}
              >
                {type.type_name}
              </button>
            ))}
          </div>

          {/* --- DANH SÁCH SẢN PHẨM --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {currentItems.length > 0 ? (
              currentItems.map((product, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative pt-[100%] overflow-hidden bg-gray-50">
                    <div onClick={() => onClickDetail(product)} className="cursor-pointer">
                      <img
                        src={`http://localhost:3000/assets/${product.hinhanh}`}
                        alt={product.tensp}
                        className="absolute top-0 left-0 w-full h-full object-contain p-4 transition duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* --- SỬA LẠI: RATING BADGE (GÓC PHẢI TRÊN) --- */}
                    {product.diem_danh_gia_tb > 0 && (
                      <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm flex items-center gap-1 border border-gray-100">
                        <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-bold text-gray-700">
                          {Number(product.diem_danh_gia_tb).toFixed(1)}
                        </span>
                      </div>
                    )}
                    {/* ----------------------------------------------- */}

                    {/* Badge Hết hàng */}
                    {product.soluong === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold uppercase tracking-wider rounded">Hết hàng</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="mb-2 flex-grow">
                      <h3 
                        className="font-bold text-gray-800 text-lg hover:text-[#b22830] transition-colors cursor-pointer line-clamp-2"
                        onClick={() => onClickDetail(product)}
                      >
                        {product.tensp}
                      </h3>
                      {/* Hiển thị số lượt đánh giá nhỏ bên dưới */}
                      <p className="text-xs text-gray-400 mt-1">
                        {product.so_luot_danh_gia > 0 ? `${product.so_luot_danh_gia} đánh giá` : 'Chưa có đánh giá'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-lg font-bold text-[#b22830]">
                        {formatCurrencyVND(product.giaban)}
                      </span>
                      
                      {product.soluong > 0 ? (
                        <button
                          onClick={() => onBuynow(product)}
                          className="bg-[#b22830] hover:bg-[#8f1e25] text-white p-2 rounded-full shadow-md transition-transform active:scale-95 group/btn"
                          title="Thêm vào giỏ"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Liên hệ</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-white rounded-lg border border-dashed border-gray-300">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
                <button onClick={() => {setSearchInput(""); setSelectedType("All"); setSortBy("default")}} className="mt-2 text-[#b22830] font-medium hover:underline">
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* --- PAGINATION --- */}
          {filteredData.length > itemsPerPage && (
            <div className="flex justify-center mt-12">
              <nav className="inline-flex shadow-sm rounded-md">
                {Array.from(
                  { length: Math.ceil(filteredData.length / itemsPerPage) },
                  (_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors
                        ${
                          currentPage === index + 1
                            ? "z-10 bg-[#b22830] border-[#b22830] text-white"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }
                        ${index === 0 ? "rounded-l-md" : ""}
                        ${index === Math.ceil(filteredData.length / itemsPerPage) - 1 ? "rounded-r-md" : ""}
                      `}
                    >
                      {index + 1}
                    </button>
                  )
                )}
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL LOGIN --- */}
      {modalLogin && (
        <Modal
          isOpen={modalLogin}
          onRequestClose={() => setModalLogin(false)}
          contentLabel="Login Required"
          className="modal-login outline-none"
          overlayClassName="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm"
        >
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full relative shadow-2xl animate-fadeIn">
            <button
              onClick={() => setModalLogin(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-4">
                <svg className="h-8 w-8 text-[#b22830]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Đăng nhập ngay</h3>
              <p className="text-sm text-gray-500 mb-6">
                Bạn cần đăng nhập tài khoản thành viên để thực hiện mua hàng.
              </p>
              <button
                onClick={handleLoginRedirect}
                className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-md px-4 py-3 bg-[#b22830] text-base font-bold text-white hover:bg-[#8f1e25] focus:outline-none transition-transform active:scale-95"
              >
                Đến trang Đăng nhập
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ListProduct;