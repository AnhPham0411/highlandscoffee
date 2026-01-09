import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// --- BÁO CÁO DOANH THU (GIỮ NGUYÊN) ---
export const exportRevenueReport = async (orders, dateRange) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Báo cáo doanh thu');

  // Định nghĩa các cột
  worksheet.columns = [
    { key: 'stt', width: 5 },
    { key: 'date', width: 15 },
    { key: 'code', width: 15 },
    { key: 'customer', width: 25 },
    { key: 'status', width: 15 }, // Thêm trạng thái cho rõ ràng
    { key: 'amount', width: 20 },
  ];

  // Header
  const headerRow = worksheet.addRow([
    'TT', 'Ngày bán', 'Mã HĐ', 'Khách hàng', 'Trạng thái', 'Tổng tiền (VND)'
  ]);

  // Style Header
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '103a71' } };
    cell.font = { color: { argb: 'FFFFFF' }, bold: true, name: 'Times New Roman', size: 12 };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  });
  headerRow.height = 30;

  // Dữ liệu
  let stt = 1;
  let totalRevenue = 0;

  // Sắp xếp theo ngày giảm dần
  const sortedOrders = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  sortedOrders.forEach((order) => {
    const dateObj = new Date(order.created_at);
    const dateStr = !isNaN(dateObj) ? dateObj.toLocaleDateString('vi-VN') : '';
    
    // Chỉ tính tổng tiền nếu đơn đã giao
    const amount = order.trangthai === 'Đã giao' ? parseFloat(order.tongtien || 0) : 0;
    if(order.trangthai === 'Đã giao') totalRevenue += amount;

    const rawId = order.iddonhang ? String(order.iddonhang) : "";
    const displayId = rawId.length > 8 ? rawId.slice(-8).toUpperCase() : rawId;

    const row = worksheet.addRow([
        stt++,
        dateStr,
        displayId,
        order.tennguoinhan || 'Khách lẻ',
        order.trangthai,
        parseFloat(order.tongtien || 0) // Hiển thị số tiền gốc dù chưa giao
    ]);

    // Style từng dòng
    row.eachCell((cell, colNumber) => {
        cell.font = { name: 'Times New Roman', size: 12 };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        
        if ([1, 2, 3, 5].includes(colNumber)) cell.alignment = { horizontal: 'center' };
        else if (colNumber === 6) {
            cell.alignment = { horizontal: 'right' };
            cell.numFmt = '#,##0';
        } else {
            cell.alignment = { horizontal: 'left' };
        }

        // Tô màu đỏ nếu đã hủy
        if (order.trangthai === 'Đã hủy') cell.font = { color: { argb: 'FF0000' }, name: 'Times New Roman', size: 12 };
    });
  });

  // Dòng Tổng
  const totalRow = worksheet.addRow(['', 'TỔNG DOANH THU THỰC TẾ (Đã giao)', '', '', '', totalRevenue]);
  worksheet.mergeCells(`A${totalRow.number}:E${totalRow.number}`);
  
  totalRow.eachCell((cell, colNumber) => {
      cell.font = { name: 'Times New Roman', size: 12, bold: true, color: { argb: '103a71' } };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      if (colNumber === 6) {
          cell.alignment = { horizontal: 'right' };
          cell.numFmt = '#,##0';
      } else {
          cell.alignment = { horizontal: 'center' };
      }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const fileName = `Bao_cao_DoanhThu_${dateRange?.startDate}.xlsx`;
  saveAs(blob, fileName);
};

// --- BÁO CÁO MÓN ĂN (ĐÃ SỬA: THÊM CỘT NGÀY BÁN) ---
export const exportProductReport = async (productStats, dateRange) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Báo cáo món ăn');

  // 1. Định nghĩa cột (Thêm cột Date)
  worksheet.columns = [
    { key: 'stt', width: 5 },
    { key: 'date', width: 15 },         // <--- MỚI: Ngày bán
    { key: 'productName', width: 35 },  // Tên món
    { key: 'quantity', width: 10 },     // SL
    { key: 'unitPrice', width: 15 },    // Đơn giá
    { key: 'totalAmount', width: 20 },  // Thành tiền
  ];

  // 2. Tiêu đề
  const headerRow = worksheet.addRow([
    'TT', 'Ngày bán', 'Tên Món Ăn', 'Số Lượng', 'Đơn Giá', 'Thành Tiền'
  ]);

  // Style Header
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '103a71' } };
    cell.font = { color: { argb: 'FFFFFF' }, bold: true, name: 'Times New Roman', size: 12 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  });
  headerRow.height = 30;

  // 3. Dữ liệu
  let stt = 1;
  let grandTotalQty = 0;
  let grandTotalAmount = 0;

  productStats.forEach(item => {
    grandTotalQty += item.quantity;
    grandTotalAmount += item.totalPrice;

    // Thêm dòng: item.date đã được xử lý ở AdminDashboard
    const row = worksheet.addRow([
      stt++,
      item.date,     // <--- Dữ liệu ngày
      item.name,
      item.quantity,
      item.price,
      item.totalPrice
    ]);

    // Style dữ liệu
    row.eachCell((cell, colNumber) => {
        cell.font = { name: 'Times New Roman', size: 12 };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        
        // Căn giữa: TT, Ngày, SL
        if ([1, 2, 4].includes(colNumber)) {
            cell.alignment = { horizontal: 'center' };
        } 
        // Căn phải & Tiền tệ: Đơn giá, Thành tiền
        else if ([5, 6].includes(colNumber)) {
            cell.alignment = { horizontal: 'right' };
            cell.numFmt = '#,##0';
        } 
        // Căn trái: Tên món
        else {
            cell.alignment = { horizontal: 'left' };
        }
    });
  });

  // 4. Dòng tổng
  // Cột: A(TT), B(Ngày), C(Tên), D(SL), E(Giá), F(Tiền)
  const totalRow = worksheet.addRow(['', '', 'TỔNG CỘNG', grandTotalQty, '', grandTotalAmount]);
  
  // Merge cột A, B, C cho chữ "TỔNG CỘNG"
  worksheet.mergeCells(`A${totalRow.number}:C${totalRow.number}`);
  
  totalRow.eachCell((cell, colNumber) => {
      cell.font = { name: 'Times New Roman', size: 12, bold: true, color: { argb: '103a71' } };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      
      if ([4, 6].includes(colNumber)) { // Cột SL và Thành tiền
          cell.alignment = { horizontal: 'right' }; // SL căn phải cho thẳng hàng số
          if(colNumber === 6) cell.numFmt = '#,##0';
          if(colNumber === 4) cell.alignment = { horizontal: 'center' }; // SL căn giữa cho đẹp
      } else {
          cell.alignment = { horizontal: 'center' };
      }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const fileName = `Bao_cao_MON_AN_${new Date(dateRange.startDate).toISOString().slice(0,10)}.xlsx`;
  saveAs(blob, fileName);
};