-- Cấp quyền truy cập cho user 'root' từ mọi host (%)
-- Cực kỳ hữu ích cho môi trường dev/test, nhưng với production
-- bạn nên cân nhắc tạo một user chuyên biệt với quyền hạn tối thiểu cần thiết
-- và chỉ định host cụ thể thay vì '%'.

-- Quan trọng: Lệnh này cập nhật user 'root'@'localhost' và tạo user 'root'@'%'
-- đảm bảo nó có thể kết nối từ bất kỳ địa chỉ IP nào trong Docker network.
ALTER USER 'root'@'localhost' IDENTIFIED BY 'LuongLuvWinnerX2004';
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'LuongLuvWinnerX2004';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- Nếu bạn gặp lỗi xác thực với MySQL 8+ và driver cũ, có thể cần dòng sau:
-- ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'LuongLuvWinnerX2004';
-- FLUSH PRIVILEGES;
