import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SideBarAdmin() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [Name, setName] = useState(localStorage.getItem("Name") || null);
  
  return (
    <div className="bg-gray-800 text-white w-64 flex flex-col h-screen ">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Admin</h1>
      </div>
      <nav className="mt-4 flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              to="/admin"
              className="block py-2 px-4 hover:bg-gray-700 transition duration-200"
            >
              Trang chủ
            </Link>
          </li>
          <li>
            <Link
              to="/admin/Donhang"
              className="block py-2 px-4 hover:bg-gray-700 transition duration-200"
            >
              Đơn hàng
            </Link>
          </li>
          <li>
            <Link
              to="/admin/products"
              className="block py-2 px-4 hover:bg-gray-700 transition duration-200"
            >
              Sản phẩm
            </Link>
          </li>
          <li>
            <Link
              to="admin/News"
              className="block py-2 px-4 hover:bg-gray-700 transition duration-200"
            >
              Tin tức
            </Link>
          </li>
          <li>
            <Link
              to="/admin/typeFood"
              className="block py-2 px-4 hover:bg-gray-700 transition duration-200"
            >
              Loại đồ ăn
            </Link>
          </li>
          <li>
            <Link
              to="/admin/Managermentcustomers"
              className="block py-2 px-4 hover:bg-gray-700 transition duration-200"
            >
              Quản lý tài khoản
            </Link>
          </li>

          {/* --- MỚI THÊM: Link đến trang Reviews --- */}
          <li>
            <Link
              to="/admin/reviews"
              className="block py-2 px-4 hover:bg-gray-700 transition duration-200"
            >
              Đánh giá & Bình luận
            </Link>
          </li>
          {/* -------------------------------------- */}

          <li>
            <Link
              to="/admin/vouchers"
              className="block py-2 px-4 hover:bg-gray-700 transition duration-200"
            >
              Khuyến mại
            </Link>
          </li>

           <li>
            <Link
              to="/admin/shipping"
              className="block py-2 px-4 hover:bg-gray-700 transition duration-200"
            >
              Shipping
            </Link>
          </li>

          <li>
            <div>
              <button
                onClick={() => {
                  localStorage.clear();
                  setToken(null); 
                  navigate("adminLogin");
                }}
                className="block py-2 px-4 hover:bg-gray-700 transition duration-200 w-full text-left"
              >
                Logout
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}