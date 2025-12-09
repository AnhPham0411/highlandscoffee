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
  const [searchInput, setSearchInput] = useState();
  const [filterTitle, setFilterTitle] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("tensp");
  const [SelectType, setSelectType] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [modalLogin, setModalLogin] = useState(false);
  const token = localStorage.getItem("token");

  const [saveVouchers, setSaveVouchers] = useState([])


  const [vouchers, setVouchers] = useState([])

  //lay du lieu sản phẩm trong product
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
    getVouchers()

    const saved = localStorage.getItem('saveVouchers');
    if (saved) {
        try {
          setSaveVouchers(JSON.parse(saved));
        } catch (e) {
          console.error('Lỗi parse JSON từ localStorage:', e);
        }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('saveVouchers', JSON.stringify(saveVouchers));
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
      setSaveVouchers(prev => [...prev, voucher]);
  };

  const filteredData = data.filter((item) =>
    searchCriteria === "tensp"
      ? item.tensp.toLowerCase().includes(filterTitle.toLowerCase())
      : item.type_name.toLowerCase().includes(SelectType.toLowerCase())
  );

  const handleSearch = () => {
    setFilterTitle(searchInput);
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
    }
    addToCart(product);
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSelectChange = (e) => {
    setSelectType(e.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  //pagnigation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="list-product py-11">
      <div className="news-wrapper px-[15px] max-w-[1200px] mx-auto">
        <div className="w-full">
          <div className="box w-full">
            <div className="mid-title mb-5 w-auto relative flex items-center justify-between">
              <h1 className="text-[45px] leading-[55px] font-bold text-left text-[#53382c]">
                VOUCHER
              </h1>
            </div>
            <div class="overflow-x-auto p-4">
              <div class="flex flex-nowrap gap-2">
                 {
                  vouchers.map(voucher => <Voucher key={voucher.id} voucher={voucher} onSave={saveVoucher} isDisplay={true} />)
                 }
              </div>
            </div>

            <div className="mid-title mb-5 w-auto relative flex items-center justify-between">
              <h1 className="text-[45px] leading-[55px] font-bold text-left text-[#53382c]">
                SẢN PHẨM
              </h1>
              <div classname="flex items-center gap-2">
                <div className="flex space-x-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="tensp"
                      checked={searchCriteria === "tensp"}
                      onChange={(e) => setSearchCriteria(e.target.value)}
                      className="mr-2"
                    />
                    Theo tên
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="type_name"
                      checked={searchCriteria === "type_name"}
                      onChange={(e) => setSearchCriteria(e.target.value)}
                      className="mr-2"
                    />
                    Theo loại
                  </label>
                </div>
                <div className="flex items-center ">
                  {searchCriteria === "tensp" ? (
                    <>
                      <input
                        type="text"
                        value={searchInput}
                        onChange={handleInputChange}
                        name="searchItem"
                        id="searchItem"
                        className="py-2 pl-3 pr-8 outline-none border border-[#cccccc] rounded-l-[10px]"
                      />
                      <span
                        className="flex items-center justify-center p-2.5 border border-[#cccccc] rounded-r-[10px]"
                        onClick={handleSearch}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="20"
                          height="20"
                          viewBox="0 0 50 50"
                        >
                          <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
                        </svg>
                      </span>
                    </>
                  ) : (
                    <>
                      <select
                        value={SelectType}
                        onChange={handleSelectChange}
                        classname=""
                        style={{
                          padding: "8px",
                          paddingBottom: "0.5rem",
                          paddingLeft: "1rem",
                          paddingRight: "150.5px",
                          outline: "none",
                          border: "1px solid #cccccc",
                          borderRadius: "10px",
                        }}
                      >
                        {types.map((type) => (
                          <option value={type.type_name}>
                            {type.type_name}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="nav-link py-3 text-blue-400 text-sm flex gap-1">
              <NavLink to="/">Home</NavLink>
              <p className="text-black">\ List product</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {currentItems.map((product, index) => (
                <div
                  key={index}
                  className="product-item border rounded shadow-sm"
                >
                  <div className="img-news pt-[66.666666%] relative overflow-hidden mb-2.5">
                    <div
                      onClick={() => onClickDetail(product)}
                      className="transition cursor-pointer"
                    >
                      <img
                        src={`http://localhost:3000/assets/${product.hinhanh}`}
                        alt={product.tensp}
                        className="absolute top-0 left-0 w-full h-full object-cover transition"
                      />
                    </div>
                  </div>
                  <div className="tent mb-[5px] px-3">
                    <h3 className="font-bold">
                      <a
                        href=" "
                        className="block text-sm h-44px overflow-hidden"
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
                      <p>Tạm thời hết hàng</p>
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
              ))}
            </div>
            <div className="flex justify-center mt-4">
              {Array.from(
                { length: Math.ceil(filteredData.length / itemsPerPage) },
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`mx-1 px-4 py-2 rounded-md focus:outline-none ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
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
      {modalLogin && (
        <Modal
          isOpen={modalLogin}
          onRequestClose={() => setModalLogin(false)}
          contentLabel="Login Required Modal"
          className="modal-login"
          overlayClassName="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
        >
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <button
              onClick={() => setModalLogin(false)}
              className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-800"
            >
              X
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Bạn cần đăng nhập trước khi mua hàng
            </h2>
            <button
              onClick={handleLoginRedirect}
              className="bg-blue-500 text-white px-4 py-2 rounded-md block mx-auto"
            >
              Đăng nhập
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ListProduct;
