import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatCurrencyVND } from "../../../Components/Common/finance";

export default function OrdersManagement() {
  const [currentStatus, setCurrentStatus] = useState("Chờ xác nhận");
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // --- 1. XÓA STATE totalSuccessAmount VÌ KHÔNG DÙNG NỮA ---

  // Các state thống kê số lượng
  const [pendingCount, setPendingCount] = useState(0);
  const [processingCount, setProcessingCount] = useState(0);
  const [shippingCount, setShippingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [canceledCount, setCanceledCount] = useState(0);

  const roleuser = localStorage.getItem("role");

  useEffect(() => {
    if (roleuser === "Customer") {
      navigate("/");
    }
  }, [navigate, roleuser]);

  // --- 2. XÓA HÀM calculateTotalSuccessAmount ---

  const calculateOrderCounts = useCallback((ordersData) => {
    setPendingCount(ordersData.filter((order) => order.trangthai === "Chờ xác nhận").length);
    setProcessingCount(ordersData.filter((order) => order.trangthai === "Đang xử lý").length);
    setShippingCount(ordersData.filter((order) => order.trangthai === "Đang giao").length);
    setCompletedCount(ordersData.filter((order) => order.trangthai === "Đã giao").length);
    setCanceledCount(ordersData.filter((order) => order.trangthai === "Đã hủy").length);
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/getOrderAdmin");
      setOrders(response.data);
      // calculateTotalSuccessAmount(response.data); // Xóa dòng này
      calculateOrderCounts(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [calculateOrderCounts]); // Bỏ dependency calculateTotalSuccessAmount

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // --- XỬ LÝ UI ---
  const handleStatusClick = (status) => {
    setCurrentStatus(status);
  };

  const handleShowDetails = (orderId) => {
    setOrders(
      orders.map((order) => ({
        ...order,
        showDetails:
          order.iddonhang === orderId ? !order.showDetails : order.showDetails,
      }))
    );
  };

  const handlePrintInvoice = (order) => {
    let itemsHtml = "";
    order.details.forEach((item) => {
      const price = parseFloat(item.price || 0);
      const quantity = parseInt(item.Quantity || 0);
      const thanhTien = price * quantity;

      itemsHtml += `
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.tensanpham}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${quantity}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${price.toLocaleString("vi-VN")}đ</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${thanhTien.toLocaleString("vi-VN")}đ</td>
        </tr>
      `;
    });

    const htmlContent = `
      <html>
        <head>
          <title>Hóa đơn #${order.iddonhang}</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { font-size: 13px; }
            .header { background-color: #b22830; padding: 15px; text-align: center; color: white; }
            .total-row td { font-weight: bold; color: #b22830; font-size: 15px; }
          </style>
        </head>
        <body>
            <div style="max-width: 800px; margin: auto; border: 1px solid #e0e0e0; padding: 20px;">
                <div class="header"><h2>HÓA ĐƠN BÁN HÀNG</h2></div>
                <div style="padding: 20px;">
                    <p>Khách hàng: <strong>${order.tennguoinhan}</strong></p>
                    <p>SĐT: ${order.sdtnguoinhan} - Đ/c: ${order.diachinhan}</p>
                    <table style="margin-top: 15px;">
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Sản phẩm</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">SL</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Đơn giá</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Thành tiền</th>
                        </tr>
                        ${itemsHtml}
                        <tr class="total-row">
                            <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;">Tổng cộng:</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">
                              ${parseFloat(order.tongtien).toLocaleString("vi-VN")}đ
                            </td>
                        </tr>
                    </table>
                    <div style="margin-top: 30px; text-align: center; font-style: italic;">Cảm ơn quý khách!</div>
                </div>
            </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/order/${id}`, {
        trangthai: newStatus,
      });
      const updatedOrders = orders.map((order) =>
        order.iddonhang === id ? { ...order, trangthai: newStatus } : order
      );
      setOrders(updatedOrders);
      // calculateTotalSuccessAmount(updatedOrders); // Xóa dòng này
      calculateOrderCounts(updatedOrders);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const statuses = [ "Chờ xác nhận", "Đang xử lý", "Đang giao", "Đã giao", "Đã hủy" ];

  const filteredOrders = orders.filter(
    (order) =>
      order.trangthai === currentStatus &&
      order.tennguoinhan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      
      {/* --- DASHBOARD THỐNG KÊ MỚI (DẠNG GRID) --- */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Thống kê đơn hàng</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            
            {/* Card 1: Chờ xác nhận */}
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-400 flex flex-col justify-between h-24 transition hover:shadow-md">
                <span className="text-gray-500 text-sm font-medium uppercase">Chờ xác nhận</span>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-yellow-500">{pendingCount}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
            </div>

            {/* Card 2: Đang xử lý */}
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-400 flex flex-col justify-between h-24 transition hover:shadow-md">
                <span className="text-gray-500 text-sm font-medium uppercase">Đang xử lý</span>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-blue-500">{processingCount}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
            </div>

            {/* Card 3: Đang giao */}
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-indigo-400 flex flex-col justify-between h-24 transition hover:shadow-md">
                <span className="text-gray-500 text-sm font-medium uppercase">Đang giao</span>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-indigo-500">{shippingCount}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                </div>
            </div>

            {/* Card 4: Thành công */}
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 flex flex-col justify-between h-24 transition hover:shadow-md">
                <span className="text-gray-500 text-sm font-medium uppercase">Thành công</span>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-green-600">{completedCount}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
            </div>

            {/* Card 5: Đã hủy */}
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-400 flex flex-col justify-between h-24 transition hover:shadow-md">
                <span className="text-gray-500 text-sm font-medium uppercase">Đã hủy</span>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-red-500">{canceledCount}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
            </div>

        </div>
      </div>
      {/* ------------------------------------- */}

      {/* TABS TRẠNG THÁI */}
      <div className="flex flex-wrap justify-between items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-6">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => handleStatusClick(status)}
            className={`flex-1 px-4 py-4 text-center text-sm font-semibold transition-all duration-200 ${
              currentStatus === status
                ? "bg-blue-600 text-white shadow-inner"
                : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* SEARCH VÀ TABLE */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-lg font-bold text-gray-800">
                Danh sách đơn hàng: <span className="text-blue-600">{currentStatus}</span>
            </h3>
            <div className="relative w-full md:w-auto">
                 <input
                    type="text"
                    placeholder="Tìm theo tên người nhận..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                 </span>
            </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Mã Đơn</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Người nhận</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">SĐT</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <React.Fragment key={order.iddonhang}>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.iddonhang}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.tennguoinhan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.sdtnguoinhan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-[150px]" title={order.diachinhan}>{order.diachinhan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">{formatCurrencyVND(order.tongtien)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.trangthai === 'Đã giao' ? 'bg-green-100 text-green-800' : 
                          order.trangthai === 'Đã hủy' ? 'bg-gray-100 text-gray-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {order.trangthai}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex flex-col gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded text-xs transition"
                      onClick={() => handleShowDetails(order.iddonhang)}
                    >
                      {order.showDetails ? "Ẩn chi tiết" : "Xem chi tiết"}
                    </button>

                    {order.trangthai === "Đã giao" && (
                        <button
                            onClick={() => handlePrintInvoice(order)}
                            className="text-purple-600 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1 rounded text-xs transition flex items-center justify-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            Xuất HĐ
                        </button>
                    )}

                    {order.trangthai === "Chờ xác nhận" && (
                      <button onClick={() => updateOrderStatus(order.iddonhang, "Đang xử lý")} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 shadow-sm transition">Xác nhận</button>
                    )}
                    {order.trangthai === "Đang xử lý" && (
                      <button onClick={() => updateOrderStatus(order.iddonhang, "Đang giao")} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 shadow-sm transition">Giao hàng</button>
                    )}
                    {order.trangthai !== "Đã giao" && order.trangthai !== "Đã hủy" && (
                      <button onClick={() => updateOrderStatus(order.iddonhang, "Đã hủy")} className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 shadow-sm transition">Huỷ đơn</button>
                    )}
                  </td>
                </tr>
                {/* PRODUCT DETAILS ROW */}
                {order.showDetails && (
                   <tr>
                       <td colSpan="7" className="px-4 py-4 bg-gray-50 border-t border-gray-200">
                           <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-inner">
                               <h4 className="font-bold text-gray-700 mb-3 text-sm">Chi tiết sản phẩm (#{order.iddonhang})</h4>
                               <table className="min-w-full divide-y divide-gray-200">
                                   <thead className="bg-gray-100">
                                       <tr>
                                           <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Ảnh</th>
                                           <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Sản phẩm</th>
                                           <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Đơn giá</th>
                                           <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">SL</th>
                                           <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Thành tiền</th>
                                       </tr>
                                   </thead>
                                   <tbody className="divide-y divide-gray-200">
                                       {order.details.map((item) => (
                                           <tr key={item.iddonhangchitiet}>
                                               <td className="px-4 py-2"><img src={`http://localhost:3000/assets/${item.hinhanh}`} alt={item.tensanpham} className="w-10 h-10 object-cover rounded border" /></td>
                                               <td className="px-4 py-2 text-sm text-gray-900">{item.tensanpham}</td>
                                               <td className="px-4 py-2 text-sm text-gray-900">{formatCurrencyVND(item.price)}</td>
                                               <td className="px-4 py-2 text-sm text-gray-900">{item.Quantity}</td>
                                               <td className="px-4 py-2 text-sm font-semibold text-blue-600">{formatCurrencyVND((parseFloat(item.price) * parseInt(item.Quantity)).toString())}</td>
                                           </tr>
                                       ))}
                                   </tbody>
                               </table>
                           </div>
                       </td>
                   </tr>
                )}
                </React.Fragment>
              )) : (
                <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-500">Không tìm thấy đơn hàng nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}