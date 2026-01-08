import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportRevenueReport = async (orders, dateRange) => {
  // 1. Khởi tạo Workbook và Worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Báo cáo doanh thu');

  // 2. Định nghĩa các cột
  worksheet.columns = [
    { key: 'stt', width: 5 },              // TT
    { key: 'date', width: 15 },            // Ngày bán
    { key: 'productId', width: 15 },       // Mã hóa đơn
    { key: 'productName', width: 25 },     // Tên khách hàng
    { key: 'quantity', width: 10 },        // Số lượng bán
    { key: 'price', width: 15 },           // Đơn giá
    { key: 'amount', width: 20 },          // Thành tiền
    { key: 'vat', width: 15 },             // Thuế VAT
    { key: 'revenue', width: 20 },         // Tổng doanh thu
  ];

  // 3. Tạo Tiêu đề cột (Header)
  const headerRow = worksheet.addRow([
    'TT', 
    'Ngày bán', 
    'Mã HĐ', 
    'Khách hàng', 
    'SL', 
    'Đơn giá (VND)', 
    'Thành tiền (VND)', 
    'Thuế VAT (10%)', 
    'Tổng doanh thu (VND)'
  ]);

  // Style cho Header (Màu xanh đậm, chữ trắng)
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '103a71' }, 
    };
    cell.font = {
      color: { argb: 'FFFFFF' }, 
      bold: true,
      name: 'Times New Roman',
      size: 12
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });
  
  headerRow.height = 30;

  // 4. Xử lý dữ liệu
  let stt = 1;
  let totalQty = 0;
  let totalAmount = 0;
  let totalVAT = 0;
  let totalRevenue = 0;

  orders.forEach((order) => {
    const dateObj = new Date(order.created_at);
    const dateStr = !isNaN(dateObj) ? dateObj.toLocaleDateString('en-CA') : '';
    
    // Xử lý tiền tệ
    const amount = parseFloat(order.tongtien || 0);
    
    // Logic tính toán: Doanh thu = Thành tiền - VAT (10%)
    const vat = Math.round(amount * 0.1);
    const revenue = amount - vat;
    const qty = 1; // Mỗi đơn hàng tính là 1 giao dịch (hoặc lấy order.total_items nếu có)

    // Cộng dồn tổng
    totalQty += qty;
    totalAmount += amount;
    totalVAT += vat;
    totalRevenue += revenue;

    // Lấy ID đơn hàng (cắt 8 ký tự cuối)
    const rawId = order.iddonhang ? String(order.iddonhang) : "";
    const displayId = rawId.length > 8 ? rawId.slice(-8) : rawId;

    // Thêm dòng vào Excel
    const row = worksheet.addRow([
        stt++,                  
        dateStr,                
        displayId,
        order.tennguoinhan || 'Khách lẻ',
        qty,                    
        amount,                 
        amount,                 
        vat,                    
        revenue                 
    ]);

    // Định dạng style cho từng ô
    row.eachCell((cell, colNumber) => {
        cell.font = { name: 'Times New Roman', size: 12 };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
        
        // Căn giữa: TT, Ngày, Mã, SL
        if ([1, 2, 3, 5].includes(colNumber)) {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } 
        // Căn phải & số tiền: Đơn giá, Thành tiền, VAT, Doanh thu
        else if ([6, 7, 8, 9].includes(colNumber)) {
             cell.alignment = { vertical: 'middle', horizontal: 'right' };
             cell.numFmt = '#,##0'; 
        }
        else {
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
        }
    });
  });

  // 5. Thêm dòng TỔNG CỘNG
  const totalRow = worksheet.addRow([
      '', 
      'TỔNG', 
      '', '', 
      totalQty,
      '',
      totalAmount,
      totalVAT,
      totalRevenue
  ]);

  // Style cho dòng Tổng
  totalRow.eachCell((cell, colNumber) => {
      cell.font = { name: 'Times New Roman', size: 12, bold: true };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      
      if ([6, 7, 8, 9].includes(colNumber)) {
          cell.alignment = { horizontal: 'right' };
          cell.numFmt = '#,##0';
      } else {
          cell.alignment = { horizontal: 'center' };
      }
  });

  // Merge ô "TỔNG"
  worksheet.mergeCells(`A${totalRow.number}:D${totalRow.number}`);
  worksheet.getCell(`A${totalRow.number}`).value = 'TỔNG CỘNG';

  // 6. Xuất file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  const fileName = `Bao_cao_${dateRange?.startDate ? new Date(dateRange.startDate).toISOString().slice(0,10) : 'all'}.xlsx`;
  
  saveAs(blob, fileName);
};
export const exportProductReport = async (productStats, dateRange) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Báo cáo món ăn');

  // Định nghĩa cột
  worksheet.columns = [
    { key: 'stt', width: 5 },
    { key: 'productId', width: 15 },
    { key: 'productName', width: 30 },
    { key: 'quantity', width: 15 },
    { key: 'unitPrice', width: 20 },
    { key: 'totalAmount', width: 25 },
  ];

  // Tiêu đề
  const headerRow = worksheet.addRow([
    'TT', 'Mã Món', 'Tên Món Ăn', 'Tổng Số Lượng', 'Đơn Giá (TB)', 'Tổng Thành Tiền'
  ]);

  // Style Header (Xanh đậm)
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '103a71' } };
    cell.font = { color: { argb: 'FFFFFF' }, bold: true, name: 'Times New Roman', size: 12 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  });
  headerRow.height = 30;

  // Dữ liệu
  let stt = 1;
  let grandTotalQty = 0;
  let grandTotalAmount = 0;

  productStats.forEach(item => {
    grandTotalQty += item.quantity;
    grandTotalAmount += item.totalPrice;

    const row = worksheet.addRow([
      stt++,
      item.id,
      item.name,
      item.quantity,
      item.price,
      item.totalPrice
    ]);

    // Style dữ liệu
    row.eachCell((cell, colNumber) => {
        cell.font = { name: 'Times New Roman', size: 12 };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        
        // Định dạng số cho các cột tiền và số lượng
        if (colNumber >= 4) { 
            cell.alignment = { horizontal: 'right' };
            cell.numFmt = '#,##0';
        } else {
            cell.alignment = { horizontal: 'center' };
        }
        // Tên món căn trái
        if (colNumber === 3) cell.alignment = { horizontal: 'left' }; 
    });
  });

  // Dòng tổng
  const totalRow = worksheet.addRow(['', 'TỔNG CỘNG', '', grandTotalQty, '', grandTotalAmount]);
  worksheet.mergeCells(`A${totalRow.number}:C${totalRow.number}`);
  
  totalRow.eachCell((cell, colNumber) => {
      cell.font = { name: 'Times New Roman', size: 12, bold: true };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      if (colNumber >= 4) {
          cell.alignment = { horizontal: 'right' };
          cell.numFmt = '#,##0';
      } else {
          cell.alignment = { horizontal: 'center' };
      }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const fileName = `Bao_cao_MON_AN_${new Date(dateRange.startDate).toISOString().slice(0,10)}.xlsx`;
  saveAs(blob, fileName);
};