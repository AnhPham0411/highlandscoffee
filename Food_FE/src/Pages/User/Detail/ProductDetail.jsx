import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useCart } from "../../Context/CartContext";

import { formatCurrencyVND } from "../../Components/finance";
const ProductDetail = () => {
  const [DetailProduct, setDetail] = useState();
  const [Error, setError] = useState();
  const [quantity, setQuantity] = useState(1);
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const { addDetailToCart } = useCart();

  const { product } = location.state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getDetailProduct?idsp=${product.idsp}`
        );
        setDetail(response.data[0]);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();

    return () => {};
  }, []);
  const newdata = { ...product, ...DetailProduct };

  const increment = () => {
    if (quantity < newdata.soluong)
      setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const addToCart = (product, quantity) => {
    addDetailToCart(product, quantity);
  };
  return (
    <div className="list-product py-11">
      <div className="news-wrapper px-[15px] max-w-[1200px] mx-auto">
        <div className="w-full">
          <div className="mid-title mb-5 w-auto relative">
            <h1 className="text-[45px] leading-[55px] font-bold text-left text-[#53382c]">
              SẢN PHẨM CHI TIẾT
            </h1>
          </div>
          <section className="text-gray-700 body-font overflow-hidden bg-white">
            <div className="nav-link py-3 text-blue-400 text-sm flex gap-1">
              <NavLink to="/list-products">{""}List product</NavLink>
              <p className="text-black">\ {newdata.tensp}</p>
            </div>
            <div className="container py-5 py-24 mx-auto">
              <div className=" mx-auto flex flex-wrap">
                <img
                  alt="ecommerce"
                  className="lg:w-1/2 w-full object-cover object-center rounded border border-gray-200"
                  src={`http://localhost:3000/assets/${newdata.hinhanh}`}
                />
                <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                  <h2 className="text-sm title-font text-gray-500 tracking-widest">
                    {newdata.thuonghieu}
                  </h2>

                  <div className="flex mb-4">
                    <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                      {newdata.tensp}
                    </h1>
                    <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200">
                      <a className="text-gray-500">
                        <svg
                          fill="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                        </svg>
                      </a>
                      <a className="ml-2 text-gray-500">
                        <svg
                          fill="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                      </a>
                      <a className="ml-2 text-gray-500">
                        <svg
                          fill="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                        </svg>
                      </a>
                    </span>
                  </div>
                  <p className="leading-relaxed">
                    {DetailProduct.motasanpham}
                  
                  </p>
                  <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
                    <div className="flex ml-6 items-center">
                      <span className="mr-3">Số lượng</span>
                      <div className="relative px-4">
                        <div className="quantity-control flex items-center">
                          <button
                            className="quantity-button rounded-l-md bg-gray-200 hover:bg-gray-300 px-3 py-1"
                            onClick={decrement}
                          >
                            -
                          </button>
                          <span className="quantity-value px-3">
                            {quantity}
                          </span>
                          <button
                            className="quantity-button rounded-r-md bg-gray-200 hover:bg-gray-300 px-3 py-1"
                            onClick={increment}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <span className="">
                        {newdata.soluong} sản phẩm có sẵn
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="title-font font-medium text-2xl text-gray-900">
                      {formatCurrencyVND(newdata.giaban)}
                    </span>
                    <div className="flex gap-2">
                      {newdata.soluong === 0 ? (
                        <p>Tạm thời hết hàng</p>
                      ) : (
                        <button
                          onClick={() => addToCart(product, quantity)}
                          className="flex ml-auto text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-400 rounded"
                        >
                          Thêm vào giỏ
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
