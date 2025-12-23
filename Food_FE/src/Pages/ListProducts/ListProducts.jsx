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

  // --- STATE MỚI ---
  const [searchInput, setSearchInput] = useState(""); // Chỉ dùng 1 state cho search
  const [selectedType, setSelectedType] = useState("All"); // Lưu loại đang chọn
  // ----------------

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [modalLogin, setModalLogin] = useState(false);
  const token = localStorage.getItem("token");

  const [saveVouchers, setSaveVouchers] = useState([]);
  const [vouchers, setVouchers] = useState([]);

  // Call API
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

    fetchData();
    getVouchers();

    const saved = localStorage.getItem("saveVouchers");
    if (saved) {
      try {
        setSaveVouchers(JSON.parse(saved));
      } catch (e) {
        console.error("Lỗi parse JSON từ localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("saveVouchers", JSON.stringify(saveVouchers));
  }, [saveVouchers]);

  useEffect(() => {
    const fetchDataType = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getType");
        setTypes(response.data);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };
    fetchDataType();
  }, []);

  const saveVoucher = (voucher) => {
    setSaveVouchers((prev) => [...prev, voucher]);
  };

  // --- LOGIC LỌC MỚI (Kết hợp Search tên + Chọn Loại) ---
  const filteredData = data.filter((item) => {
    // 1. Lọc theo tên (nếu có nhập)
    const matchName =
      searchInput === "" ||
      item.tensp.toLowerCase().includes(searchInput.toLowerCase());

    // 2. Lọc theo loại (nếu không phải All thì check tên loại)
    const matchType =
      selectedType === "All" || item.type_name === selectedType;

    return matchName && matchType;
  });
  // -----------------------------------------------------

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi search
  };

  const handleTypeSelect = (typeName) => {
    setSelectedType(typeName);
    setCurrentPage(1); // Reset về trang 1 khi đổi loại
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="list-product py-11">
      <div className="news-wrapper px-[15px] max-w-[1200px] mx-auto">
        <div className="w-full">
          <div className="box w-full">
            {/* --- PHẦN VOUCHER (Giữ nguyên) --- */}
            <div className="mid-title mb-5 w-auto relative flex items-center justify-between">
              <h1 className="text-[45px] leading-[55px] font-bold text-left text-[#53382c]">
                VOUCHER
              </h1>
            </div>
            <div className="overflow-x-auto p-4">
              <div className="flex flex-nowrap gap-2">
                {vouchers.map((voucher) => (
                  <Voucher
                    key={voucher.id}
                    voucher={voucher}
                    onSave={saveVoucher}
                    isDisplay={true}
                  />
                ))}
              </div>
            </div>

            {/* --- PHẦN HEADER SẢN PHẨM & SEARCH --- */}
            <div className="mid-title mb-4 w-auto relative flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-[45px] leading-[55px] font-bold text-left text-[#53382c]">
                SẢN PHẨM
              </h1>

              {/* Ô Search Tên */}
              <div className="relative w-full md:w-auto">
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleSearchChange}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="py-2 pl-4 pr-10 outline-none border border-[#cccccc] rounded-full w-full md:w-[300px] focus:border-[#b22830] transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 50 50"
                    fill="currentColor"
                  >
                    <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
                  </svg>
                </span>
              </div>
            </div>

            {/* --- PHẦN FILTER CATEGORY (CÁC Ô CHỌN) --- */}
            <div className="flex flex-wrap gap-3 mb-8">
              {/* Nút Tất cả */}
              <button
                onClick={() => handleTypeSelect("All")}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all duration-200
                  ${
                    selectedType === "All"
                      ? "bg-[#b22830] border-[#b22830] text-white shadow-md opacity-90" // Active: Màu đỏ, chữ trắng, hơi mờ (opacity)
                      : "bg-white border-gray-300 text-gray-600 hover:border-[#b22830] hover:text-[#b22830]" // Inactive
                  }
                `}
              >
                {/* Dấu tích V chỉ hiện khi active */}
                {selectedType === "All" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                Tất cả
              </button>

              {/* Map các loại sản phẩm */}
              {types.map((type, index) => (
                <button
                  key={index}
                  onClick={() => handleTypeSelect(type.type_name)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all duration-200
                    ${
                      selectedType === type.type_name
                        ? "bg-[#b22830] border-[#b22830] text-white shadow-md opacity-90"
                        : "bg-white border-gray-300 text-gray-600 hover:border-[#b22830] hover:text-[#b22830]"
                    }
                  `}
                >
                  {/* Dấu tích V */}
                  {selectedType === type.type_name && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  {type.type_name}
                </button>
              ))}
            </div>

            {/* --- BREADCRUMB --- */}
            <div className="nav-link py-3 text-blue-400 text-sm flex gap-1">
              <NavLink to="/">Home</NavLink>
              <p className="text-black">\ List product</p>
            </div>

            {/* --- DANH SÁCH SẢN PHẨM (Giữ nguyên) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {currentItems.length > 0 ? (
                currentItems.map((product, index) => (
                  <div
                    key={index}
                    className="product-item border rounded shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="img-news pt-[66.666666%] relative overflow-hidden mb-2.5 group">
                      <div
                        onClick={() => onClickDetail(product)}
                        className="transition cursor-pointer"
                      >
                        <img
                          src={`http://localhost:3000/assets/${product.hinhanh}`}
                          alt={product.tensp}
                          className="absolute top-0 left-0 w-full h-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <div className="tent mb-[5px] px-3">
                      <h3 className="font-bold">
                        <a
                          href=" "
                          className="block text-sm h-10 overflow-hidden text-[#333] hover:text-[#b22830]"
                        >
                          {product.tensp}
                        </a>
                      </h3>
                    </div>
                    <div className="price text-base text-[#b22830] px-3 font-bold mb-2">
                      <span>{formatCurrencyVND(product.giaban)}</span>
                    </div>
                    <div className="action flex items-center gap-2 px-3 w-full pb-4">
                      {product.soluong === 0 ? (
                        <p className="text-gray-500 text-sm italic">
                          Tạm thời hết hàng
                        </p>
                      ) : (
                        <>
                          <button
                            onClick={() => onClickDetail(product)}
                            className="whitespace-nowrap flex-1 hover:text-white hover:border-[#b22830] hover:bg-[#b22830] inline-block text-[12px] leading-5 border-[1px] border-solid border-[#cc9554] py-2 px-3 rounded-[5px] text-[#cc9554] uppercase transition"
                          >
                            Chi tiết
                          </button>
                          <button
                            onClick={() => onBuynow(product)}
                            className="whitespace-nowrap flex-1 hover:text-white hover:border-[#b22830] hover:bg-[#b22830] inline-block text-[12px] leading-5 border-[1px] border-solid border-[#cc9554] py-2 px-3 rounded-[5px] text-[#cc9554] uppercase transition"
                          >
                            Mua ngay
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  Không tìm thấy sản phẩm nào.
                </div>
              )}
            </div>

            {/* --- PAGINATION (Giữ nguyên) --- */}
            <div className="flex justify-center mt-8">
              {Array.from(
                { length: Math.ceil(filteredData.length / itemsPerPage) },
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`mx-1 px-4 py-2 rounded-md focus:outline-none transition-colors ${
                      currentPage === index + 1
                        ? "bg-[#b22830] text-white border border-[#b22830]"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL LOGIN (Giữ nguyên) --- */}
      {modalLogin && (
        <Modal
          isOpen={modalLogin}
          onRequestClose={() => setModalLogin(false)}
          contentLabel="Login Required Modal"
          className="modal-login"
          overlayClassName="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
        >
          <div className="bg-white p-8 rounded-lg max-w-md w-full relative shadow-xl">
            <button
              onClick={() => setModalLogin(false)}
              className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-800 font-bold text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-6 text-center text-[#53382c]">
              Bạn cần đăng nhập trước khi mua hàng
            </h2>
            <button
              onClick={handleLoginRedirect}
              className="bg-[#b22830] hover:bg-[#8f1e25] text-white px-6 py-2 rounded-md block mx-auto transition"
            >
              Đăng nhập ngay
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ListProduct;