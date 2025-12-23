import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatCurrencyVND } from "../../Components/Common/finance"; 

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0000"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. LẤY NGÀY HIỆN TẠI (Để chặn chọn tương lai) ---
  const today = new Date().toISOString().split("T")[0];

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
    endDate: today, // Mặc định là hôm nay
  });

  const [dateError, setDateError] = useState("");

  // --- KIỂM TRA QUYỀN TRUY CẬP ---
  useEffect(() => {
    const roleuser = localStorage.getItem("role");
    setRole(roleuser);
    if (roleuser === "Customer") {
      navigate("/");
    }
  }, [navigate]);

  // --- LẤY DỮ LIỆU ---
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

    filtered.forEach((order) => {
      if (order.trangthai === "Đã giao") {
        totalRevenue += parseFloat(order.tongtien);
        successCount++;
      } else if (order.trangthai === "Đã hủy") {
        cancelCount++;
      } else {
        pendingCount++;
      }

      const dateKey = new Date(order.created_at).toISOString().split("T")[0];
      const shortDate = new Date(order.created_at).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' });
      
      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = { date: shortDate, fullDate: dateKey, revenue: 0, orders: 0 };
      }
      if (order.trangthai === "Đã giao") {
        dailyMap[dateKey].revenue += parseFloat(order.tongtien);
      }
      dailyMap[dateKey].orders += 1;

      if (!statusMap[order.trangthai]) {
        statusMap[order.trangthai] = 0;
      }
      statusMap[order.trangthai] += 1;
    });

    const chartData = Object.values(dailyMap).sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));
    
    const pieData = Object.keys(statusMap).map((key) => ({
      name: key,
      value: statusMap[key],
    }));

    return {
      filteredOrders: filtered,
      totalRevenue,
      successCount,
      cancelCount,
      pendingCount,
      totalOrders: filtered.length,
      chartData,
      pieData,
    };
  }, [orders, dateRange]);

  // --- 4. XỬ LÝ THAY ĐỔI NGÀY & VALIDATE (ĐÃ SỬA) ---
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newRange = { ...dateRange, [name]: value };

    // Reset lỗi
    setDateError("");

    // Validate Logic
    const start = new Date(newRange.startDate);
    const end = new Date(newRange.endDate);
    const current = new Date(today);
    const selected = new Date(value);

    // 1. Kiểm tra ngày tương lai
    if (selected > current) {
        setDateError("Ngày chọn không được vượt quá hôm nay!");
    } 
    // 2. Kiểm tra ngày bắt đầu > ngày kết thúc
    else if (start > end) {
        setDateError("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
    }

    setDateRange(newRange);
  };

  // --- 5. CHỨC NĂNG IN BÁO CÁO ---
  const handlePrintReport = () => {
    if (dateError || !dashboardData) return;

    const { totalRevenue, successCount, totalOrders, filteredOrders } = dashboardData;

    let rowsHtml = "";
    filteredOrders.forEach((order, index) => {
       const statusClass = order.trangthai === 'Đã giao' ? 'color: green; font-weight: bold;' : 'color: #333;';
       rowsHtml += `
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${order.tennguoinhan}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center; ${statusClass}">${order.trangthai}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatCurrencyVND(order.tongtien)}</td>
        </tr>
       `;
    });

    const htmlContent = `
      <html>
        <head>
          <title>Báo cáo doanh thu</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { margin: 0; color: #b22830; }
            .summary { display: flex; justify-content: space-between; margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; background: #f9f9f9; }
            .summary-item strong { display: block; font-size: 1.2em; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
            th { background-color: #b22830; color: white; padding: 10px; border: 1px solid #ddd; }
            .footer { margin-top: 40px; text-align: right; font-style: italic; font-size: 12px; }
          </style>
        </head>
        <body>
            <div class="header">
                <h1>BÁO CÁO KẾT QUẢ KINH DOANH</h1>
                <p>Từ ngày ${new Date(dateRange.startDate).toLocaleDateString('vi-VN')} đến ngày ${new Date(dateRange.endDate).toLocaleDateString('vi-VN')}</p>
            </div>
            <div class="summary">
                <div class="summary-item"><span>Tổng doanh thu</span><strong>${formatCurrencyVND(totalRevenue.toString())}</strong></div>
                <div class="summary-item"><span>Tổng đơn hàng</span><strong>${totalOrders}</strong></div>
                <div class="summary-item"><span>Thành công</span><strong style="color: green">${successCount}</strong></div>
            </div>
            <table>
                <thead><tr><th>STT</th><th>Khách hàng</th><th>Ngày tạo</th><th>Trạng thái</th><th>Giá trị</th></tr></thead>
                <tbody>${rowsHtml}</tbody>
            </table>
            <div class="footer"><p>Ngày xuất: ${new Date().toLocaleString('vi-VN')}</p></div>
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

  if (loading) return <div className="p-10 flex justify-center">Loading Dashboard...</div>;
  if (!dashboardData) return <div className="p-10">Chưa có dữ liệu</div>;

  return (
    <div className="flex-1 bg-gray-50 p-8 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-500 mt-1">Tổng quan tình hình kinh doanh</p>
        </div>

        {/* --- DATE FILTER & PRINT (ĐÃ SỬA) --- */}
        <div className="flex flex-col items-end gap-2">
            <div className={`flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border ${dateError ? 'border-red-500' : 'border-gray-200'}`}>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gray-400 font-bold px-1">Từ ngày</span>
                    <input 
                        type="date" name="startDate" 
                        max={today} // Chặn chọn ngày tương lai trên UI
                        value={dateRange.startDate} onChange={handleDateChange} 
                        className="bg-transparent text-sm font-semibold outline-none px-1 cursor-pointer"
                    />
                </div>
                <div className="w-[1px] h-8 bg-gray-300 mx-1"></div>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gray-400 font-bold px-1">Đến ngày</span>
                    <input 
                        type="date" name="endDate" 
                        max={today} // Chặn chọn ngày tương lai trên UI
                        value={dateRange.endDate} onChange={handleDateChange} 
                        className="bg-transparent text-sm font-semibold outline-none px-1 cursor-pointer"
                    />
                </div>
                <button 
                    onClick={handlePrintReport}
                    disabled={!!dateError}
                    className={`ml-3 px-4 py-2 rounded-md text-white flex items-center gap-2 shadow-sm transition
                        ${dateError ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#b22830] hover:bg-[#8f1e25]'}
                    `}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    In Báo Cáo
                </button>
            </div>
            {dateError && (
                <div className="flex items-center text-red-500 text-sm font-medium animate-pulse">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {dateError}
                </div>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase">Doanh thu</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatCurrencyVND(dashboardData.totalRevenue.toString())}</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase">Tổng đơn hàng</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{dashboardData.totalOrders}</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </div>
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500 hover:shadow-md transition">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase">Chờ xử lý</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{dashboardData.pendingCount}</h3>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500 hover:shadow-md transition">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase">Đơn đã hủy</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{dashboardData.cancelCount}</h3>
                </div>
                <div className="p-3 bg-red-100 rounded-full text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-700 mb-6">Biểu đồ xu hướng doanh thu</h3>
            <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardData.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `${value/1000}k`} tickLine={false} axisLine={false} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <Tooltip formatter={(value) => formatCurrencyVND(value.toString())} />
                        <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" name="Doanh thu" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-700 mb-6">Tỷ lệ trạng thái đơn</h3>
            <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={dashboardData.pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {dashboardData.pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
         <h3 className="text-lg font-bold text-gray-700 mb-4">Hoạt động gần đây (Đơn hàng mới)</h3>
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
                    {dashboardData.filteredOrders.slice(0, 5).map((order) => (
                        <tr key={order.iddonhang}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.tennguoinhan}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString("vi-VN")}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${order.trangthai === 'Đã giao' ? 'bg-green-100 text-green-800' : 
                                      order.trangthai === 'Đã hủy' ? 'bg-red-100 text-red-800' : 
                                      'bg-yellow-100 text-yellow-800'}`}>
                                    {order.trangthai}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrencyVND(order.tongtien)}</td>
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