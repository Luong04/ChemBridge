Hướng dẫn triển khai web:
Trước tiên nhớ mở cổng 8080 và 80 nhá
1, Khi chuyển sang máy mới, cần xem lại địa chỉ IP, các khu vực chứa địa chỉ bao gồm
Frontend: tệp userApi, axiosClient
Backend: application.properties, SecurityConfig.java
2, Dùng các lệnh sau để chạy docker (nhớ cài môi trường docker compose rồi)
- docker compose up --build -d (lệnh này nếu bỏ --build sẽ chỉ bật docker lên chứ không chạy lại từ đầu)
- docker compose down (lệnh này nếu thêm flag -v sẽ xóa cả volumn nữa)
- docker compose ps (kiểm tra các container đang chạy)
3, Sau khi docker chạy thành công, chèn dữ liệu vào database:
- docker cp /backend/src/main/resource/database.sql mysql_db:/database.sql (copy tệp sql từ máy vào trong container)
- docker exec -it mysql_db bash (lệnh này để vào bash của container mysql_db)
- mysql -u root -p chembridge < database.sql (lệnh này để chạy file database.sql vào trong bảng chembridge)
- Done
