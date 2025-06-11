# Stage 1: Build the Spring Boot application
# Sử dụng một OpenJDK image với Maven hoặc Gradle để build ứng dụng
FROM openjdk:17-jdk-slim AS build

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy Maven/Gradle Wrapper (nếu có) và pom.xml/build.gradle để tận dụng Docker cache
COPY pom.xml .
# COPY gradle/ gradle/
# COPY gradlew .
# COPY settings.gradle .
# COPY build.gradle .

# Copy mã nguồn của bạn
COPY src ./src

# Build the application - điều này sẽ tạo ra một fat JAR (JAR có chứa tất cả dependencies)
# Nếu dùng Maven:
RUN mvn clean install -DskipTests
# Nếu dùng Gradle:
# RUN gradle clean build -x test

# Stage 2: Create the final image
# Sử dụng một OpenJDK image nhỏ hơn cho production
FROM openjdk:17-jdk-slim

# Đặt thư mục làm việc
WORKDIR /app

# Expose cổng mà Spring Boot app sẽ chạy
EXPOSE 8080

# Copy JAR file từ stage 'build'
# Đảm bảo đường dẫn này khớp với tên JAR file của bạn (thường ở target/ hoặc build/libs/)
# Thay 'your-application-name-0.0.1-SNAPSHOT.jar' bằng tên JAR thực tế của bạn
# Tìm tên JAR bằng cách chạy 'mvn clean install' (hoặc 'gradle build') trên máy cục bộ và kiểm tra thư mục 'target' hoặc 'build/libs'
COPY --from=build /app/target/*.jar app.jar
# Hoặc nếu dùng Gradle, có thể là:
# COPY --from=build /app/build/libs/*.jar app.jar

# Command để chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
