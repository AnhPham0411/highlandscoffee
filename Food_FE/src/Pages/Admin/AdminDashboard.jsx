import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { FileSpreadsheet, Printer } from "lucide-react"; 

// --- IMPORT HELPER (Giữ nguyên đường dẫn của bạn) ---
import { exportProductReport } from "../../utils/export-excel"; 
import { formatCurrencyVND } from "../../Components/Common/finance";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0000"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Định nghĩa ngày hôm nay trước để dùng trong state
  const today = new Date().toISOString().split("T")[0];

  // --- CẬP NHẬT: LOGIC GIỮ TRẠNG THÁI NGÀY ---
  const [dateRange, setDateRange] = useState(() => {
    // 1. Kiểm tra xem có dữ liệu đã lưu trong Session Storage không
    const savedRange = sessionStorage.getItem("dashboard_date_range");
    
    if (savedRange) {
      return JSON.parse(savedRange);
    }
    
    // 2. Nếu không có, dùng mặc định (30 ngày trước -> hôm nay)
    return {
      startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
      endDate: today,
    };
  });

  const [dateError, setDateError] = useState("");

  // --- CẬP NHẬT: LƯU NGÀY KHI THAY ĐỔI ---
  useEffect(() => {
    sessionStorage.setItem("dashboard_date_range", JSON.stringify(dateRange));
  }, [dateRange]);

  useEffect(() => {
    const roleuser = localStorage.getItem("role");
    setRole(roleuser);
    if (roleuser === "Customer") navigate("/");
  }, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getOrderAdmin");
        setOrders(response.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // --- XỬ LÝ DỮ LIỆU ---
  const dashboardData = useMemo(() => {
    if (!orders.length) return null;

    const start = new Date(dateRange.startDate).setHours(0, 0, 0, 0);
    const end = new Date(dateRange.endDate).setHours(23, 59, 59, 999);

    const filtered = orders.filter((order) => {
      const d = new Date(order.created_at).getTime();
      return d >= start && d <= end;
    });

    let totalRevenue = 0;
    let successCount = 0;
    let cancelCount = 0;
    let pendingCount = 0;
    const dailyMap = {};
    const statusMap = {};
    
    // --- TÍNH TOÁN MÓN ĂN THEO NGÀY ---
    const productMap = {};

    filtered.forEach((order) => {
      const orderDate = new Date(order.created_at).toLocaleDateString('vi-VN');
      const rawDate = new Date(order.created_at);

      if (order.trangthai === "Đã giao") {
        totalRevenue += parseFloat(order.tongtien);
        successCount++;

        if (order.details && Array.isArray(order.details)) {
            order.details.forEach(item => {
                const id = item.masanpham || 'unknown';
                const price = parseFloat(item.price || 0);
                const qty = parseInt(item.Quantity || 0);

                const uniqueKey = `${id}_${orderDate}`;

                if (!productMap[uniqueKey]) {
                    productMap[uniqueKey] = {
                        id: id,
                        name: item.tensanpham,
                        date: orderDate,
                        rawDate: rawDate,
                        quantity: 0,
                        price: price,
                        totalPrice: 0
                    };
                }
                productMap[uniqueKey].quantity += qty;
                productMap[uniqueKey].totalPrice += (qty * price);
            });
        }

      } else if (order.trangthai === "Đã hủy") {
        cancelCount++;
      } else {
        pendingCount++;
      }

      // Chart Data
      const dateKey = new Date(order.created_at).toISOString().split("T")[0];
      if (!dailyMap[dateKey]) dailyMap[dateKey] = { date: dateKey, revenue: 0 };
      if (order.trangthai === "Đã giao") dailyMap[dateKey].revenue += parseFloat(order.tongtien);

      // Pie Data
      if (!statusMap[order.trangthai]) statusMap[order.trangthai] = 0;
      statusMap[order.trangthai] += 1;
    });

    const chartData = Object.values(dailyMap).sort((a, b) => new Date(a.date) - new Date(b.date));
    const pieData = Object.keys(statusMap).map(key => ({ name: key, value: statusMap[key] }));

    // Sắp xếp productStats
    const productStats = Object.values(productMap).sort((a, b) => {
        return b.rawDate - a.rawDate || b.totalPrice - a.totalPrice;
    });

    return {
      filteredOrders: filtered,
      productStats, 
      totalRevenue, successCount, cancelCount, pendingCount, totalOrders: filtered.length,
      chartData, pieData,
    };
  }, [orders, dateRange]);

  // --- XỬ LÝ DATE CHANGE ---
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    // Tạm thời set range mới
    const newRange = { ...dateRange, [name]: value };
    setDateError("");
    
    // Validate logic
    const start = new Date(newRange.startDate);
    const end = new Date(newRange.endDate);
    const current = new Date(today);
    const selected = new Date(value);

    if (selected > current) {
        setDateError("Ngày chọn không được vượt quá hôm nay!");
        return; // Không update state nếu lỗi
    }
    if (start > end) {
        setDateError("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
        // Vẫn cho set để người dùng chỉnh tiếp, hoặc return tùy logic bạn muốn
    }

    setDateRange(newRange);
  };

  // --- XUẤT EXCEL ---
  const handleExportExcel = () => {
    if (dateError || !dashboardData) return;
    exportProductReport(dashboardData.productStats, dateRange);
  };

  // --- IN BÁO CÁO ---
  const handlePrint = () => {
    const { productStats } = dashboardData;
    let rowsHtml = "";
    let grandTotal = 0;
    let totalQty = 0;

    productStats.forEach((item, index) => {
        grandTotal += item.totalPrice;
        totalQty += item.quantity;
        
        rowsHtml += `
        <tr>
            <td style="text-align: center;">${index + 1}</td>
            <td style="text-align: center;">${item.date}</td>
            <td>${item.name}</td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right;">${item.price.toLocaleString('vi-VN')}</td>
            <td style="text-align: right; font-weight: bold;">${item.totalPrice.toLocaleString('vi-VN')}</td>
        </tr>`;
    });

    const storeName = "HIGHLAND COFFEE"; 
    const storeAddress = "ĐC: 1037 Trần Phú, Bảo Lộc, Lâm Đồng";
    const storeHotline = "ĐT: 0909.7979.01 - 0933.216.246";

    const htmlContent = `
      <html>
        <head>
        <title>Báo cáo bán hàng</title>
        <style>
            body { font-family: 'Courier New', Courier, monospace; padding: 20px; color: #000; font-size: 14px; }
            .container { max-width: 800px; margin: 0 auto; }
            .header-section { text-align: center; margin-bottom: 20px; }
            .store-name { font-size: 18px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; }
            .store-info { font-size: 13px; margin-bottom: 3px; }
            .report-title { text-align: center; font-size: 20px; font-weight: bold; text-transform: uppercase; margin-top: 15px; margin-bottom: 15px; }
            .meta-info { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 8px 4px; text-transform: uppercase; font-size: 12px; font-weight: bold; text-align: center; }
            th:nth-child(3) { text-align: left; }
            th:nth-child(5), th:nth-child(6) { text-align: right; }
            td { padding: 8px 4px; border-bottom: 1px dashed #ccc; }
            .summary-section { margin-top: 20px; display: flex; justify-content: flex-end; }
            .summary-box { width: 100%; max-width: 400px; }
            .summary-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px; }
            .total-row { font-weight: bold; font-size: 18px; margin-top: 10px; border-top: 1px solid #000; padding-top: 10px; }
            @media print { body { padding: 0; } .container { width: 100%; max-width: 100%; } @page { margin: 10mm; } }
        </style>
        </head>
        <body>
            <div class="container">
                <div class="header-section">
                    <div class="store-name">${storeName}</div>
                    <div class="store-info">${storeAddress}</div>
                    <div class="store-info">${storeHotline}</div>
                    <div class="report-title">BÁO CÁO BÁN HÀNG CHI TIẾT</div>
                </div>

                <div class="meta-info">
                    <div>
                        <div>Từ ngày: ${new Date(dateRange.startDate).toLocaleDateString('vi-VN')}</div>
                        <div>Đến ngày: ${new Date(dateRange.endDate).toLocaleDateString('vi-VN')}</div>
                    </div>
                    <div style="text-align: right;">
                        <div>Ngày in: ${new Date().toLocaleDateString('vi-VN')}</div>
                        <div>Người in: Admin</div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 5%">TT</th>
                            <th style="width: 15%">Ngày</th>
                            <th style="width: 35%">Mặt hàng</th>
                            <th style="width: 10%">SL</th>
                            <th style="width: 15%">Giá</th>
                            <th style="width: 20%">T.Tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>

                <div class="summary-section">
                    <div class="summary-box">
                        <div class="summary-row">
                            <span>Tổng số lượng bán:</span>
                            <span>${totalQty}</span>
                        </div>
                        <div class="summary-row total-row">
                            <span>Tổng cộng:</span>
                            <span>${grandTotal.toLocaleString('vi-VN')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </body>
      </html>
    `;
    const printWindow = window.open("", "_blank");
    if(printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    }
  };

  if (loading || !dashboardData) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="flex-1 bg-gray-50 p-8 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-500">Tổng quan tình hình kinh doanh</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm font-semibold">Từ:</span>
                <input type="date" name="startDate" max={today} value={dateRange.startDate} onChange={handleDateChange} className="bg-transparent text-sm font-semibold outline-none border rounded px-1 py-1" />
            </div>
            
            <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm font-semibold">Đến:</span>
                <input type="date" name="endDate" max={today} value={dateRange.endDate} onChange={handleDateChange} className="bg-transparent text-sm font-semibold outline-none border rounded px-1 py-1" />
            </div>
            
            <div className="flex gap-1 ml-2">
                <button onClick={handleExportExcel} disabled={!!dateError} className="p-2 text-green-600 hover:bg-green-50 rounded border border-transparent hover:border-green-200 transition disabled:opacity-50" title="Xuất Excel Món Ăn">
                    <FileSpreadsheet className="w-5 h-5" />
                </button>
                <button onClick={handlePrint} disabled={!!dateError} className="p-2 text-blue-600 hover:bg-blue-50 rounded border border-transparent hover:border-blue-200 transition disabled:opacity-50" title="In Báo Cáo Món Ăn">
                    <Printer className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>
      
      {dateError && <div className="text-red-500 text-sm mb-4 text-right">{dateError}</div>}

      {/* DASHBOARD INFO - DOANH THU */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                <p className="text-gray-500 text-sm uppercase">Doanh thu</p>
                <h3 className="text-2xl font-bold mt-1 text-green-600">{formatCurrencyVND(dashboardData.totalRevenue.toString())}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                <p className="text-gray-500 text-sm uppercase">Tổng đơn</p>
                <h3 className="text-2xl font-bold mt-1 text-blue-600">{dashboardData.totalOrders}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
                <p className="text-gray-500 text-sm uppercase">Chờ xử lý</p>
                <h3 className="text-2xl font-bold mt-1 text-yellow-600">{dashboardData.pendingCount}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                <p className="text-gray-500 text-sm uppercase">Đã hủy</p>
                <h3 className="text-2xl font-bold mt-1 text-red-600">{dashboardData.cancelCount}</h3>
            </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm h-[350px]">
                <h3 className="font-bold text-gray-700 mb-4">Biểu đồ doanh thu</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardData.chartData}>
                        <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" tickFormatter={(str) => {
                            const date = new Date(str);
                            return `${date.getDate()}/${date.getMonth() + 1}`;
                        }} />
                        <YAxis tickFormatter={(val) => val >= 1000000 ? `${val/1000000}M` : `${val/1000}k`} />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip formatter={(value) => formatCurrencyVND(value)} />
                        <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#colorRev)" name="Doanh thu" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm h-[350px]">
                <h3 className="font-bold text-gray-700 mb-4">Trạng thái đơn</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={dashboardData.pieData} innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value" label>
                            {dashboardData.pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip /><Legend verticalAlign="bottom" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
         <h3 className="text-lg font-bold text-gray-700 mb-4">Hoạt động gần đây</h3>
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.filteredOrders.slice(0, 10).map((order) => (
                        <tr key={order.iddonhang} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.tennguoinhan || 'Khách vãng lai'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString("vi-VN")}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${order.trangthai === 'Đã giao' ? 'bg-green-100 text-green-800' : 
                                      order.trangthai === 'Đã hủy' ? 'bg-red-100 text-red-800' : 
                                      'bg-yellow-100 text-yellow-800'}`}>
                                    {order.trangthai}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">{formatCurrencyVND(order.tongtien)}</td>
                        </tr>
                    ))}
                    {dashboardData.filteredOrders.length === 0 && (
                        <tr><td colSpan="4" className="text-center py-4 text-gray-500">Không có dữ liệu trong khoảng thời gian này</td></tr>
                    )}
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}