import axios from "axios";
import React, { useEffect, useState } from "react";
import AddProduct from "../../Components/Product/AddProduct";
import UpdateProduct from "../../Components/Product/UpdateProduct";
import { useNavigate } from "react-router-dom";
// 1. Import thư viện xlsx
import * as XLSX from "xlsx"; 

export default function AdminProducts() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  const navigate = useNavigate();
  const roleuser = localStorage.getItem("role");
  useEffect(() => {
    if (roleuser === "Customer") {
      navigate("/");
    }
  }, [navigate, roleuser]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/getProductinadmin"
      );
      setData(response.data.products);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const filteredData = data.filter(
    (product) =>
      product.tensp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const closeUpdate = () => {
    setIsOpenUpdate(false);
  };

  const closeCreate = () => {
    setIsOpenAdd(false);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredData.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const updateProduct = (product) => {
    setSelectedProduct(product);
    setIsOpenUpdate(true);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const deleteProduct = async (idsp) => {
    try {
      await axios.delete(`http://localhost:3000/Product/${idsp}`);
      alert("Product deleted successfully");
      fetchData();
    } catch (error) {
      alert("Error deleting product");
    }
  };

  // --- 2. Hàm xử lý xuất Excel ---
  const exportToExcel = () => {
    // Tạo một bản sao dữ liệu và format lại các tiêu đề cột cho đẹp (Tiếng Việt)
    const dataToExport = filteredData.map((item) => ({
        "ID": item.idsp,
        "Tên sản phẩm": item.tensp,
        "Hình ảnh": item.hinhanh, // Chỉ xuất tên file ảnh
        "Giá bán": item.giaban,
        "Số lượng": item.soluong,
        "Loại sản phẩm": item.type_name,
        "Thương hiệu": item.thuonghieu,
        "Mô tả": item.motasanpham
    }));

    // Tạo worksheet từ dữ liệu JSON
    const ws = XLSX.utils.json_to_sheet(dataToExport);

    // Tạo workbook mới
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách sản phẩm");

    // Xuất file
    XLSX.writeFile(wb, "Danh_sach_san_pham.xlsx");
  };

  return (
    <div className="overflow-x-auto ml-3 w-full border-[.25px] border-[#cccccc] p-3">
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="border border-gray-300 rounded-md px-3 py-2 w-80 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearch}
        />
        
        {/* Nhóm các nút hành động */}
        <div className="flex gap-2">
            {/* 3. Nút Xuất Excel */}
            <button
            onClick={exportToExcel}
            className="py-2.5 px-4 bg-blue-500 rounded-md hover:bg-blue-600 text-white flex items-center gap-2"
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Xuất Excel
            </button>

            <button
            onClick={() => setIsOpenAdd(true)}
            className="py-2.5 px-4 bg-green-500 rounded-md hover:bg-green-600 text-white"
            >
            Thêm mới
            </button>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-300 rounded-md">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Hình ảnh
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Tên sản phẩm
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Giá bán
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Số lượng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Loại sản phẩm
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Thương hiệu
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Mô tả sản phẩm
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentProducts.map((product) => (
            <tr key={product.idsp}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.idsp}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <img
                  src={`http://localhost:3000/assets/${product.hinhanh}`}
                  alt={product.tensp}
                  className="h-10 w-10 object-cover rounded-full"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.tensp}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.giaban}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.soluong}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.type_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.thuonghieu}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.motasanpham}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <button
                  onClick={() => updateProduct(product)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                >
                  Sửa
                </button>
                <button
                  className="text-red-600 hover:text-red-900 ml-2"
                  onClick={() => deleteProduct(product.idsp)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {Array.from(
          { length: Math.ceil(filteredData.length / productsPerPage) },
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
      {isOpenAdd && <AddProduct close={() => closeCreate()} />}
      {isOpenUpdate && (
        <UpdateProduct
          product={selectedProduct}
          onClose={() => closeUpdate()}
          onUpdate={() => {
            setSelectedProduct(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}