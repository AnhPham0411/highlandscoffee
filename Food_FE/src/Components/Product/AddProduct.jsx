import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AddProduct({ close }) {
  const [product, setProduct] = useState({
    tensp: "",
    soluong: "",
    idType: "", 
    giaban: "",
    motasanpham: "",
    thuonghieu: "",
    hinhanh: null,
  });

  const [Type, setType] = useState([]); // luôn là mảng

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ép kiểu số cho các field số
    if (name === "idType" || name === "soluong" || name === "giaban") {
      setProduct({ ...product, [name]: Number(value) });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setProduct({ ...product, hinhanh: e.target.files[0] });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getType");
      setType(response.data);

      // set mặc định idType đầu tiên (tránh rỗng)
      if (response.data.length > 0) {
        setProduct((prev) => ({
          ...prev,
          idType: response.data[0].idType,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.idType) {
      alert("Vui lòng chọn loại sản phẩm");
      return;
    }

    const formData = new FormData();
    formData.append("tensp", product.tensp);
    formData.append("soluong", product.soluong);
    formData.append("idType", product.idType);
    formData.append("giaban", product.giaban);
    formData.append("motasanpham", product.motasanpham);
    formData.append("thuonghieu", product.thuonghieu);
    formData.append("hinhanh", product.hinhanh);

    try {
      await axios.post("http://localhost:3000/Product", formData);
      alert("Product added successfully");
      close();
    } catch (error) {
      console.log("Error adding product", error);
      alert("Thêm sản phẩm thất bại");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-md shadow-md w-full md:w-4/5 lg:w-3/4 xl:w-2/3">
        <h2 className="text-lg font-medium mb-4">Thêm Sản phẩm mới</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="tensp"
            placeholder="Tên sản phẩm"
            value={product.tensp}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <input
            type="number"
            name="soluong"
            placeholder="Số lượng"
            value={product.soluong}
            onChange={handleChange}
className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <select
            name="idType"
            value={product.idType}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {Type.map((item) => (
              <option key={item.idType} value={item.idType}>
                {item.type_name} {item.idType}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="giaban"
            placeholder="Giá bán"
            value={product.giaban}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <textarea
            name="motasanpham"
            placeholder="Mô tả sản phẩm"
            value={product.motasanpham}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <input
            type="text"
            name="thuonghieu"
            placeholder="Thương hiệu"
            value={product.thuonghieu}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <input
            type="file"
            name="hinhanh"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Thêm sản phẩm
          </button>

          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={close}
          >
            Huỷ
          </button>
        </form>
      </div>
    </div>
  );
}
