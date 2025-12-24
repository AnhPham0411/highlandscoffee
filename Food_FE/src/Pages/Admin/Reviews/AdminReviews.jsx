import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  
  // --- States cho Tìm kiếm & Phân trang ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); 

  const fetchReviews = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3000/getAllReviewsAdmin");
      setReviews(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách đánh giá:", error);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // --- Xử lý Tìm kiếm ---
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi tìm
  };

  // Lọc dữ liệu theo tên user hoặc tên sản phẩm
  const filteredData = reviews.filter(
    (item) =>
      item.ten_user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tensp?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Xử lý Phân trang ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- Các hàm xử lý Logic ---
  const handleReply = async (id_danhgia) => {
    if (!replyText.trim()) return alert("Vui lòng nhập nội dung trả lời");
    try {
      await axios.post("http://localhost:3000/replyReview", {
        id_danhgia,
        phan_hoi: replyText,
      });
      alert("Đã trả lời thành công!");
      setReplyText("");
      setSelectedReviewId(null);
      fetchReviews();
    } catch (error) {
      console.error(error);
      alert("Lỗi khi trả lời");
    }
  };

  const toggleStatus = async (id_danhgia, currentStatus) => {
    try {
      await axios.post("http://localhost:3000/toggleReviewStatus", {
        id_danhgia,
        trang_thai: currentStatus === 1 ? 0 : 1,
      });
      fetchReviews();
    } catch (error) {
      console.error(error);
      alert("Lỗi cập nhật trạng thái");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  };

  return (
    <div className="overflow-x-auto ml-3 w-full border-[.25px] border-[#cccccc] p-3 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 uppercase border-b pb-2">Quản lý Đánh giá</h2>

      {/* --- THANH TÌM KIẾM --- */}
      <div className="mb-4 flex justify-between items-center bg-white p-3 rounded shadow-sm">
        <div className="flex items-center gap-2 w-full">
          <i className="fas fa-search text-gray-400"></i>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khách hoặc sản phẩm..."
            className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="text-sm text-gray-500 italic">
          Tổng số: <span className="font-bold text-blue-600">{filteredData.length}</span> đánh giá
        </div>
      </div>

      {/* --- BẢNG DỮ LIỆU --- */}
      <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Sản phẩm</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Khách hàng</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Đánh giá</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-1/4">Nội dung</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-1/4">Phản hồi</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentReviews.length > 0 ? (
              currentReviews.map((item) => (
                <tr key={item.id_danhgia} className="hover:bg-gray-50 transition-colors">
                  {/* Cột Sản phẩm */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 border border-gray-200 rounded-md overflow-hidden">
                        <img className="h-12 w-12 object-cover" src={`http://localhost:3000/assets/${item.hinh_sp}`} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 line-clamp-1 w-40" title={item.tensp}>{item.tensp}</div>
                        <div className="text-xs text-gray-500">ID: {item.idsp}</div>
                      </div>
                    </div>
                  </td>

                  {/* Cột Khách hàng */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.ten_user}</div>
                    <div className="text-xs text-gray-500">{formatDate(item.ngay_danh_gia)}</div>
                  </td>

                  {/* Cột Điểm sao */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-yellow-400">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < item.so_sao ? "fill-current" : "text-gray-300"}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 font-semibold ml-1">{item.so_sao}/5</span>
                  </td>

                  {/* Cột Nội dung */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded border border-dashed border-gray-300">
                      "{item.noi_dung}"
                    </p>
                  </td>

                  {/* Cột Phản hồi (Admin Reply) */}
                  <td className="px-6 py-4">
                    {item.phan_hoi ? (
                      <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-2 rounded relative">
                        <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-green-500 text-white text-[10px] px-1 rounded">Đã trả lời</span>
                        <p>{item.phan_hoi}</p>
                        <button 
                          onClick={() => {setSelectedReviewId(item.id_danhgia); setReplyText(item.phan_hoi);}}
                          className="text-[10px] text-green-600 underline mt-1 hover:text-green-800"
                        >
                          Sửa
                        </button>
                      </div>
                    ) : (
                      <div>
                        {selectedReviewId === item.id_danhgia ? (
                          <div className="flex flex-col gap-2 animate-fadeIn">
                            <textarea 
                              className="border border-blue-300 p-2 text-sm w-full rounded focus:ring-1 focus:ring-blue-500 outline-none" 
                              rows="3"
                              placeholder="Nhập nội dung trả lời..."
                              value={replyText} 
                              onChange={(e) => setReplyText(e.target.value)}
                              autoFocus
                            ></textarea>
                            <div className="flex gap-2">
                              <button onClick={() => handleReply(item.id_danhgia)} className="bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700 transition">Gửi</button>
                              <button onClick={() => {setSelectedReviewId(null); setReplyText("");}} className="bg-gray-300 text-gray-700 px-3 py-1 text-xs rounded hover:bg-gray-400 transition">Hủy</button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => {setSelectedReviewId(item.id_danhgia); setReplyText("");}} 
                            className="text-blue-600 border border-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-50 transition flex items-center gap-1"
                          >
                            <i className="fas fa-reply"></i> Trả lời
                          </button>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Cột Trạng thái */}
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => toggleStatus(item.id_danhgia, item.trang_thai)}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                        item.trang_thai === 1 ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`${
                        item.trang_thai === 1 ? 'translate-x-6' : 'translate-x-1'
                      } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                    </button>
                    <div className="text-[10px] mt-1 text-gray-500 font-semibold">
                      {item.trang_thai === 1 ? "Đang hiển thị" : "Đã ẩn"}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                  Không tìm thấy đánh giá nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- PHÂN TRANG --- */}
      {filteredData.length > itemsPerPage && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow-sm">
            {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 border text-sm font-medium ${
                  currentPage === i + 1
                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                } ${i === 0 ? "rounded-l-md" : ""} ${i === Math.ceil(filteredData.length / itemsPerPage) - 1 ? "rounded-r-md" : ""}`}
              >
                {i + 1}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;