/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : foodstore

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2025-12-25 00:56:37
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `danhgia`
-- ----------------------------
DROP TABLE IF EXISTS `danhgia`;
CREATE TABLE `danhgia` (
  `id_danhgia` int(11) NOT NULL AUTO_INCREMENT,
  `idnguoidung` int(11) NOT NULL,
  `idsp` int(11) NOT NULL,
  `iddonhang` int(11) DEFAULT NULL COMMENT 'Lưu mã đơn hàng để biết đã mua hay chưa',
  `so_sao` int(11) NOT NULL DEFAULT 5 COMMENT 'Số sao từ 1 đến 5',
  `noi_dung` text DEFAULT NULL COMMENT 'Khách hàng bình luận',
  `phan_hoi` text DEFAULT NULL COMMENT 'Admin trả lời (Rep comment)',
  `ngay_danh_gia` timestamp NULL DEFAULT current_timestamp(),
  `ngay_phan_hoi` timestamp NULL DEFAULT NULL COMMENT 'Thời gian admin trả lời',
  `trang_thai` tinyint(4) DEFAULT 1 COMMENT '1: Hiện, 0: Ẩn',
  PRIMARY KEY (`id_danhgia`),
  KEY `fk_danhgia_user` (`idnguoidung`),
  KEY `fk_danhgia_sp` (`idsp`),
  KEY `fk_danhgia_donhang` (`iddonhang`),
  CONSTRAINT `fk_danhgia_donhang` FOREIGN KEY (`iddonhang`) REFERENCES `donhang` (`iddonhang`) ON DELETE SET NULL,
  CONSTRAINT `fk_danhgia_sp` FOREIGN KEY (`idsp`) REFERENCES `sanpham` (`idsp`) ON DELETE CASCADE,
  CONSTRAINT `fk_danhgia_user` FOREIGN KEY (`idnguoidung`) REFERENCES `user` (`idnguoidung`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of danhgia
-- ----------------------------
INSERT INTO danhgia VALUES ('1', '9', '19', null, '5', 'Freeze trà xanh đậm đà, thạch dai ngon cực kỳ! Sẽ ủng hộ dài dài.', null, '2025-06-25 08:30:00', null, '1');
INSERT INTO danhgia VALUES ('2', '10', '11', null, '5', 'Trà sen vàng là chân ái, hạt sen bùi, củ năng giòn. 10 điểm.', null, '2025-06-25 09:15:00', null, '1');
INSERT INTO danhgia VALUES ('3', '2', '2', null, '4', 'Cà phê ngon, nhưng hơi nhiều đá một chút.', 'Cảm ơn bạn, lần sau bạn có thể ghi chú giảm đá nhé!', '2025-06-25 10:00:00', null, '1');
INSERT INTO danhgia VALUES ('4', '18', '30', null, '5', 'Phin đen đá chuẩn vị truyền thống, uống tỉnh cả người.', null, '2025-06-25 11:20:00', null, '1');
INSERT INTO danhgia VALUES ('5', '19', '41', null, '3', 'Bánh Mousse Cacao hơi ngọt so với khẩu vị của mình.', 'Cảm ơn bạn đã góp ý, Highlands sẽ ghi nhận để cải thiện công thức ạ.', '2025-06-25 12:45:00', null, '1');
INSERT INTO danhgia VALUES ('6', '9', '81', null, '5', 'Món mới Freeze Caramel ngon xỉu, lớp kem béo ngậy.', null, '2025-06-26 14:00:00', null, '1');
INSERT INTO danhgia VALUES ('7', '13', '12', null, '4', 'Trà thạch đào thơm, miếng đào to giòn.', null, '2025-06-26 15:30:00', null, '1');
INSERT INTO danhgia VALUES ('8', '1', '32', null, '5', 'Bạc xỉu pha rất vừa miệng, không bị ngọt gắt.', null, '2025-06-26 16:10:00', null, '1');
INSERT INTO danhgia VALUES ('9', '14', '39', null, '2', 'Bánh chuối hôm nay mình ăn cảm giác hơi khô.', 'Xin lỗi bạn về trải nghiệm chưa tốt, shop sẽ kiểm tra lại lô bánh ngay ạ.', '2025-06-27 09:00:00', null, '1');
INSERT INTO danhgia VALUES ('10', '18', '4', null, '5', 'PhinDi Choco rất hợp cho ai thích cafe mà sợ đắng.', null, '2025-06-27 10:25:00', null, '1');
INSERT INTO danhgia VALUES ('11', '19', '19', null, '5', 'Vẫn cứ là mê Freeze Trà Xanh nhất menu.', null, '2025-06-27 13:40:00', null, '1');
INSERT INTO danhgia VALUES ('12', '9', '20', null, '5', 'Freeze Socola đậm vị, xay nhuyễn mịn.', null, '2025-06-28 08:50:00', null, '1');
INSERT INTO danhgia VALUES ('13', '2', '36', null, '3', 'Cappuccino bình thường, không quá đặc sắc.', null, '2025-06-28 15:00:00', null, '1');
INSERT INTO danhgia VALUES ('14', '10', '82', null, '5', 'Classic Phin Freeze uống lạ miệng mà cuốn lắm.', null, '2025-06-29 10:10:00', null, '1');
INSERT INTO danhgia VALUES ('15', '13', '14', null, '4', 'Trà thạch vải thơm, giải nhiệt tốt cho mùa hè.', null, '2025-06-29 11:55:00', null, '1');
INSERT INTO danhgia VALUES ('16', '18', '31', null, '5', 'Phin sữa đá không bao giờ làm thất vọng.', null, '2025-06-30 07:45:00', null, '1');
INSERT INTO danhgia VALUES ('17', '9', '42', null, '5', 'Bánh phô mai cà phê ăn kèm với trà là hết sảy.', null, '2025-06-30 19:30:00', null, '1');
INSERT INTO danhgia VALUES ('18', '14', '15', null, '1', 'Giao hàng lâu quá làm đá tan hết, uống bị nhạt.', 'Thành thật xin lỗi bạn về vấn đề vận chuyển, shop sẽ làm việc lại với shipper ạ.', '2025-07-01 12:00:00', null, '1');
INSERT INTO danhgia VALUES ('19', '19', '33', null, '5', 'Caramel Macchiato thơm lừng, vẽ hình đẹp.', null, '2025-07-01 14:15:00', null, '1');
INSERT INTO danhgia VALUES ('20', '10', '3', null, '4', 'PhinDi Hạnh Nhân uống bùi bùi khá hay.', 'cảm ơn bạn', '2025-07-01 16:20:00', '2025-12-25 00:46:38', '1');
INSERT INTO danhgia VALUES ('21', '16', '3', null, '5', 'a', null, '2025-12-25 00:47:46', null, '1');

-- ----------------------------
-- Table structure for `donhang`
-- ----------------------------
DROP TABLE IF EXISTS `donhang`;
CREATE TABLE `donhang` (
  `iddonhang` int(11) NOT NULL AUTO_INCREMENT,
  `idnguoidung` int(11) DEFAULT NULL,
  `solongsanpham` int(11) DEFAULT NULL,
  `trangthai` enum('Chờ xác nhận','Đang xử lý','Đã giao','Đã hủy','Đang giao') DEFAULT NULL,
  `tongtien` varchar(255) DEFAULT NULL,
  `diachinhan` varchar(255) DEFAULT NULL,
  `tennguoinhan` varchar(255) DEFAULT NULL,
  `sdtnguoinhan` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`iddonhang`),
  KEY `idnguoidung` (`idnguoidung`),
  CONSTRAINT `donhang_ibfk_1` FOREIGN KEY (`idnguoidung`) REFERENCES `user` (`idnguoidung`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of donhang
-- ----------------------------
INSERT INTO donhang VALUES ('2', '1', '7', 'Đã hủy', '256000', 'Hai baf trung', 'ssd', '32535234', '2024-07-05 15:12:32', '2024-07-22 00:37:42');
INSERT INTO donhang VALUES ('8', '5', '4', 'Đã giao', '128000', 'qưeqwe', 'admin', '1029312093', '2024-07-05 16:01:28', '2024-07-05 16:25:55');
INSERT INTO donhang VALUES ('9', '5', '6', 'Đã hủy', '240000', 'qweqweeqwe', 'qwuehwquie', '975802159', '2024-07-05 16:33:31', '2024-07-05 16:40:11');
INSERT INTO donhang VALUES ('10', '5', '2', 'Đã hủy', '60000', 'qwe', 'qweqwe', '975802159', '2024-07-05 16:37:31', '2024-07-05 16:40:12');
INSERT INTO donhang VALUES ('11', '5', '5', 'Đã giao', '680000', 'qwew', 'asd', '123123123', '2024-07-05 16:42:12', '2024-07-22 00:36:59');
INSERT INTO donhang VALUES ('13', '5', '23', 'Đã giao', '1160000', 'asdasdasd', 'qweqweqw', '123123546', '2024-07-20 23:05:15', '2024-07-20 23:05:43');
INSERT INTO donhang VALUES ('14', '5', '1', 'Đã hủy', '40000', 'n,mcnxz,m', 'm,xcn,zmxc', '19238091238', '2024-07-21 01:21:42', '2024-07-21 01:26:43');
INSERT INTO donhang VALUES ('15', '10', '5', 'Đã hủy', '170000', 'pham ngoc thach', 'minh', '123', '2024-07-22 00:34:58', '2024-07-22 00:37:44');
INSERT INTO donhang VALUES ('18', '10', '3', 'Đã giao', '94000', 'pham ngoc thach', 'minh', '123', '2024-07-22 01:49:22', '2024-07-22 01:53:27');
INSERT INTO donhang VALUES ('19', '10', '3', 'Đã giao', '113000', 'ha noi', 'minh', '123', '2024-07-24 10:33:33', '2024-07-24 10:35:32');
INSERT INTO donhang VALUES ('20', '10', '2', 'Đã giao', '80000', 'b10 pham ngoc thach', 'duc minh', '123456789', '2025-04-19 12:43:49', '2025-04-19 12:45:06');
INSERT INTO donhang VALUES ('21', '10', '2', 'Đang giao', '80000', 'dấd', 'sdsdâ', '01232', '2025-06-18 23:48:41', '2025-12-23 01:41:43');
INSERT INTO donhang VALUES ('22', '5', '2', 'Đã hủy', '99311', 'b10 pham ngoc thach Hà Nội', 'minh', '123456789', '2025-06-23 19:01:18', '2025-06-23 19:01:48');
INSERT INTO donhang VALUES ('23', '5', '2', 'Đã giao', '108311', 'b10 pham ngoc thach Hà Nội', 'minh', '123123', '2025-06-23 19:02:42', '2025-06-23 19:03:12');
INSERT INTO donhang VALUES ('24', '5', '2', 'Đã giao', '90000', 'a ', 'a', '34', '2025-12-09 23:16:29', '2025-12-09 23:17:02');
INSERT INTO donhang VALUES ('25', '16', '1', 'Đã giao', '69864', 'a Bắc Giang', 'phạm anh', '0388930958', '2025-12-15 17:58:40', '2025-12-23 01:50:35');
INSERT INTO donhang VALUES ('26', '18', '1', 'Đang xử lý', '65659', 'a Bạc Liêu', 'a', '3', '2025-12-15 18:25:01', '2025-12-23 01:41:49');
INSERT INTO donhang VALUES ('27', '18', '1', 'Đang xử lý', '73487', 'a Cao Bằng', 'phạm anh', '0388930958', '2025-12-15 18:36:57', '2025-12-23 01:41:50');
INSERT INTO donhang VALUES ('28', '19', '1', 'Chờ xác nhận', '63487', 'a Cao Bằng', 'a', '0388930', '2025-12-17 23:58:31', '2025-12-17 23:58:31');
INSERT INTO donhang VALUES ('29', '19', '1', 'Chờ xác nhận', '71091', 'a Đắk Lắk', 'phạm anh', '0388930958', '2025-12-23 01:08:59', '2025-12-23 01:08:59');
INSERT INTO donhang VALUES ('30', '16', '2', 'Chờ xác nhận', '113483', 'a Nghệ An', 'phạm anh', '0388930958', '2025-12-23 01:43:25', '2025-12-23 01:43:25');

-- ----------------------------
-- Table structure for `donhangchitiet`
-- ----------------------------
DROP TABLE IF EXISTS `donhangchitiet`;
CREATE TABLE `donhangchitiet` (
  `iddonhangchitiet` int(11) NOT NULL AUTO_INCREMENT,
  `iddonhang` int(11) DEFAULT NULL,
  `tensanpham` varchar(255) DEFAULT NULL,
  `price` varchar(100) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `hinhanh` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`iddonhangchitiet`),
  KEY `iddonhang` (`iddonhang`),
  CONSTRAINT `donhangchitiet_ibfk_1` FOREIGN KEY (`iddonhang`) REFERENCES `donhang` (`iddonhang`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of donhangchitiet
-- ----------------------------
INSERT INTO donhangchitiet VALUES ('1', '2', 'bánh bông lan', '40000', '3', 'pictures/banhkem/banhbonglan.jpg', '2024-07-05 15:12:39', '2024-07-05 15:12:39');
INSERT INTO donhangchitiet VALUES ('2', '2', 'bông lan sữa tươi', '34000', '4', 'pictures/banhkem/bonglansuatuoi.jpg', '2024-07-05 15:12:39', '2024-07-05 15:12:39');
INSERT INTO donhangchitiet VALUES ('12', '8', 'bánh kem miếng', '30000', '2', 'pictures/banhkem/banhkemmieng.jpg', '2024-07-05 16:01:28', '2024-07-05 16:01:28');
INSERT INTO donhangchitiet VALUES ('13', '8', 'bông lan sữa tươi', '34000', '2', 'pictures/banhkem/bonglansuatuoi.jpg', '2024-07-05 16:01:28', '2024-07-05 16:01:28');
INSERT INTO donhangchitiet VALUES ('14', '9', 'bánh bông lan', '40000', '6', 'pictures/banhkem/banhbonglan.jpg', '2024-07-05 16:33:31', '2024-07-05 16:33:31');
INSERT INTO donhangchitiet VALUES ('24', '15', 'bánh bông lan', '40000', '2', 'pictures/banhkem/banhbonglan.jpg', '2024-07-22 00:34:58', '2024-07-22 00:34:58');
INSERT INTO donhangchitiet VALUES ('25', '15', 'bánh kem miếng', '30000', '3', 'pictures/banhkem/banhkemmieng.jpg', '2024-07-22 00:34:58', '2024-07-22 00:34:58');
INSERT INTO donhangchitiet VALUES ('28', '18', 'bánh kem miếng', '30000', '2', 'pictures/banhkem/banhkemmieng.jpg', '2024-07-22 01:49:22', '2024-07-22 01:49:22');
INSERT INTO donhangchitiet VALUES ('29', '18', 'bông lan sữa tươi', '34000', '1', 'pictures/banhkem/bonglansuatuoi.jpg', '2024-07-22 01:49:22', '2024-07-22 01:49:22');
INSERT INTO donhangchitiet VALUES ('30', '19', 'bánh bông lan', '40000', '1', 'pictures/banhkem/banhbonglan.jpg', '2024-07-24 10:33:33', '2024-07-24 10:33:33');
INSERT INTO donhangchitiet VALUES ('31', '19', 'bông lan sữa tươi', '34000', '1', 'pictures/banhkem/bonglansuatuoi.jpg', '2024-07-24 10:33:33', '2024-07-24 10:33:33');
INSERT INTO donhangchitiet VALUES ('32', '19', 'bông lan trứng muối', '39000', '1', 'pictures/banhkem/bonglantrungmuoi.jpg', '2024-07-24 10:33:33', '2024-07-24 10:33:33');
INSERT INTO donhangchitiet VALUES ('33', '20', 'bánh bông lan', '40000', '2', 'pictures/banhkem/banhbonglan.jpg', '2025-04-19 12:43:49', '2025-04-19 12:43:49');
INSERT INTO donhangchitiet VALUES ('34', '21', 'bánh bông lan', '40000', '2', 'pictures/banhkem/banhbonglan.jpg', '2025-06-18 23:48:41', '2025-06-18 23:48:41');
INSERT INTO donhangchitiet VALUES ('35', '22', 'PhinDi Hạnh Nhân', '45000', '1', '1750608072935.jpg', '2025-06-23 19:01:18', '2025-06-23 19:01:18');
INSERT INTO donhangchitiet VALUES ('36', '22', 'PhinDi Kem Sữa', '45000', '1', '1750608039551.jpg', '2025-06-23 19:01:18', '2025-06-23 19:01:18');
INSERT INTO donhangchitiet VALUES ('37', '23', 'PhinDi Kem Sữa', '45000', '1', '1750608039551.jpg', '2025-06-23 19:02:42', '2025-06-23 19:02:42');
INSERT INTO donhangchitiet VALUES ('38', '23', 'Trà Thạch Đào', '55000', '1', '1750608422043.jpg', '2025-06-23 19:02:42', '2025-06-23 19:02:42');
INSERT INTO donhangchitiet VALUES ('39', '24', 'PhinDi Kem Sữa', '45000', '1', '1750608039551.jpg', '2025-12-09 23:16:29', '2025-12-09 23:16:29');
INSERT INTO donhangchitiet VALUES ('40', '24', 'PhinDi Hạnh Nhân', '45000', '1', '1750608072935.jpg', '2025-12-09 23:16:29', '2025-12-09 23:16:29');
INSERT INTO donhangchitiet VALUES ('41', '25', 'PhinDi Hạnh Nhân', '45000', '1', '1750608072935.jpg', '2025-12-15 17:58:40', '2025-12-15 17:58:40');
INSERT INTO donhangchitiet VALUES ('42', '26', 'PhinDi Choco', '45000', '1', '1750608122430.jpg', '2025-12-15 18:25:01', '2025-12-15 18:25:01');
INSERT INTO donhangchitiet VALUES ('43', '27', 'Trà Thanh Đào', '55000', '1', '1750608498581.jpg', '2025-12-15 18:36:57', '2025-12-15 18:36:57');
INSERT INTO donhangchitiet VALUES ('44', '28', 'PhinDi Hạnh Nhân', '45000', '1', '1750608072935.jpg', '2025-12-17 23:58:31', '2025-12-17 23:58:31');
INSERT INTO donhangchitiet VALUES ('45', '29', 'PhinDi Hạnh Nhân', '45000', '1', '1750608072935.jpg', '2025-12-23 01:08:59', '2025-12-23 01:08:59');
INSERT INTO donhangchitiet VALUES ('46', '30', 'PhinDi Hạnh Nhân', '45000', '2', '1750608072935.jpg', '2025-12-23 01:43:25', '2025-12-23 01:43:25');

-- ----------------------------
-- Table structure for `sanpham`
-- ----------------------------
DROP TABLE IF EXISTS `sanpham`;
CREATE TABLE `sanpham` (
  `idsp` int(11) NOT NULL AUTO_INCREMENT,
  `tensp` varchar(255) DEFAULT NULL,
  `hinhanh` varchar(255) DEFAULT NULL,
  `soluong` int(11) DEFAULT NULL,
  `idType` int(11) DEFAULT NULL,
  `giaban` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `diem_danh_gia_tb` decimal(3,2) DEFAULT 0.00 COMMENT 'Điểm trung bình (VD: 4.5)',
  `so_luot_danh_gia` int(11) DEFAULT 0 COMMENT 'Đếm số lượt đánh giá',
  PRIMARY KEY (`idsp`),
  KEY `fk_idType` (`idType`),
  CONSTRAINT `fk_idType` FOREIGN KEY (`idType`) REFERENCES `type` (`idType`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of sanpham
-- ----------------------------
INSERT INTO sanpham VALUES ('2', 'PhinDi Kem Sữa', '1750608039551.jpg', '0', '1', '45000', '2024-07-05 15:12:45', '2025-12-09 23:16:51', '0.00', '0');
INSERT INTO sanpham VALUES ('3', 'PhinDi Hạnh Nhân', '1750608072935.jpg', '2', '1', '45000', '2024-07-05 15:12:45', '2025-12-25 00:47:46', '4.50', '2');
INSERT INTO sanpham VALUES ('4', 'PhinDi Choco', '1750608122430.jpg', '11', '1', '45000', '2024-07-05 15:12:45', '2025-06-22 23:02:02', '0.00', '0');
INSERT INTO sanpham VALUES ('11', 'Trà Sen Vàng', '1750608401160.jpg', '12', '2', '55000', '2024-07-05 15:12:45', '2025-06-22 23:06:41', '0.00', '0');
INSERT INTO sanpham VALUES ('12', 'Trà Thạch Đào', '1750608422043.jpg', '11', '2', '55000', '2024-07-05 15:12:45', '2025-06-23 19:03:02', '0.00', '0');
INSERT INTO sanpham VALUES ('13', 'Trà Thanh Đào', '1750608498581.jpg', '12', '2', '55000', '2024-07-05 15:12:45', '2025-06-22 23:08:18', '0.00', '0');
INSERT INTO sanpham VALUES ('14', 'Trà Thạch Vải', '1750609068112.jpg', '12', '2', '55000', '2024-07-05 15:12:45', '2025-06-22 23:17:48', '0.00', '0');
INSERT INTO sanpham VALUES ('15', 'Trà Xanh Đậu Đỏ', '1750609089873.jpg', '12', '2', '55000', '2024-07-05 15:12:45', '2025-06-22 23:18:09', '0.00', '0');
INSERT INTO sanpham VALUES ('19', 'Freeze Trà Xanh', '1750609334762.jpg', '12', '3', '65000', '2024-07-05 15:12:45', '2025-06-22 23:22:14', '0.00', '0');
INSERT INTO sanpham VALUES ('20', 'Freeze Sô-cô-la', '1750610789379.jpg', '12', '3', '59000', '2024-07-05 15:12:45', '2025-06-22 23:46:29', '0.00', '0');
INSERT INTO sanpham VALUES ('21', 'Cookies and Cream', '1750610319090.jpg', '12', '3', '65000', '2024-07-05 15:12:45', '2025-06-22 23:38:39', '0.00', '0');
INSERT INTO sanpham VALUES ('30', 'Phin Đen Đá', '1750610370639.jpg', '12', '12', '29000', '2024-07-05 15:12:45', '2025-06-22 23:40:04', '0.00', '0');
INSERT INTO sanpham VALUES ('31', 'Phin Sữa Đá', '1750610395880.jpg', '12', '12', '29000', '2024-07-05 15:12:45', '2025-06-22 23:39:55', '0.00', '0');
INSERT INTO sanpham VALUES ('32', 'Bạc Xỉu', '1750610422368.jpg', '12', '12', '29000', '2024-07-05 15:12:45', '2025-06-22 23:48:55', '0.00', '0');
INSERT INTO sanpham VALUES ('33', 'Caramel Macchiato', '1750611013895.jpg', '12', '13', '69000', '2024-07-05 15:12:45', '2025-06-22 23:50:13', '0.00', '0');
INSERT INTO sanpham VALUES ('34', 'Mocha Macchiato', '1750611060799.jpg', '12', '13', '69000', '2024-07-05 15:12:45', '2025-06-22 23:51:00', '0.00', '0');
INSERT INTO sanpham VALUES ('35', 'Latte', '1750611099757.jpg', '12', '13', '69000', '2024-07-05 15:12:45', '2025-06-22 23:51:39', '0.00', '0');
INSERT INTO sanpham VALUES ('36', 'Cappuccino', '1750611140976.jpg', '12', '13', '69000', '2024-07-05 15:12:45', '2025-06-22 23:52:20', '0.00', '0');
INSERT INTO sanpham VALUES ('37', 'Americano', '1750611165685.jpg', '12', '13', '69000', '2024-07-05 15:12:45', '2025-06-22 23:52:45', '0.00', '0');
INSERT INTO sanpham VALUES ('38', 'Espresso', '1750611204457.jpg', '12', '13', '45000', '2024-07-05 15:12:45', '2025-06-22 23:53:24', '0.00', '0');
INSERT INTO sanpham VALUES ('39', 'Bánh Chuối', '1750611270927.png', '12', '4', '29000', '2024-07-05 15:12:45', '2025-06-22 23:54:30', '0.00', '0');
INSERT INTO sanpham VALUES ('40', 'Bánh Croissant', '1750611308982.png', '12', '4', '29000', '2024-07-05 15:12:45', '2025-06-22 23:55:08', '0.00', '0');
INSERT INTO sanpham VALUES ('41', 'Mousse Cacao', '1750611349807.png', '12', '4', '35000', '2024-07-05 15:12:45', '2025-06-22 23:58:42', '0.00', '0');
INSERT INTO sanpham VALUES ('42', 'Phô mai cà phê', '1750611574321.jpg', '12', '4', '29000', '2024-07-05 15:12:45', '2025-06-22 23:59:34', '0.00', '0');
INSERT INTO sanpham VALUES ('44', 'Phô mai chanh dây', '1750611588074.jpg', '12', '4', '29000', '2024-07-05 15:12:45', '2025-06-22 23:59:48', '0.00', '0');
INSERT INTO sanpham VALUES ('45', 'Phô mai trà xanh', '1750611596487.png', '12', '4', '35000', '2024-07-05 15:12:45', '2025-06-22 23:59:56', '0.00', '0');
INSERT INTO sanpham VALUES ('81', 'Freeze Caramel', '1750610713032.jpg', '15', '3', '65000', '2025-06-22 23:45:13', '2025-06-22 23:45:13', '0.00', '0');
INSERT INTO sanpham VALUES ('82', 'Classic Phin Freeze', '1750610750510.jpg', '17', '3', '65000', '2025-06-22 23:45:50', '2025-06-22 23:45:50', '0.00', '0');

-- ----------------------------
-- Table structure for `sanphamchitiet`
-- ----------------------------
DROP TABLE IF EXISTS `sanphamchitiet`;
CREATE TABLE `sanphamchitiet` (
  `idspct` int(11) NOT NULL AUTO_INCREMENT,
  `idsp` int(11) DEFAULT NULL,
  `motasanpham` text DEFAULT NULL,
  `thuonghieu` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idspct`),
  KEY `idsp` (`idsp`),
  CONSTRAINT `sanphamchitiet_ibfk_1` FOREIGN KEY (`idsp`) REFERENCES `sanpham` (`idsp`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of sanphamchitiet
-- ----------------------------
INSERT INTO sanphamchitiet VALUES ('2', '2', 'PhinDi Kem Sữa - Cà phê Phin thế hệ mới với chất Phin êm hơn, kết hợp cùng Kem Sữa béo ngậy mang đến hương vị mới lạ, không thể hấp dẫn hơn!', 'Coronar arteriogr-1 cath', '2024-07-05 15:12:53', '2025-06-23 00:05:01');
INSERT INTO sanphamchitiet VALUES ('3', '3', 'PhinDi Hạnh Nhân - Cà phê Phin thế hệ mới với chất Phin êm hơn, kết hợp cùng Hạnh nhân thơm bùi mang đến hương vị mới lạ, không thể hấp dẫn hơn!', 'Puncture of spleen', '2024-07-05 15:12:53', '2025-06-23 00:05:01');
INSERT INTO sanphamchitiet VALUES ('4', '4', 'PhinDi Choco - Cà phê Phin thế hệ mới với chất Phin êm hơn, kết hợp cùng Choco ngọt tan mang đến hương vị mới lạ, không thể hấp dẫn hơn!', 'Close ureter fistula NEC', '2024-07-05 15:12:53', '2025-06-23 00:04:27');
INSERT INTO sanphamchitiet VALUES ('11', '11', 'Thức uống chinh phục những thực khách khó tính! Sự kết hợp độc đáo giữa trà Ô long, hạt sen thơm bùi và củ năng giòn tan. Thêm vào chút sữa sẽ để vị thêm ngọt ngào.', 'General physical exam', '2024-07-05 15:12:53', '2025-06-23 00:06:57');
INSERT INTO sanphamchitiet VALUES ('12', '12', 'Vị trà đậm đà kết hợp cùng những miếng đào thơm ngon mọng nước cùng thạch đào giòn dai. Thêm vào ít sữa để gia tăng vị béo.', 'Periurethral incision', '2024-07-05 15:12:53', '2025-06-23 00:06:57');
INSERT INTO sanphamchitiet VALUES ('13', '13', 'Một trải nghiệm thú vị khác! Sự hài hòa giữa vị trà cao cấp, vị sả thanh mát và những miếng đào thơm ngon mọng nước sẽ mang đến cho bạn một thức uống tuyệt vời.', 'Bilat endosc divis tube', '2024-07-05 15:12:53', '2025-06-23 00:06:57');
INSERT INTO sanphamchitiet VALUES ('14', '14', 'Một sự kết hợp thú vị giữa trà đen, những quả vải thơm ngon và thạch giòn khó cưỡng, mang đến thức uống tuyệt hảo!', 'Repair of ureter NEC', '2024-07-05 15:12:53', '2025-06-23 00:06:57');
INSERT INTO sanphamchitiet VALUES ('15', '15', 'Superficial foreign body of knee', 'Apicoectomy', '2024-07-05 15:12:53', '2024-07-05 15:12:53');
INSERT INTO sanphamchitiet VALUES ('19', '19', 'Thức uống rất được ưa chuộng! Trà xanh thượng hạng từ cao nguyên Việt Nam, kết hợp cùng đá xay, thạch trà dai dai, thơm ngon và một lớp kem dày phủ lên trên vô cùng hấp dẫn. Freeze Trà Xanh thơm ngon, mát lạnh, chinh phục bất cứ ai!', 'Vein inject-scleros agnt', '2024-07-05 15:12:53', '2025-06-23 00:15:14');
INSERT INTO sanphamchitiet VALUES ('20', '20', 'Thiên đường đá xay sô cô la! Từ những thanh sô cô la Việt Nam chất lượng được đem xay với đá cho đến khi mềm mịn, sau đó thêm vào thạch sô cô la dai giòn, ở trên được phủ một lớp kem whip beo béo và sốt sô cô la ngọt ngào. Tạo thành Freeze Sô-cô-la ngon mê mẩn chinh phục bất kì ai!', 'Hymenorrhaphy', '2024-07-05 15:12:53', '2025-06-23 00:15:14');
INSERT INTO sanphamchitiet VALUES ('21', '21', 'Một thức uống ngon lạ miệng bởi sự kết hợp hoàn hảo giữa cookies sô cô la giòn xốp cùng hỗn hợp sữa tươi cùng sữa đặc đem say với đá viên, và cuối cùng không thể thiếu được chính là lớp kem whip mềm mịn cùng cookies sô cô la say nhuyễn.', 'Lower limb artery incis', '2024-07-05 15:12:53', '2025-06-23 00:15:14');
INSERT INTO sanphamchitiet VALUES ('30', '30', 'Hương vị cà phê Việt Nam đích thực! Từng hạt cà phê hảo hạng được chọn bằng tay, phối trộn độc đáo giữa hạt Robusta từ cao nguyên Việt Nam, thêm Arabica thơm lừng. Cà phê được pha từ Phin truyền thống, hoà cùng sữa đặc sánh và thêm vào chút đá tạo nên ly Phin Sữa Đá – Đậm Đà Chất Phin.', 'Opn/oth rep mtrl vlv-tis', '2024-07-05 15:12:53', '2025-06-23 00:19:17');
INSERT INTO sanphamchitiet VALUES ('31', '31', 'Dành cho những tín đồ cà phê đích thực! Hương vị cà phê truyền thống được phối trộn độc đáo tại Highlands. Cà phê đậm đà pha hoàn toàn từ Phin, cho thêm 1 thìa đường, một ít đá viên mát lạnh, tạo nên Phin Đen Đá mang vị cà phê đậm đà chất Phin. ', 'Repair colovagin fistula', '2024-07-05 15:12:53', '2025-06-23 00:19:17');
INSERT INTO sanphamchitiet VALUES ('32', '32', 'Nếu Phin Sữa Đá dành cho các bạn đam mê vị đậm đà, thì Bạc Xỉu Đá là một sự lựa chọn nhẹ “đô\" cà phê nhưng vẫn thơm ngon, chất lừ không kém!', 'Vessel resect/replac NOS', '2024-07-05 15:12:53', '2025-06-23 00:19:17');
INSERT INTO sanphamchitiet VALUES ('33', '33', 'Thỏa mãn cơn thèm ngọt! Ly cà phê Caramel Macchiato bắt đầu từ dòng sữa tươi và lớp bọt sữa béo ngậy, sau đó hòa quyện cùng cà phê espresso đậm đà và sốt caramel ngọt ngào. Thông qua bàn tay điêu luyện của các chuyên gia pha chế, mọi thứ hoàn toàn được nâng tầm thành nghệ thuật! Bạn có thể tùy thích lựa chọn uống nóng hoặc dùng chung với đá.', 'Hip arthroscopy', '2024-07-05 15:12:53', '2025-06-23 00:22:36');
INSERT INTO sanphamchitiet VALUES ('34', '34', 'Một thức uống yêu thích được kết hợp bởi giữa sốt sô cô la ngọt ngào, sữa tươi và đặc biệt là cà phê espresso đậm đà mang thương hiệu Highlands Coffee. Bạn có thể tùy thích lựa chọn uống nóng hoặc dùng chung với đá.', 'Induct labor-rupt memb', '2024-07-05 15:12:53', '2025-06-23 00:22:36');
INSERT INTO sanphamchitiet VALUES ('35', '35', 'Ly cà phê sữa ngọt ngào đến khó quên! Với một chút nhẹ nhàng hơn so với Cappuccino, Latte của chúng tôi bắt đầu với cà phê espresso, sau đó thêm sữa tươi và bọt sữa một cách đầy nghệ thuật. Bạn có thể tùy thích lựa chọn uống nóng hoặc dùng chung với đá.', 'Excision of nipple', '2024-07-05 15:12:53', '2025-06-23 00:22:36');
INSERT INTO sanphamchitiet VALUES ('36', '36', 'Ly cà phê sữa đậm đà thời thượng! Một chút đậm đà hơn so với Latte, Cappuccino của chúng tôi bắt đầu với cà phê espresso, sau đó thêm một lượng tương đương giữa sữa tươi và bọt sữa cho thật hấp dẫn. Bạn có thể tùy thích lựa chọn uống nóng hoặc dùng chung với đá.', 'Parasitology-lower GI', '2024-07-05 15:12:53', '2025-06-23 00:22:36');
INSERT INTO sanphamchitiet VALUES ('37', '37', 'Americano tại Highlands Coffee là sự kết hợp giữa cà phê espresso thêm vào nước đun sôi. Bạn có thể tùy thích lựa chọn uống nóng hoặc dùng chung với đá.', 'Lid marg recon-part thic', '2024-07-05 15:12:53', '2025-06-23 00:22:36');
INSERT INTO sanphamchitiet VALUES ('38', '38', 'Đích thực là ly cà phê espresso ngon đậm đà! Được chiết xuất một cách hoàn hảo từ loại cà phê rang được phối trộn độc đáo từ những hạt cà phê Robusta và Arabica chất lượng hảo hạng.', 'Opn abltn liver les/tiss', '2024-07-05 15:12:53', '2025-06-23 00:22:36');
INSERT INTO sanphamchitiet VALUES ('39', '39', 'Bánh chuối truyền thống, sự kết hợp của 100% chuối tươi và nước cốt dừa Việt Nam.', 'Arthrodesis of shoulder', '2024-07-05 15:12:53', '2025-06-23 00:22:36');
INSERT INTO sanphamchitiet VALUES ('40', '40', 'Thưởng thức bánh croissant giòn tan, thơm ngon tại Highlands Coffee. Được làm từ bột mì cao cấp và bơ tươi, bánh mang đến hương vị Pháp tinh tế. Kết hợp hoàn hảo với ly cà phê đậm đà cho bữa sáng hoặc bữa xế.', 'Allo hem stem ct w purg', '2024-07-05 15:12:53', '2025-06-23 00:22:36');
INSERT INTO sanphamchitiet VALUES ('41', '41', 'Bánh Mousse Ca Cao, là sự kết hợp giữa ca-cao Việt Nam đậm đà cùng kem tươi.', 'Proctotomy', '2024-07-05 15:12:53', '2025-06-23 00:22:36');
INSERT INTO sanphamchitiet VALUES ('42', '42', 'Làm từ cà phê truyền thống của Highlands, kết hợp với phô mai thơm ngon! Chiếc bánh phù hợp đi cùng với bất cứ món cà phê nào!', 'Choledochoenterostomy', '2024-07-05 15:12:53', '2025-06-23 00:22:36');
INSERT INTO sanphamchitiet VALUES ('44', '44', 'Vị béo của phô mai cùng với vị chua của chanh dây, tạo nên chiếc bánh thơm ngon hấp dẫn!', 'Amputation stump revis', '2024-07-05 15:12:53', '2025-06-23 00:22:36');
INSERT INTO sanphamchitiet VALUES ('45', '45', 'Một sự sáng tạo mới mẻ, kết hợp giữa trà xanh đậm đà và phô mai ít béo.', 'Revise lg bowel anastom', '2024-07-05 15:12:53', '2025-06-23 00:22:36');
INSERT INTO sanphamchitiet VALUES ('76', '81', 'Thơm ngon đậm đà! Được kết hợp từ cà phê pha Phin truyền thống chỉ có tại Highlands Coffee, cùng với thạch cà phê và đá xay mát lạnh. Trên cùng là lớp kem tươi thơm béo và bột ca cao đậm đà. Món nước hoàn hảo để khởi đầu câu chuyện cùng bạn bè.', '', '2025-06-22 23:45:13', '2025-06-23 00:19:17');
INSERT INTO sanphamchitiet VALUES ('77', '82', 'Thơm ngon khó cưỡng! Được kết hợp từ cà phê truyền thống chỉ có tại Highlands Coffee, cùng với caramel, thạch cà phê và đá xay mát lạnh. Trên cùng là lớp kem tươi thơm béo và caramel ngọt ngào. Món nước phù hợp trong những cuộc gặp gỡ bạn bè, bởi sự ngọt ngào thường mang mọi người xích lại gần nhau.', '', '2025-06-22 23:45:50', '2025-06-23 00:19:17');

-- ----------------------------
-- Table structure for `shipping`
-- ----------------------------
DROP TABLE IF EXISTS `shipping`;
CREATE TABLE `shipping` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `city` varchar(50) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `created_at` varchar(50) DEFAULT NULL,
  `updated_at` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of shipping
-- ----------------------------
INSERT INTO shipping VALUES ('2', 'An Giang', '15534', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('3', 'Bà Rịa - Vũng Tàu', '20465', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('4', 'Bạc Liêu', '20659', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('5', 'Bắc Giang', '24864', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('6', 'Bắc Kạn', '19462', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('7', 'Bắc Ninh', '21225', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('8', 'Bến Tre', '17662', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('9', 'Bình Dương', '28231', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('10', 'Bình Định', '17975', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('11', 'Bình Phước', '25331', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('12', 'Bình Thuận', '29694', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('13', 'Cà Mau', '19400', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('14', 'Cao Bằng', '18487', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('15', 'Cần Thơ', '28119', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('16', 'Đà Nẵng', '27590', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('17', 'Đắk Lắk', '26091', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('18', 'Đắk Nông', '15971', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('19', 'Điện Biên', '23772', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('20', 'Đồng Nai', '19137', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('21', 'Đồng Tháp', '18618', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('22', 'Gia Lai', '27746', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('23', 'Hà Giang', '15688', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('24', 'Hà Nam', '17423', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('25', 'Hà Nội', '18311', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('26', 'Hà Tĩnh', '25674', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('27', 'Hải Dương', '25879', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('28', 'Hải Phòng', '20035', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('29', 'Hậu Giang', '19958', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('30', 'Hòa Bình', '25535', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('31', 'Hưng Yên', '16363', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('32', 'Khánh Hòa', '28292', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('33', 'Kiên Giang', '22200', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('34', 'Kon Tum', '28631', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('35', 'Lai Châu', '23023', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('36', 'Lạng Sơn', '15389', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('37', 'Lào Cai', '16330', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('38', 'Lâm Đồng', '17563', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('39', 'Long An', '24824', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('40', 'Nam Định', '16898', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('41', 'Nghệ An', '23483', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('42', 'Ninh Bình', '20697', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('43', 'Ninh Thuận', '16088', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('44', 'Phú Thọ', '29266', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('45', 'Phú Yên', '26368', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('46', 'Quảng Bình', '24846', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('47', 'Quảng Nam', '25933', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('48', 'Quảng Ngãi', '23044', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('49', 'Quảng Ninh', '20084', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('50', 'Quảng Trị', '15647', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('51', 'Sóc Trăng', '23590', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('52', 'Sơn La', '18122', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('53', 'Tây Ninh', '26982', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('54', 'Thái Bình', '20153', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('55', 'Thái Nguyên', '26257', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('56', 'Thanh Hóa', '22785', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('57', 'Thừa Thiên Huế', '29730', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('58', 'Tiền Giang', '24175', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('59', 'TP. Hồ Chí Minh', '21126', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('60', 'Trà Vinh', '23067', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('61', 'Tuyên Quang', '23986', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('62', 'Vĩnh Long', '15630', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('63', 'Vĩnh Phúc', '21017', '2025-06-17 00:36:40', '2025-06-17 00:36:40');
INSERT INTO shipping VALUES ('64', 'Yên Bái', '20142', '2025-06-17 00:36:40', '2025-06-17 00:36:40');

-- ----------------------------
-- Table structure for `tintuc`
-- ----------------------------
DROP TABLE IF EXISTS `tintuc`;
CREATE TABLE `tintuc` (
  `idTintuc` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `hinhanh` varchar(255) DEFAULT NULL,
  `day` date DEFAULT NULL,
  `hour` time DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idTintuc`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of tintuc
-- ----------------------------
INSERT INTO tintuc VALUES ('14', 'PHINDI CASSIA - QUẾ ẤM PHIN ÊM, PHONG VỊ ĐỘC ĐÁO', 'Tintuc/tt2.png', '2024-06-14', '16:49:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('15', 'MỪNG QUỐC TẾ THIẾU NHI 1.6 - CÙNG ĐI HIGHLANDS CÓ KEMDI NGON CHO CẢ NHÀ', 'Tintuc/tt3.jpg', '2024-05-30', '16:08:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('16', 'AI SẼ LÀ CHỦ NHÂN CỦA TẤM VÉ MALDIVES ĐẦU TIÊN?', 'Tintuc/tt4.png', '2024-05-15', '22:06:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('17', 'RINH VÉ MALDIVES, RA KHƠI CHILL HÈ CÙNG HIGHLANDS THÔI!', 'Tintuc/tt5.jpg', '2024-05-03', '12:15:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('18', 'CHILL HÈ! CÓ TRÂN CHÂU TRẮNG', 'Tintuc/tt6.jpg', '2024-04-22', '16:44:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('19', 'CHILL HÈ THÊM VUI VỚI BỘ ĐÔI DÂU TẰM: FREEZE KEM MÂY & TRÀ NGỌC TRAI THẬT NGON!', 'Tintuc/tt7.jpg', '2024-04-15', '12:07:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('20', '100% Thắng - Maldives May Mắn Nhiều Tuần', 'Tintuc/tt8.png', '2024-04-09', '14:43:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('21', 'THANH MÁT DÂU TẰM! BỘ ĐÔI FREEZE KEM MÂY & TRÀ NGỌC TRAI ĐÃ CẬP BẾN', 'Tintuc/tt9.jpg', '2024-03-31', '12:00:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('22', '[TẾT MÀ] CHỦ NHÂN SIÊU XE BẠC TỶ ĐÃ LỘ DIỆN', 'Tintuc/tt10.jpg', '2024-02-27', '12:27:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('23', 'LỊCH HOẠT ĐỘNG TẾT NGUYÊN ĐÁN 2024 CỦA HIGHLANDS COFFEE TRÊN TOÀN QUỐC', 'Tintuc/tt11.jpg', '2024-01-25', '11:28:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('24', 'Tết mà! TẶNG VẠN THẺ VÀNG, RƯỚC XE BẠC TỶ', 'Tintuc/tt12.jpg', '2024-01-05', '19:10:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('25', '24 NĂM CHÚNG MÌNH, HIGHLANDS CÓ PHIN SỮA ĐÁ 19K', 'Tintuc/tt13.jpg', '2023-11-03', '14:39:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('26', 'THƠM QUẢ MỌNG, NGỌT ANH ĐÀO! BỘ ĐÔI TRÀ & FREEZE', 'Tintuc/tt14.png', '2023-11-15', '15:42:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('27', 'ĐIỀU KHOẢN SỬ DỤNG ĐỐI VỚI THẺ HIGHLANDS COFFEE', 'Tintuc/tt15.png', '2023-10-26', '19:10:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('28', 'CHƯƠNG TRÌNH THÀNH VIÊN HIGHLANDS COFFEE ĐÃ CHÍNH THỨC CÓ MẶT', 'Tintuc/tt16.png', '2023-10-15', '08:00:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('29', 'KEMDI, THẾ HỆ KEM MỚI CỦA HIGHLANDS COFFEE', 'Tintuc/tt17.jpg', '2023-11-15', '15:42:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('30', 'HIGHLANDS COFFEE MIỄN PHÍ GIAO HÀNG | GỌI NGAY 1900 1755', 'Tintuc/tt18.jpg', '2023-10-09', '22:55:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('31', 'ĐẦU TƯ GẦN 500 TỶ XÂY NHÀ MÁY RANG XAY MỚI CHUẨN QUỐC TẾ, HIGHLANDS COFFEE ĐƯA CÀ PHÊ', 'Tintuc/tt19.jpg', '2023-09-15', '18:04:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('32', '[HIGH-PATCH] HÉ LỘ CẶP ĐÔI MỚI CỦA LY-BIZ', 'Tintuc/tt20.png', '2023-08-04', '00:00:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('33', 'CHILL HÈ HẾT GA CÙNG DEAL LÊN TỚI 40% CỦA HIGHLANDS COFFEE! ☀️', 'Tintuc/tt21.png', '2023-08-04', '00:00:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('34', 'PHINDI HẠT DẺ CƯỜI - HÉ MỞ NỤ CƯỜI!', 'Tintuc/tt22.jpg', '2023-05-17', '12:09:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('35', 'MỚI! TRÀ TUYẾT HIGHLANDS COFFEE', 'Tintuc/tt23.jpg', '2023-09-15', '18:04:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('36', 'TRI ÂN KHÁCH HÀNG – HIGHLANDS COFFEE', 'Tintuc/tt24.jpg', '2023-05-17', '12:09:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('37', 'VỊ COOL SẢNG KHOÁI, TRÀ DƯA HẤU VẢI', 'Tintuc/tt25.jpg', '2023-05-04', '15:37:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');
INSERT INTO tintuc VALUES ('38', 'MẠNH MẼ LÀM ĐIỀU MÌNH YÊU!', 'Tintuc/tt26.png', '2023-05-04', '15:37:00', '2024-07-05 15:12:58', '2024-07-05 15:12:58');

-- ----------------------------
-- Table structure for `type`
-- ----------------------------
DROP TABLE IF EXISTS `type`;
CREATE TABLE `type` (
  `idType` int(11) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idType`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of type
-- ----------------------------
INSERT INTO type VALUES ('1', 'PhinDi', '2024-07-05 15:12:27', '2025-06-22 23:02:14');
INSERT INTO type VALUES ('2', 'Trà', '2024-07-05 15:12:27', '2025-06-22 22:55:27');
INSERT INTO type VALUES ('3', 'Freeze', '2024-07-05 15:12:27', '2025-06-22 22:56:04');
INSERT INTO type VALUES ('4', 'Bánh ngọt', '2024-07-05 15:12:27', '2025-06-22 22:56:16');
INSERT INTO type VALUES ('5', 'Bánh mì que', '2024-07-05 15:12:27', '2025-06-22 22:56:29');
INSERT INTO type VALUES ('12', 'Cà phê phin', '2025-06-22 22:54:58', '2025-06-22 22:54:58');
INSERT INTO type VALUES ('13', 'Espresso', '2025-06-22 22:57:11', '2025-06-22 22:57:11');

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `idnguoidung` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `ten` varchar(255) DEFAULT NULL,
  `tuoi` int(11) DEFAULT NULL,
  `gioitinh` enum('Nam','Nữ','Khác') DEFAULT NULL,
  `ngaysinh` date DEFAULT NULL,
  `sdt` varchar(15) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idnguoidung`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO user VALUES ('1', 'qweqw', 'qweqwe', 'qwe', null, null, null, null, 'Customer', '2024-07-05 15:13:04', '2024-07-05 15:13:04');
INSERT INTO user VALUES ('2', 'test@example.com', '$2a$10$.0pgarriisNKp1QgQ2Taf.sKMe6Mb27z3YLhWJRkTHXfdywS5julK', 'John Doe', null, null, null, null, 'Customer', '2024-07-05 15:13:04', '2024-07-05 15:13:04');
INSERT INTO user VALUES ('5', 'adminadmin@gmail.com', '123123', 'admin', '31', 'Nữ', '2024-07-11', '1231231231', 'Admin', '2024-07-05 15:13:04', '2025-04-19 12:32:17');
INSERT INTO user VALUES ('9', 'ducminh@gmail.com', '$2a$10$7Vcmha92EAM7ei/K8f.9Ve6StT/CYjClOUqesittbJgjkYPgbtK6.', 'ducminh', null, null, null, null, 'Customer', '2024-07-20 23:23:15', '2024-07-20 23:23:15');
INSERT INTO user VALUES ('10', 'minh@gmail.com', '$2a$10$PKd6ROT6y43TOfC2Et79suJMYlwD1bc9ZgTf34VRG.v.LAOOJRdtW', 'minh', null, null, null, null, 'Customer', '2024-07-22 00:33:36', '2024-07-22 00:33:36');
INSERT INTO user VALUES ('13', 'minh123@gmail.com', '123123', 'minh', null, null, null, null, 'Customer', '2025-04-19 11:58:37', '2025-04-19 12:29:56');
INSERT INTO user VALUES ('14', 'dminh@gmail.com', '$2a$10$.hHvKzcpkDXmXA3KZp44IeK.Dlsfj4ckWD8Ipx7tGOfL6igeUcufG', 'minh', null, null, null, null, 'Customer', '2025-04-19 12:30:35', '2025-04-19 12:30:35');
INSERT INTO user VALUES ('15', 'admin@gmail.com', '$2y$10$S.THbzm3/y7vWWMZ6F2gieMlNHqyVWCcWTcIsNn.8gq92DgjwOuNG', 'admin', '22', 'Nam', null, '111111111', 'Admin', '2025-04-19 12:33:21', '2025-06-18 23:57:45');
INSERT INTO user VALUES ('16', 'bintuananh2003@gmail.com', '$2a$10$r4Z7bih8s4MJbbI/HJVdoeXV/rTRDkcfvFPnm.ybDmA4Zj8QEd9y6', 'tuananh', null, null, null, null, 'Admin', '2025-12-15 17:42:57', '2025-12-15 19:02:55');
INSERT INTO user VALUES ('17', null, null, null, null, null, null, null, 'Customer', '2025-12-15 18:00:23', '2025-12-15 18:14:16');
INSERT INTO user VALUES ('18', 'phamanh04112003@gmail.com', '$2a$10$Wu39dlzrxeMH413HBPP6vOntZMQ7EBc58yjgzPOW24NlRzGbj5pQC', 'anh', null, null, null, null, 'Customer', '2025-12-15 18:14:27', '2025-12-15 18:14:27');
INSERT INTO user VALUES ('19', 'nghia.mt1505@gmail.com', '$2a$10$klAGt5ijeENrwYWO3458wO0qvQ5vHQLqatIY7eof0J.aCcc6ShFEG', 'nghia', null, null, null, null, 'Customer', '2025-12-17 23:58:02', '2025-12-17 23:58:02');

-- ----------------------------
-- Table structure for `vouchers`
-- ----------------------------
DROP TABLE IF EXISTS `vouchers`;
CREATE TABLE `vouchers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  `expires_at` varchar(50) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `used_count` int(11) DEFAULT NULL,
  `created_at` varchar(50) DEFAULT NULL,
  `updated_at` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of vouchers
-- ----------------------------
INSERT INTO vouchers VALUES ('1', 'Ưu đãi chào mừng', 'WELCOME10', 'Giảm 10% cho đơn đầu tiên', 'percent', '10', '2025-12-31 23:59:59', '100', '0', '2025-06-17 00:00:44', '2025-06-17 00:00:44');
INSERT INTO vouchers VALUES ('2', 'Giảm giá cố định 50k', 'FIXED50K', 'Giảm 50.000đ cho đơn hàng từ 500.000đ', 'fixed', '50000', '2025-10-01 23:59:59', '200', '0', '2025-06-17 00:00:44', '2025-06-17 00:00:44');
INSERT INTO vouchers VALUES ('3', 'Khuyến mãi đặc biệt', 'SALE20', 'Giảm 20% cho các đơn hàng đặc biệt', 'percent', '20', '2025-08-15 23:59:59', '50', '0', '2025-06-17 00:00:44', '2025-06-17 00:00:44');
INSERT INTO vouchers VALUES ('4', 'Miễn phí vận chuyển', 'FREESHIP', 'Giảm 30.000đ phí vận chuyển', 'fixed', '30000', '', null, '0', '2025-06-17 00:00:44', '2025-06-17 00:00:44');
INSERT INTO vouchers VALUES ('5', 'Ưu đãi mùa hè', 'SUMMER25', 'Ưu đãi hè giảm 25%', 'percent', '25', '2025-07-31 23:59:59', '150', '0', '2025-06-17 00:00:44', '2025-06-17 00:00:44');
INSERT INTO vouchers VALUES ('6', 'Voucher VIP', 'VIPCUSTOMER', 'Giảm 100.000đ cho khách hàng VIP', 'fixed', '100000', '', '10', '0', '2025-06-17 00:00:44', '2025-06-17 00:00:44');
INSERT INTO vouchers VALUES ('7', 'Black Friday', 'BLACKFRIDAY', 'Black Friday giảm 50%', 'percent', '50', '2025-11-29 23:59:59', '500', '0', '2025-06-17 00:00:44', '2025-06-17 00:00:44');
INSERT INTO vouchers VALUES ('8', 'Giáng sinh an lành', 'XMAS30', 'Giáng sinh giảm 30%', 'percent', '30', '2025-12-26 23:59:59', '300', '0', '2025-06-17 00:00:44', '2025-06-17 00:00:44');
INSERT INTO vouchers VALUES ('9', 'Khung giờ vàng', 'FLASH100K', 'Giảm 100.000đ trong khung giờ vàng', 'fixed', '100000', '2025-06-30 23:59:59', '50', '0', '2025-06-17 00:00:44', '2025-06-17 00:00:44');
INSERT INTO vouchers VALUES ('10', 'May mắn số 7', 'LUCKY7', 'Giảm 70.000đ cho 70 người may mắn', 'fixed', '70000', '2025-07-07 23:59:59', '70', '0', '2025-06-17 00:00:44', '2025-06-17 00:00:44');
