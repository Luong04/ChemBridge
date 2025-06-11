# Stage 1: Build the React application
FROM node:18-alpine AS build

# Đặt thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json để tận dụng Docker cache
COPY package.json ./
COPY package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn của bạn
COPY . .

# Build React application cho production
# Sử dụng --production để đảm bảo các biến môi trường trong .env.production được đưa vào build
ENV NODE_ENV production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:latest

# Xóa file cấu hình Nginx mặc định
RUN rm /etc/nginx/conf.d/default.conf

# Copy file cấu hình Nginx tùy chỉnh của bạn
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy các file build của React từ stage 'build' vào thư mục phục vụ của Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Mở cổng 80 để Nginx phục vụ
EXPOSE 80

# Lệnh để Nginx chạy ở foreground
CMD ["nginx", "-g", "daemon off;"]