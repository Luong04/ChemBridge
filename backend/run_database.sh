#!/bin/bash

# Thông tin kết nối MySQL
MYSQL_HOST="127.0.0.1"
MYSQL_PORT="3306"
MYSQL_USER="root"
MYSQL_PASSWORD="LuongLuvWinnerX2004"
DATABASE="chembridge"
SQL_FILE="src/main/resources/database.sql"

# Kiểm tra file database.sql tồn tại
if [ ! -f "$SQL_FILE" ]; then
    echo "Lỗi: File $SQL_FILE không tồn tại!"
    exit 1
fi

# Kiểm tra MySQL có đang chạy không
if ! mysqladmin -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD status > /dev/null 2>&1; then
    echo "Lỗi: Không thể kết nối đến MySQL. Vui lòng kiểm tra MySQL đang chạy và thông tin đăng nhập!"
    exit 1
fi

# Chạy file database.sql
echo "Đang thực thi $SQL_FILE vào database $DATABASE..."
mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD -e "source $SQL_FILE"

if [ $? -eq 0 ]; then
    echo "Lỗi: Thực thi $SQL_FILE thất bại!"
    exit 1
else
    echo "Thành công: Database đã được khởi tạo từ $SQL_FILE!"
fi