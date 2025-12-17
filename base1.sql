-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: foodstore
-- ------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `donhang`
--

DROP TABLE IF EXISTS `donhang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donhang` (
  `iddonhang` int NOT NULL AUTO_INCREMENT,
  `idnguoidung` int DEFAULT NULL,
  `solongsanpham` int DEFAULT NULL,
  `trangthai` enum('Chờ xác nhận','Đang xử lý','Đã giao','Đã hủy','Đang giao') DEFAULT NULL,
  `tongtien` varchar(255) DEFAULT NULL,
  `diachinhan` varchar(255) DEFAULT NULL,
  `tennguoinhan` varchar(255) DEFAULT NULL,
  `sdtnguoinhan` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`iddonhang`),
  KEY `idnguoidung` (`idnguoidung`),
  CONSTRAINT `donhang_ibfk_1` FOREIGN KEY (`idnguoidung`) REFERENCES `user` (`idnguoidung`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donhang`
--

LOCK TABLES `donhang` WRITE;
/*!40000 ALTER TABLE `donhang` DISABLE KEYS */;
INSERT INTO `donhang` VALUES (2,1,7,'Đã hủy','256000','Hai baf trung','ssd','32535234','2024-07-05 08:12:32','2024-07-21 17:37:42'),(8,5,4,'Đã giao','128000','qưeqwe','admin','1029312093','2024-07-05 09:01:28','2024-07-05 09:25:55'),(9,5,6,'Đã hủy','240000','qweqweeqwe','qwuehwquie','975802159','2024-07-05 09:33:31','2024-07-05 09:40:11'),(10,5,2,'Đã hủy','60000','qwe','qweqwe','975802159','2024-07-05 09:37:31','2024-07-05 09:40:12'),(11,5,5,'Đã giao','680000','qwew','asd','123123123','2024-07-05 09:42:12','2024-07-21 17:36:59'),(13,5,23,'Đã giao','1160000','asdasdasd','qweqweqw','123123546','2024-07-20 16:05:15','2024-07-20 16:05:43'),(14,5,1,'Đã hủy','40000','n,mcnxz,m','m,xcn,zmxc','19238091238','2024-07-20 18:21:42','2024-07-20 18:26:43'),(15,10,5,'Đã hủy','170000','pham ngoc thach','minh','123','2024-07-21 17:34:58','2024-07-21 17:37:44'),(18,10,3,'Đã giao','94000','pham ngoc thach','minh','123','2024-07-21 18:49:22','2024-07-21 18:53:27'),(19,10,3,'Đã giao','113000','ha noi','minh','123','2024-07-24 03:33:33','2024-07-24 03:35:32'),(20,10,2,'Đã giao','80000','b10 pham ngoc thach','duc minh','123456789','2025-04-19 05:43:49','2025-04-19 05:45:06'),(21,10,2,'Đang xử lý','80000','dấd','sdsdâ','01232','2025-06-18 16:48:41','2025-06-23 12:02:47'),(22,5,2,'Đã hủy','99311','b10 pham ngoc thach Hà Nội','minh','123456789','2025-06-23 12:01:18','2025-06-23 12:01:48'),(23,5,2,'Đã giao','108311','b10 pham ngoc thach Hà Nội','minh','123123','2025-06-23 12:02:42','2025-06-23 12:03:12'),(24,5,2,'Đã giao','90000','a ','a','34','2025-12-09 16:16:29','2025-12-09 16:17:02');
/*!40000 ALTER TABLE `donhang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donhangchitiet`
--

DROP TABLE IF EXISTS `donhangchitiet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donhangchitiet` (
  `iddonhangchitiet` int NOT NULL AUTO_INCREMENT,
  `iddonhang` int DEFAULT NULL,
  `tensanpham` varchar(255) DEFAULT NULL,
  `price` varchar(100) DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  `hinhanh` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`iddonhangchitiet`),
  KEY `iddonhang` (`iddonhang`),
  CONSTRAINT `donhangchitiet_ibfk_1` FOREIGN KEY (`iddonhang`) REFERENCES `donhang` (`iddonhang`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donhangchitiet`
--

LOCK TABLES `donhangchitiet` WRITE;
/*!40000 ALTER TABLE `donhangchitiet` DISABLE KEYS */;
INSERT INTO `donhangchitiet` VALUES (1,2,'bánh bông lan','40000',3,'pictures/banhkem/banhbonglan.jpg','2024-07-05 08:12:39','2024-07-05 08:12:39'),(2,2,'bông lan sữa tươi','34000',4,'pictures/banhkem/bonglansuatuoi.jpg','2024-07-05 08:12:39','2024-07-05 08:12:39'),(12,8,'bánh kem miếng','30000',2,'pictures/banhkem/banhkemmieng.jpg','2024-07-05 09:01:28','2024-07-05 09:01:28'),(13,8,'bông lan sữa tươi','34000',2,'pictures/banhkem/bonglansuatuoi.jpg','2024-07-05 09:01:28','2024-07-05 09:01:28'),(14,9,'bánh bông lan','40000',6,'pictures/banhkem/banhbonglan.jpg','2024-07-05 09:33:31','2024-07-05 09:33:31'),(24,15,'bánh bông lan','40000',2,'pictures/banhkem/banhbonglan.jpg','2024-07-21 17:34:58','2024-07-21 17:34:58'),(25,15,'bánh kem miếng','30000',3,'pictures/banhkem/banhkemmieng.jpg','2024-07-21 17:34:58','2024-07-21 17:34:58'),(28,18,'bánh kem miếng','30000',2,'pictures/banhkem/banhkemmieng.jpg','2024-07-21 18:49:22','2024-07-21 18:49:22'),(29,18,'bông lan sữa tươi','34000',1,'pictures/banhkem/bonglansuatuoi.jpg','2024-07-21 18:49:22','2024-07-21 18:49:22'),(30,19,'bánh bông lan','40000',1,'pictures/banhkem/banhbonglan.jpg','2024-07-24 03:33:33','2024-07-24 03:33:33'),(31,19,'bông lan sữa tươi','34000',1,'pictures/banhkem/bonglansuatuoi.jpg','2024-07-24 03:33:33','2024-07-24 03:33:33'),(32,19,'bông lan trứng muối','39000',1,'pictures/banhkem/bonglantrungmuoi.jpg','2024-07-24 03:33:33','2024-07-24 03:33:33'),(33,20,'bánh bông lan','40000',2,'pictures/banhkem/banhbonglan.jpg','2025-04-19 05:43:49','2025-04-19 05:43:49'),(34,21,'bánh bông lan','40000',2,'pictures/banhkem/banhbonglan.jpg','2025-06-18 16:48:41','2025-06-18 16:48:41'),(35,22,'PhinDi Hạnh Nhân','45000',1,'1750608072935.jpg','2025-06-23 12:01:18','2025-06-23 12:01:18'),(36,22,'PhinDi Kem Sữa','45000',1,'1750608039551.jpg','2025-06-23 12:01:18','2025-06-23 12:01:18'),(37,23,'PhinDi Kem Sữa','45000',1,'1750608039551.jpg','2025-06-23 12:02:42','2025-06-23 12:02:42'),(38,23,'Trà Thạch Đào','55000',1,'1750608422043.jpg','2025-06-23 12:02:42','2025-06-23 12:02:42'),(39,24,'PhinDi Kem Sữa','45000',1,'1750608039551.jpg','2025-12-09 16:16:29','2025-12-09 16:16:29'),(40,24,'PhinDi Hạnh Nhân','45000',1,'1750608072935.jpg','2025-12-09 16:16:29','2025-12-09 16:16:29');
/*!40000 ALTER TABLE `donhangchitiet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sanpham`
--

DROP TABLE IF EXISTS `sanpham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sanpham` (
  `idsp` int NOT NULL AUTO_INCREMENT,
  `tensp` varchar(255) DEFAULT NULL,
  `hinhanh` varchar(255) DEFAULT NULL,
  `soluong` int DEFAULT NULL,
  `idType` int DEFAULT NULL,
  `giaban` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idsp`),
  KEY `fk_idType` (`idType`),
  CONSTRAINT `fk_idType` FOREIGN KEY (`idType`) REFERENCES `type` (`idType`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sanpham`
--

LOCK TABLES `sanpham` WRITE;
/*!40000 ALTER TABLE `sanpham` DISABLE KEYS */;
INSERT INTO `sanpham` VALUES (2,'PhinDi Kem Sữa','1750608039551.jpg',0,1,'45000','2024-07-05 08:12:45','2025-12-09 16:16:51'),(3,'PhinDi Hạnh Nhân','1750608072935.jpg',3,1,'45000','2024-07-05 08:12:45','2025-12-09 16:16:51'),(4,'PhinDi Choco','1750608122430.jpg',11,1,'45000','2024-07-05 08:12:45','2025-06-22 16:02:02'),(11,'Trà Sen Vàng','1750608401160.jpg',12,2,'55000','2024-07-05 08:12:45','2025-06-22 16:06:41'),(12,'Trà Thạch Đào','1750608422043.jpg',11,2,'55000','2024-07-05 08:12:45','2025-06-23 12:03:02'),(13,'Trà Thanh Đào','1750608498581.jpg',12,2,'55000','2024-07-05 08:12:45','2025-06-22 16:08:18'),(14,'Trà Thạch Vải','1750609068112.jpg',12,2,'55000','2024-07-05 08:12:45','2025-06-22 16:17:48'),(15,'Trà Xanh Đậu Đỏ','1750609089873.jpg',12,2,'55000','2024-07-05 08:12:45','2025-06-22 16:18:09'),(19,'Freeze Trà Xanh','1750609334762.jpg',12,3,'65000','2024-07-05 08:12:45','2025-06-22 16:22:14'),(20,'Freeze Sô-cô-la','1750610789379.jpg',12,3,'59000','2024-07-05 08:12:45','2025-06-22 16:46:29'),(21,'Cookies and Cream','1750610319090.jpg',12,3,'65000','2024-07-05 08:12:45','2025-06-22 16:38:39'),(30,'Phin Đen Đá','1750610370639.jpg',12,12,'29000','2024-07-05 08:12:45','2025-06-22 16:40:04'),(31,'Phin Sữa Đá','1750610395880.jpg',12,12,'29000','2024-07-05 08:12:45','2025-06-22 16:39:55'),(32,'Bạc Xỉu','1750610422368.jpg',12,12,'29000','2024-07-05 08:12:45','2025-06-22 16:48:55'),(33,'Caramel Macchiato','1750611013895.jpg',12,13,'69000','2024-07-05 08:12:45','2025-06-22 16:50:13'),(34,'Mocha Macchiato','1750611060799.jpg',12,13,'69000','2024-07-05 08:12:45','2025-06-22 16:51:00'),(35,'Latte','1750611099757.jpg',12,13,'69000','2024-07-05 08:12:45','2025-06-22 16:51:39'),(36,'Cappuccino','1750611140976.jpg',12,13,'69000','2024-07-05 08:12:45','2025-06-22 16:52:20'),(37,'Americano','1750611165685.jpg',12,13,'69000','2024-07-05 08:12:45','2025-06-22 16:52:45'),(38,'Espresso','1750611204457.jpg',12,13,'45000','2024-07-05 08:12:45','2025-06-22 16:53:24'),(39,'Bánh Chuối','1750611270927.png',12,4,'29000','2024-07-05 08:12:45','2025-06-22 16:54:30'),(40,'Bánh Croissant','1750611308982.png',12,4,'29000','2024-07-05 08:12:45','2025-06-22 16:55:08'),(41,'Mousse Cacao','1750611349807.png',12,4,'35000','2024-07-05 08:12:45','2025-06-22 16:58:42'),(42,'Phô mai cà phê','1750611574321.jpg',12,4,'29000','2024-07-05 08:12:45','2025-06-22 16:59:34'),(44,'Phô mai chanh dây','1750611588074.jpg',12,4,'29000','2024-07-05 08:12:45','2025-06-22 16:59:48'),(45,'Phô mai trà xanh','1750611596487.png',12,4,'35000','2024-07-05 08:12:45','2025-06-22 16:59:56'),(81,'Freeze Caramel','1750610713032.jpg',15,3,'65000','2025-06-22 16:45:13','2025-06-22 16:45:13'),(82,'Classic Phin Freeze','1750610750510.jpg',17,3,'65000','2025-06-22 16:45:50','2025-06-22 16:45:50');
/*!40000 ALTER TABLE `sanpham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sanphamchitiet`
--

DROP TABLE IF EXISTS `sanphamchitiet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sanphamchitiet` (
  `idspct` int NOT NULL AUTO_INCREMENT,
  `idsp` int DEFAULT NULL,
  `motasanpham` text,
  `thuonghieu` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idspct`),
  KEY `idsp` (`idsp`),
  CONSTRAINT `sanphamchitiet_ibfk_1` FOREIGN KEY (`idsp`) REFERENCES `sanpham` (`idsp`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sanphamchitiet`
--

LOCK TABLES `sanphamchitiet` WRITE;
/*!40000 ALTER TABLE `sanphamchitiet` DISABLE KEYS */;
INSERT INTO `sanphamchitiet` VALUES (2,2,'PhinDi Kem Sữa - Cà phê Phin thế hệ mới với chất Phin êm hơn, kết hợp cùng Kem Sữa béo ngậy mang đến hương vị mới lạ, không thể hấp dẫn hơn!','Coronar arteriogr-1 cath','2024-07-05 08:12:53','2025-06-22 17:05:01'),(3,3,'PhinDi Hạnh Nhân - Cà phê Phin thế hệ mới với chất Phin êm hơn, kết hợp cùng Hạnh nhân thơm bùi mang đến hương vị mới lạ, không thể hấp dẫn hơn!','Puncture of spleen','2024-07-05 08:12:53','2025-06-22 17:05:01'),(4,4,'PhinDi Choco - Cà phê Phin thế hệ mới với chất Phin êm hơn, kết hợp cùng Choco ngọt tan mang đến hương vị mới lạ, không thể hấp dẫn hơn!','Close ureter fistula NEC','2024-07-05 08:12:53','2025-06-22 17:04:27'),(11,11,'Thức uống chinh phục những thực khách khó tính! Sự kết hợp độc đáo giữa trà Ô long, hạt sen thơm bùi và củ năng giòn tan. Thêm vào chút sữa sẽ để vị thêm ngọt ngào.','General physical exam','2024-07-05 08:12:53','2025-06-22 17:06:57'),(12,12,'Vị trà đậm đà kết hợp cùng những miếng đào thơm ngon mọng nước cùng thạch đào giòn dai. Thêm vào ít sữa để gia tăng vị béo.','Periurethral incision','2024-07-05 08:12:53','2025-06-22 17:06:57'),(13,13,'Một trải nghiệm thú vị khác! Sự hài hòa giữa vị trà cao cấp, vị sả thanh mát và những miếng đào thơm ngon mọng nước sẽ mang đến cho bạn một thức uống tuyệt vời.','Bilat endosc divis tube','2024-07-05 08:12:53','2025-06-22 17:06:57'),(14,14,'Một sự kết hợp thú vị giữa trà đen, những quả vải thơm ngon và thạch giòn khó cưỡng, mang đến thức uống tuyệt hảo!','Repair of ureter NEC','2024-07-05 08:12:53','2025-06-22 17:06:57'),(15,15,'Superficial foreign body of knee','Apicoectomy','2024-07-05 08:12:53','2024-07-05 08:12:53'),(19,19,'Thức uống rất được ưa chuộng! Trà xanh thượng hạng từ cao nguyên Việt Nam, kết hợp cùng đá xay, thạch trà dai dai, thơm ngon và một lớp kem dày phủ lên trên vô cùng hấp dẫn. Freeze Trà Xanh thơm ngon, mát lạnh, chinh phục bất cứ ai!','Vein inject-scleros agnt','2024-07-05 08:12:53','2025-06-22 17:15:14'),(20,20,'Thiên đường đá xay sô cô la! Từ những thanh sô cô la Việt Nam chất lượng được đem xay với đá cho đến khi mềm mịn, sau đó thêm vào thạch sô cô la dai giòn, ở trên được phủ một lớp kem whip beo béo và sốt sô cô la ngọt ngào. Tạo thành Freeze Sô-cô-la ngon mê mẩn chinh phục bất kì ai!','Hymenorrhaphy','2024-07-05 08:12:53','2025-06-22 17:15:14'),(21,21,'Một thức uống ngon lạ miệng bởi sự kết hợp hoàn hảo giữa cookies sô cô la giòn xốp cùng hỗn hợp sữa tươi cùng sữa đặc đem say với đá viên, và cuối cùng không thể thiếu được chính là lớp kem whip mềm mịn cùng cookies sô cô la say nhuyễn.','Lower limb artery incis','2024-07-05 08:12:53','2025-06-22 17:15:14'),(30,30,'Hương vị cà phê Việt Nam đích thực! Từng hạt cà phê hảo hạng được chọn bằng tay, phối trộn độc đáo giữa hạt Robusta từ cao nguyên Việt Nam, thêm Arabica thơm lừng. Cà phê được pha từ Phin truyền thống, hoà cùng sữa đặc sánh và thêm vào chút đá tạo nên ly Phin Sữa Đá – Đậm Đà Chất Phin.','Opn/oth rep mtrl vlv-tis','2024-07-05 08:12:53','2025-06-22 17:19:17'),(31,31,'Dành cho những tín đồ cà phê đích thực! Hương vị cà phê truyền thống được phối trộn độc đáo tại Highlands. Cà phê đậm đà pha hoàn toàn từ Phin, cho thêm 1 thìa đường, một ít đá viên mát lạnh, tạo nên Phin Đen Đá mang vị cà phê đậm đà chất Phin. ','Repair colovagin fistula','2024-07-05 08:12:53','2025-06-22 17:19:17'),(32,32,'Nếu Phin Sữa Đá dành cho các bạn đam mê vị đậm đà, thì Bạc Xỉu Đá là một sự lựa chọn nhẹ “đô\" cà phê nhưng vẫn thơm ngon, chất lừ không kém!','Vessel resect/replac NOS','2024-07-05 08:12:53','2025-06-22 17:19:17'),(33,33,'Thỏa mãn cơn thèm ngọt! Ly cà phê Caramel Macchiato bắt đầu từ dòng sữa tươi và lớp bọt sữa béo ngậy, sau đó hòa quyện cùng cà phê espresso đậm đà và sốt caramel ngọt ngào. Thông qua bàn tay điêu luyện của các chuyên gia pha chế, mọi thứ hoàn toàn được nâng tầm thành nghệ thuật! Bạn có thể tùy thích lựa chọn uống nóng hoặc dùng chung với đá.','Hip arthroscopy','2024-07-05 08:12:53','2025-06-22 17:22:36'),(34,34,'Một thức uống yêu thích được kết hợp bởi giữa sốt sô cô la ngọt ngào, sữa tươi và đặc biệt là cà phê espresso đậm đà mang thương hiệu Highlands Coffee. Bạn có thể tùy thích lựa chọn uống nóng hoặc dùng chung với đá.','Induct labor-rupt memb','2024-07-05 08:12:53','2025-06-22 17:22:36'),(35,35,'Ly cà phê sữa ngọt ngào đến khó quên! Với một chút nhẹ nhàng hơn so với Cappuccino, Latte của chúng tôi bắt đầu với cà phê espresso, sau đó thêm sữa tươi và bọt sữa một cách đầy nghệ thuật. Bạn có thể tùy thích lựa chọn uống nóng hoặc dùng chung với đá.','Excision of nipple','2024-07-05 08:12:53','2025-06-22 17:22:36'),(36,36,'Ly cà phê sữa đậm đà thời thượng! Một chút đậm đà hơn so với Latte, Cappuccino của chúng tôi bắt đầu với cà phê espresso, sau đó thêm một lượng tương đương giữa sữa tươi và bọt sữa cho thật hấp dẫn. Bạn có thể tùy thích lựa chọn uống nóng hoặc dùng chung với đá.','Parasitology-lower GI','2024-07-05 08:12:53','2025-06-22 17:22:36'),(37,37,'Americano tại Highlands Coffee là sự kết hợp giữa cà phê espresso thêm vào nước đun sôi. Bạn có thể tùy thích lựa chọn uống nóng hoặc dùng chung với đá.','Lid marg recon-part thic','2024-07-05 08:12:53','2025-06-22 17:22:36'),(38,38,'Đích thực là ly cà phê espresso ngon đậm đà! Được chiết xuất một cách hoàn hảo từ loại cà phê rang được phối trộn độc đáo từ những hạt cà phê Robusta và Arabica chất lượng hảo hạng.','Opn abltn liver les/tiss','2024-07-05 08:12:53','2025-06-22 17:22:36'),(39,39,'Bánh chuối truyền thống, sự kết hợp của 100% chuối tươi và nước cốt dừa Việt Nam.','Arthrodesis of shoulder','2024-07-05 08:12:53','2025-06-22 17:22:36'),(40,40,'Thưởng thức bánh croissant giòn tan, thơm ngon tại Highlands Coffee. Được làm từ bột mì cao cấp và bơ tươi, bánh mang đến hương vị Pháp tinh tế. Kết hợp hoàn hảo với ly cà phê đậm đà cho bữa sáng hoặc bữa xế.','Allo hem stem ct w purg','2024-07-05 08:12:53','2025-06-22 17:22:36'),(41,41,'Bánh Mousse Ca Cao, là sự kết hợp giữa ca-cao Việt Nam đậm đà cùng kem tươi.','Proctotomy','2024-07-05 08:12:53','2025-06-22 17:22:36'),(42,42,'Làm từ cà phê truyền thống của Highlands, kết hợp với phô mai thơm ngon! Chiếc bánh phù hợp đi cùng với bất cứ món cà phê nào!','Choledochoenterostomy','2024-07-05 08:12:53','2025-06-22 17:22:36'),(44,44,'Vị béo của phô mai cùng với vị chua của chanh dây, tạo nên chiếc bánh thơm ngon hấp dẫn!','Amputation stump revis','2024-07-05 08:12:53','2025-06-22 17:22:36'),(45,45,'Một sự sáng tạo mới mẻ, kết hợp giữa trà xanh đậm đà và phô mai ít béo.','Revise lg bowel anastom','2024-07-05 08:12:53','2025-06-22 17:22:36'),(76,81,'Thơm ngon đậm đà! Được kết hợp từ cà phê pha Phin truyền thống chỉ có tại Highlands Coffee, cùng với thạch cà phê và đá xay mát lạnh. Trên cùng là lớp kem tươi thơm béo và bột ca cao đậm đà. Món nước hoàn hảo để khởi đầu câu chuyện cùng bạn bè.','','2025-06-22 16:45:13','2025-06-22 17:19:17'),(77,82,'Thơm ngon khó cưỡng! Được kết hợp từ cà phê truyền thống chỉ có tại Highlands Coffee, cùng với caramel, thạch cà phê và đá xay mát lạnh. Trên cùng là lớp kem tươi thơm béo và caramel ngọt ngào. Món nước phù hợp trong những cuộc gặp gỡ bạn bè, bởi sự ngọt ngào thường mang mọi người xích lại gần nhau.','','2025-06-22 16:45:50','2025-06-22 17:19:17');
/*!40000 ALTER TABLE `sanphamchitiet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping`
--

DROP TABLE IF EXISTS `shipping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping` (
  `id` int NOT NULL AUTO_INCREMENT,
  `city` varchar(50) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `created_at` varchar(50) DEFAULT NULL,
  `updated_at` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping`
--

LOCK TABLES `shipping` WRITE;
/*!40000 ALTER TABLE `shipping` DISABLE KEYS */;
INSERT INTO `shipping` VALUES (2,'An Giang',15534,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(3,'Bà Rịa - Vũng Tàu',20465,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(4,'Bạc Liêu',20659,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(5,'Bắc Giang',24864,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(6,'Bắc Kạn',19462,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(7,'Bắc Ninh',21225,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(8,'Bến Tre',17662,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(9,'Bình Dương',28231,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(10,'Bình Định',17975,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(11,'Bình Phước',25331,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(12,'Bình Thuận',29694,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(13,'Cà Mau',19400,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(14,'Cao Bằng',18487,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(15,'Cần Thơ',28119,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(16,'Đà Nẵng',27590,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(17,'Đắk Lắk',26091,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(18,'Đắk Nông',15971,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(19,'Điện Biên',23772,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(20,'Đồng Nai',19137,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(21,'Đồng Tháp',18618,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(22,'Gia Lai',27746,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(23,'Hà Giang',15688,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(24,'Hà Nam',17423,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(25,'Hà Nội',18311,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(26,'Hà Tĩnh',25674,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(27,'Hải Dương',25879,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(28,'Hải Phòng',20035,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(29,'Hậu Giang',19958,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(30,'Hòa Bình',25535,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(31,'Hưng Yên',16363,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(32,'Khánh Hòa',28292,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(33,'Kiên Giang',22200,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(34,'Kon Tum',28631,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(35,'Lai Châu',23023,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(36,'Lạng Sơn',15389,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(37,'Lào Cai',16330,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(38,'Lâm Đồng',17563,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(39,'Long An',24824,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(40,'Nam Định',16898,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(41,'Nghệ An',23483,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(42,'Ninh Bình',20697,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(43,'Ninh Thuận',16088,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(44,'Phú Thọ',29266,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(45,'Phú Yên',26368,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(46,'Quảng Bình',24846,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(47,'Quảng Nam',25933,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(48,'Quảng Ngãi',23044,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(49,'Quảng Ninh',20084,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(50,'Quảng Trị',15647,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(51,'Sóc Trăng',23590,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(52,'Sơn La',18122,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(53,'Tây Ninh',26982,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(54,'Thái Bình',20153,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(55,'Thái Nguyên',26257,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(56,'Thanh Hóa',22785,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(57,'Thừa Thiên Huế',29730,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(58,'Tiền Giang',24175,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(59,'TP. Hồ Chí Minh',21126,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(60,'Trà Vinh',23067,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(61,'Tuyên Quang',23986,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(62,'Vĩnh Long',15630,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(63,'Vĩnh Phúc',21017,'2025-06-17 00:36:40','2025-06-17 00:36:40'),(64,'Yên Bái',20142,'2025-06-17 00:36:40','2025-06-17 00:36:40');
/*!40000 ALTER TABLE `shipping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tintuc`
--

DROP TABLE IF EXISTS `tintuc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tintuc` (
  `idTintuc` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `hinhanh` varchar(255) DEFAULT NULL,
  `day` date DEFAULT NULL,
  `hour` time DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idTintuc`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tintuc`
--

LOCK TABLES `tintuc` WRITE;
/*!40000 ALTER TABLE `tintuc` DISABLE KEYS */;
INSERT INTO `tintuc` VALUES (14,'PHINDI CASSIA - QUẾ ẤM PHIN ÊM, PHONG VỊ ĐỘC ĐÁO','Tintuc/tt2.png','2024-06-14','16:49:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(15,'MỪNG QUỐC TẾ THIẾU NHI 1.6 - CÙNG ĐI HIGHLANDS CÓ KEMDI NGON CHO CẢ NHÀ','Tintuc/tt3.jpg','2024-05-30','16:08:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(16,'AI SẼ LÀ CHỦ NHÂN CỦA TẤM VÉ MALDIVES ĐẦU TIÊN?','Tintuc/tt4.png','2024-05-15','22:06:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(17,'RINH VÉ MALDIVES, RA KHƠI CHILL HÈ CÙNG HIGHLANDS THÔI!','Tintuc/tt5.jpg','2024-05-03','12:15:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(18,'CHILL HÈ! CÓ TRÂN CHÂU TRẮNG','Tintuc/tt6.jpg','2024-04-22','16:44:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(19,'CHILL HÈ THÊM VUI VỚI BỘ ĐÔI DÂU TẰM: FREEZE KEM MÂY & TRÀ NGỌC TRAI THẬT NGON!','Tintuc/tt7.jpg','2024-04-15','12:07:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(20,'100% Thắng - Maldives May Mắn Nhiều Tuần','Tintuc/tt8.png','2024-04-09','14:43:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(21,'THANH MÁT DÂU TẰM! BỘ ĐÔI FREEZE KEM MÂY & TRÀ NGỌC TRAI ĐÃ CẬP BẾN','Tintuc/tt9.jpg','2024-03-31','12:00:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(22,'[TẾT MÀ] CHỦ NHÂN SIÊU XE BẠC TỶ ĐÃ LỘ DIỆN','Tintuc/tt10.jpg','2024-02-27','12:27:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(23,'LỊCH HOẠT ĐỘNG TẾT NGUYÊN ĐÁN 2024 CỦA HIGHLANDS COFFEE TRÊN TOÀN QUỐC','Tintuc/tt11.jpg','2024-01-25','11:28:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(24,'Tết mà! TẶNG VẠN THẺ VÀNG, RƯỚC XE BẠC TỶ','Tintuc/tt12.jpg','2024-01-05','19:10:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(25,'24 NĂM CHÚNG MÌNH, HIGHLANDS CÓ PHIN SỮA ĐÁ 19K','Tintuc/tt13.jpg','2023-11-03','14:39:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(26,'THƠM QUẢ MỌNG, NGỌT ANH ĐÀO! BỘ ĐÔI TRÀ & FREEZE','Tintuc/tt14.png','2023-11-15','15:42:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(27,'ĐIỀU KHOẢN SỬ DỤNG ĐỐI VỚI THẺ HIGHLANDS COFFEE','Tintuc/tt15.png','2023-10-26','19:10:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(28,'CHƯƠNG TRÌNH THÀNH VIÊN HIGHLANDS COFFEE ĐÃ CHÍNH THỨC CÓ MẶT','Tintuc/tt16.png','2023-10-15','08:00:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(29,'KEMDI, THẾ HỆ KEM MỚI CỦA HIGHLANDS COFFEE','Tintuc/tt17.jpg','2023-11-15','15:42:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(30,'HIGHLANDS COFFEE MIỄN PHÍ GIAO HÀNG | GỌI NGAY 1900 1755','Tintuc/tt18.jpg','2023-10-09','22:55:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(31,'ĐẦU TƯ GẦN 500 TỶ XÂY NHÀ MÁY RANG XAY MỚI CHUẨN QUỐC TẾ, HIGHLANDS COFFEE ĐƯA CÀ PHÊ','Tintuc/tt19.jpg','2023-09-15','18:04:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(32,'[HIGH-PATCH] HÉ LỘ CẶP ĐÔI MỚI CỦA LY-BIZ','Tintuc/tt20.png','2023-08-04','00:00:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(33,'CHILL HÈ HẾT GA CÙNG DEAL LÊN TỚI 40% CỦA HIGHLANDS COFFEE! ☀️','Tintuc/tt21.png','2023-08-04','00:00:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(34,'PHINDI HẠT DẺ CƯỜI - HÉ MỞ NỤ CƯỜI!','Tintuc/tt22.jpg','2023-05-17','12:09:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(35,'MỚI! TRÀ TUYẾT HIGHLANDS COFFEE','Tintuc/tt23.jpg','2023-09-15','18:04:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(36,'TRI ÂN KHÁCH HÀNG – HIGHLANDS COFFEE','Tintuc/tt24.jpg','2023-05-17','12:09:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(37,'VỊ COOL SẢNG KHOÁI, TRÀ DƯA HẤU VẢI','Tintuc/tt25.jpg','2023-05-04','15:37:00','2024-07-05 08:12:58','2024-07-05 08:12:58'),(38,'MẠNH MẼ LÀM ĐIỀU MÌNH YÊU!','Tintuc/tt26.png','2023-05-04','15:37:00','2024-07-05 08:12:58','2024-07-05 08:12:58');
/*!40000 ALTER TABLE `tintuc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type`
--

DROP TABLE IF EXISTS `type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type` (
  `idType` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idType`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type`
--

LOCK TABLES `type` WRITE;
/*!40000 ALTER TABLE `type` DISABLE KEYS */;
INSERT INTO `type` VALUES (1,'PhinDi','2024-07-05 08:12:27','2025-06-22 16:02:14'),(2,'Trà','2024-07-05 08:12:27','2025-06-22 15:55:27'),(3,'Freeze','2024-07-05 08:12:27','2025-06-22 15:56:04'),(4,'Bánh ngọt','2024-07-05 08:12:27','2025-06-22 15:56:16'),(5,'Bánh mì que','2024-07-05 08:12:27','2025-06-22 15:56:29'),(12,'Cà phê phin','2025-06-22 15:54:58','2025-06-22 15:54:58'),(13,'Espresso','2025-06-22 15:57:11','2025-06-22 15:57:11');
/*!40000 ALTER TABLE `type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `idnguoidung` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `ten` varchar(255) DEFAULT NULL,
  `tuoi` int DEFAULT NULL,
  `gioitinh` enum('Nam','Nữ','Khác') DEFAULT NULL,
  `ngaysinh` date DEFAULT NULL,
  `sdt` varchar(15) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idnguoidung`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'qweqw','qweqwe','qwe',NULL,NULL,NULL,NULL,'Customer','2024-07-05 08:13:04','2024-07-05 08:13:04'),(2,'test@example.com','$2a$10$.0pgarriisNKp1QgQ2Taf.sKMe6Mb27z3YLhWJRkTHXfdywS5julK','John Doe',NULL,NULL,NULL,NULL,'Customer','2024-07-05 08:13:04','2024-07-05 08:13:04'),(5,'adminadmin@gmail.com','123123','admin',31,'Nữ','2024-07-11','1231231231','Admin','2024-07-05 08:13:04','2025-04-19 05:32:17'),(9,'ducminh@gmail.com','$2a$10$7Vcmha92EAM7ei/K8f.9Ve6StT/CYjClOUqesittbJgjkYPgbtK6.','ducminh',NULL,NULL,NULL,NULL,'Customer','2024-07-20 16:23:15','2024-07-20 16:23:15'),(10,'minh@gmail.com','$2a$10$PKd6ROT6y43TOfC2Et79suJMYlwD1bc9ZgTf34VRG.v.LAOOJRdtW','minh',NULL,NULL,NULL,NULL,'Customer','2024-07-21 17:33:36','2024-07-21 17:33:36'),(13,'minh123@gmail.com','123123','minh',NULL,NULL,NULL,NULL,'Customer','2025-04-19 04:58:37','2025-04-19 05:29:56'),(14,'dminh@gmail.com','$2a$10$.hHvKzcpkDXmXA3KZp44IeK.Dlsfj4ckWD8Ipx7tGOfL6igeUcufG','minh',NULL,NULL,NULL,NULL,'Customer','2025-04-19 05:30:35','2025-04-19 05:30:35'),(15,'admin@gmail.com','$2y$10$S.THbzm3/y7vWWMZ6F2gieMlNHqyVWCcWTcIsNn.8gq92DgjwOuNG','admin',22,'Nam',NULL,'111111111','Admin','2025-04-19 05:33:21','2025-06-18 16:57:45');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vouchers`
--

DROP TABLE IF EXISTS `vouchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vouchers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `value` int DEFAULT NULL,
  `expires_at` varchar(50) DEFAULT NULL,
  `usage_limit` int DEFAULT NULL,
  `used_count` int DEFAULT NULL,
  `created_at` varchar(50) DEFAULT NULL,
  `updated_at` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vouchers`
--

LOCK TABLES `vouchers` WRITE;
/*!40000 ALTER TABLE `vouchers` DISABLE KEYS */;
INSERT INTO `vouchers` VALUES (1,'Ưu đãi chào mừng','WELCOME10','Giảm 10% cho đơn đầu tiên','percent',10,'2025-12-31 23:59:59',100,0,'2025-06-17 00:00:44','2025-06-17 00:00:44'),(2,'Giảm giá cố định 50k','FIXED50K','Giảm 50.000đ cho đơn hàng từ 500.000đ','fixed',50000,'2025-10-01 23:59:59',200,0,'2025-06-17 00:00:44','2025-06-17 00:00:44'),(3,'Khuyến mãi đặc biệt','SALE20','Giảm 20% cho các đơn hàng đặc biệt','percent',20,'2025-08-15 23:59:59',50,0,'2025-06-17 00:00:44','2025-06-17 00:00:44'),(4,'Miễn phí vận chuyển','FREESHIP','Giảm 30.000đ phí vận chuyển','fixed',30000,'',NULL,0,'2025-06-17 00:00:44','2025-06-17 00:00:44'),(5,'Ưu đãi mùa hè','SUMMER25','Ưu đãi hè giảm 25%','percent',25,'2025-07-31 23:59:59',150,0,'2025-06-17 00:00:44','2025-06-17 00:00:44'),(6,'Voucher VIP','VIPCUSTOMER','Giảm 100.000đ cho khách hàng VIP','fixed',100000,'',10,0,'2025-06-17 00:00:44','2025-06-17 00:00:44'),(7,'Black Friday','BLACKFRIDAY','Black Friday giảm 50%','percent',50,'2025-11-29 23:59:59',500,0,'2025-06-17 00:00:44','2025-06-17 00:00:44'),(8,'Giáng sinh an lành','XMAS30','Giáng sinh giảm 30%','percent',30,'2025-12-26 23:59:59',300,0,'2025-06-17 00:00:44','2025-06-17 00:00:44'),(9,'Khung giờ vàng','FLASH100K','Giảm 100.000đ trong khung giờ vàng','fixed',100000,'2025-06-30 23:59:59',50,0,'2025-06-17 00:00:44','2025-06-17 00:00:44'),(10,'May mắn số 7','LUCKY7','Giảm 70.000đ cho 70 người may mắn','fixed',70000,'2025-07-07 23:59:59',70,0,'2025-06-17 00:00:44','2025-06-17 00:00:44');
/*!40000 ALTER TABLE `vouchers` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;