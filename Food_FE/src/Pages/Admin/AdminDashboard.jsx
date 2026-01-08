import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";
import { FileSpreadsheet, Printer, LayoutList, Coffee } from "lucide-react"; 

// --- IMPORT HELPER ---
import { exportRevenueReport, exportProductReport } from "../../utils/export-excel"; 
import { formatCurrencyVND } from "../../Components/Common/finance";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0000"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // State chọn loại báo cáo: 'revenue' (Doanh thu) hoặc 'product' (Món ăn)
  const [reportType, setReportType] = useState('revenue');

  const today = new Date().toISOString().split("T")[0];
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
    endDate: today,
  });
  const [dateError, setDateError] = useState("");

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

    // 1. Thống kê Doanh thu
    let totalRevenue = 0;
    let successCount = 0;
    let cancelCount = 0;
    let pendingCount = 0;
    const dailyMap = {};
    const statusMap = {};

    // 2. Thống kê Món ăn (Aggregation)
    const productMap = {};

    filtered.forEach((order) => {
      if (order.trangthai === "Đã giao") {
        totalRevenue += parseFloat(order.tongtien);
        successCount++;
        
        // --- LOGIC GỘP MÓN ĂN ---
        if (order.details && Array.isArray(order.details)) {
            order.details.forEach(item => {
                const id = item.masanpham || 'unknown';
                if (!productMap[id]) {
                    productMap[id] = {
                        id: id,
                        name: item.tensanpham,
                        quantity: 0,
                        price: parseFloat(item.price || 0),
                        totalPrice: 0
                    };
                }
                const qty = parseInt(item.Quantity || 0);
                productMap[id].quantity += qty;
                productMap[id].totalPrice += (qty * parseFloat(item.price || 0));
            });
        }
      } else if (order.trangthai === "Đã hủy") {
        cancelCount++;
      } else {
        pendingCount++;
      }

      // Xử lý biểu đồ ngày
      const dateKey = new Date(order.created_at).toISOString().split("T")[0];
      if (!dailyMap[dateKey]) dailyMap[dateKey] = { date: dateKey, revenue: 0 };
      if (order.trangthai === "Đã giao") dailyMap[dateKey].revenue += parseFloat(order.tongtien);

      // Xử lý biểu đồ tròn
      if (!statusMap[order.trangthai]) statusMap[order.trangthai] = 0;
      statusMap[order.trangthai] += 1;
    });

    const chartData = Object.values(dailyMap).sort((a, b) => new Date(a.date) - new Date(b.date));
    const pieData = Object.keys(statusMap).map(key => ({ name: key, value: statusMap[key] }));

    // Chuyển productMap thành mảng và sắp xếp theo doanh thu giảm dần
    const productStats = Object.values(productMap).sort((a, b) => b.totalPrice - a.totalPrice);

    return {
      filteredOrders: filtered,
      productStats,
      totalRevenue, successCount, cancelCount, pendingCount, totalOrders: filtered.length,
      chartData, pieData,
    };
  }, [orders, dateRange]);

  // --- XỬ LÝ DATE ---
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newRange = { ...dateRange, [name]: value };
    setDateError("");
    const start = new Date(newRange.startDate);
    const end = new Date(newRange.endDate);
    const current = new Date(today);
    const selected = new Date(value);

    if (selected > current) setDateError("Ngày chọn không được vượt quá hôm nay!");
    else if (start > end) setDateError("Ngày bắt đầu không được lớn hơn ngày kết thúc!");

    setDateRange(newRange);
  };

  // --- XUẤT EXCEL ---
  const handleExportExcel = () => {
    if (dateError || !dashboardData) return;
    if (reportType === 'revenue') {
        exportRevenueReport(dashboardData.filteredOrders, dateRange);
    } else {
        exportProductReport(dashboardData.productStats, dateRange);
    }
  };

  // --- IN BÁO CÁO MÓN ĂN ---
  const handlePrintProductReport = () => {
      const { productStats } = dashboardData;
      let rowsHtml = "";
      let totalQty = 0;
      let totalMoney = 0;

      productStats.forEach((item, index) => {
          totalQty += item.quantity;
          totalMoney += item.totalPrice;
          rowsHtml += `
            <tr>
                <td style="text-align: center;">${index + 1}</td>
                <td style="text-align: center;">${item.id}</td>
                <td style="text-align: left;">${item.name}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">${item.price.toLocaleString('vi-VN')}</td>
                <td style="text-align: right;">${item.totalPrice.toLocaleString('vi-VN')}</td>
            </tr>
          `;
      });

      const htmlContent = `
        <html>
            <head>
                <title>Báo cáo món ăn</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; font-size: 13px; }
                    .header { text-align: center; margin-bottom: 20px; color: #103a71; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background-color: #103a71; color: white; padding: 8px; border: 1px solid #000; }
                    td { border: 1px solid #555; padding: 6px; }
                    .total-row td { background-color: #eee; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>BÁO CÁO TỔNG HỢP MÓN ĂN</h2>
                    <p>Từ ngày ${new Date(dateRange.startDate).toLocaleDateString('vi-VN')} đến ${new Date(dateRange.endDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <table>
                    <thead>
                        <tr><th>TT</th><th>Mã Món</th><th>Tên Món</th><th>Số Lượng</th><th>Đơn Giá</th><th>Thành Tiền</th></tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                        <tr class="total-row">
                            <td colspan="3" style="text-align: center;">TỔNG CỘNG</td>
                            <td style="text-align: center;">${totalQty}</td>
                            <td></td>
                            <td style="text-align: right;">${totalMoney.toLocaleString('vi-VN')}</td>
                        </tr>
                    </tbody>
                </table>
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

  // --- IN BÁO CÁO DOANH THU ---
  const handlePrintRevenueReport = () => {
    const { filteredOrders } = dashboardData;
    let rowsHtml = "";
    let totalRevenue = 0;

    filteredOrders.forEach((order, index) => {
        const rawId = order.iddonhang ? String(order.iddonhang) : "";
        const displayId = rawId.length > 8 ? rawId.slice(-8) : rawId;
        const amount = parseFloat(order.tongtien || 0);
        totalRevenue += amount;
        
        rowsHtml += `
        <tr>
            <td style="text-align: center;">${index + 1}</td>
            <td style="text-align: center;">${new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
            <td>${displayId}</td>
            <td>${order.tennguoinhan || 'Khách lẻ'}</td>
            <td style="text-align: right;">${amount.toLocaleString('vi-VN')}</td>
        </tr>`;
    });

    const htmlContent = `
      <html>
        <head><title>Báo cáo doanh thu</title>
        <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #103a71; color: white; padding: 8px; border: 1px solid #000; }
            td { border: 1px solid #555; padding: 6px; }
            .header { text-align: center; color: #103a71; margin-bottom: 20px; }
        </style>
        </head>
        <body>
            <div class="header">
                <h2>BÁO CÁO DOANH THU</h2>
                <p>${new Date(dateRange.startDate).toLocaleDateString('vi-VN')} - ${new Date(dateRange.endDate).toLocaleDateString('vi-VN')}</p>
            </div>
            <table>
                <thead><tr><th>TT</th><th>Ngày</th><th>Mã HĐ</th><th>Khách hàng</th><th>Thành tiền</th></tr></thead>
                <tbody>
                    ${rowsHtml}
                    <tr><td colspan="4" style="text-align:center;font-weight:bold">TỔNG</td><td style="text-align:right;font-weight:bold">${totalRevenue.toLocaleString('vi-VN')}</td></tr>
                </tbody>
            </table>
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

  const handlePrint = () => {
      if (reportType === 'revenue') handlePrintRevenueReport();
      else handlePrintProductReport();
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
             {/* SWITCH TAB */}
             <div className="flex bg-gray-100 rounded-md p-1 mr-2">
                <button 
                    onClick={() => setReportType('revenue')}
                    className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 transition ${reportType === 'revenue' ? 'bg-white shadow text-blue-700' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                    <LayoutList className="w-4 h-4"/> Doanh thu
                </button>
                <button 
                    onClick={() => setReportType('product')}
                    className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 transition ${reportType === 'product' ? 'bg-white shadow text-blue-700' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                    <Coffee className="w-4 h-4"/> Món ăn
                </button>
             </div>

            <input type="date" name="startDate" max={today} value={dateRange.startDate} onChange={handleDateChange} className="bg-transparent text-sm font-semibold outline-none border rounded px-1" />
            <span className="text-gray-400">-</span>
            <input type="date" name="endDate" max={today} value={dateRange.endDate} onChange={handleDateChange} className="bg-transparent text-sm font-semibold outline-none border rounded px-1" />
            
            <button onClick={handleExportExcel} disabled={!!dateError} className="p-2 text-green-600 hover:bg-green-50 rounded disabled:opacity-50" title="Xuất Excel">
                <FileSpreadsheet className="w-5 h-5" />
            </button>
            <button onClick={handlePrint} disabled={!!dateError} className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50" title="In Báo Cáo">
                <Printer className="w-5 h-5" />
            </button>
        </div>
      </div>
      
      {dateError && <div className="text-red-500 text-sm mb-4 text-right">{dateError}</div>}

      {/* --- HIỂN THỊ NỘI DUNG THEO TAB --- */}
      {reportType === 'revenue' ? (
        // GIAO DIỆN DOANH THU
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                    <p className="text-gray-500 text-sm uppercase">Doanh thu</p>
                    <h3 className="text-2xl font-bold mt-1">{formatCurrencyVND(dashboardData.totalRevenue.toString())}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                    <p className="text-gray-500 text-sm uppercase">Tổng đơn</p>
                    <h3 className="text-2xl font-bold mt-1">{dashboardData.totalOrders}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
                    <p className="text-gray-500 text-sm uppercase">Chờ xử lý</p>
                    <h3 className="text-2xl font-bold mt-1">{dashboardData.pendingCount}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                    <p className="text-gray-500 text-sm uppercase">Đã hủy</p>
                    <h3 className="text-2xl font-bold mt-1">{dashboardData.cancelCount}</h3>
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
                            <XAxis dataKey="date" /><YAxis /><CartesianGrid strokeDasharray="3 3" /><Tooltip />
                            <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#colorRev)" />
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
        </>
      ) : (
        // GIAO DIỆN MÓN ĂN
        <>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* BẢNG TOP MÓN ĂN */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Coffee className="w-5 h-5 text-orange-500"/> Thống kê món bán chạy
                    </h3>
                    <div className="overflow-y-auto max-h-[400px]">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left">Tên món</th>
                                    <th className="px-4 py-2 text-center">SL</th>
                                    <th className="px-4 py-2 text-right">Doanh thu</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {dashboardData.productStats.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-700">{item.name}</td>
                                        <td className="px-4 py-3 text-center font-bold text-blue-600">{item.quantity}</td>
                                        <td className="px-4 py-3 text-right text-green-600">{formatCurrencyVND(item.totalPrice)}</td>
                                    </tr>
                                ))}
                                {dashboardData.productStats.length === 0 && <tr><td colSpan="3" className="text-center py-4">Chưa có dữ liệu</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* BIỂU ĐỒ TOP 5 MÓN */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                     <h3 className="text-lg font-bold text-gray-800 mb-4">Top 5 Món theo doanh thu</h3>
                     <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dashboardData.productStats.slice(0, 5)} layout="vertical" margin={{left: 10, right: 30}}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 11}} />
                                <Tooltip formatter={(val) => formatCurrencyVND(val)} />
                                <Bar dataKey="totalPrice" fill="#ff7300" radius={[0, 4, 4, 0]} barSize={25}>
                                    {dashboardData.productStats.slice(0, 5).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                     </div>
                </div>
             </div>
        </>
      )}

      {/* --- TABLE: HOẠT ĐỘNG GẦN ĐÂY --- */}
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