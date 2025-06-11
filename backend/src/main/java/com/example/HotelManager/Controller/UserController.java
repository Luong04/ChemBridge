package com.example.HotelManager.Controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.HotelManager.Service.UserService;
import com.example.HotelManager.Service.UserService.UserInput;
import com.example.HotelManager.Service.UserService.LoginRequest;
import com.example.HotelManager.Entity.User;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    private HashMap<String, User> check_valid = new HashMap<>();

    @PostMapping(value = "/register")
    public ResponseEntity<?> createUser(@RequestBody User userRequest) {
        // Kiểm tra username đã tồn tại
        System.out.println("Call here");
        if (userService.check_existed(userRequest.getUser_name())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Tên người dùng đã tồn tại");
        }

        // Kiểm tra dữ liệu đầu vào
        if (userRequest.getUser_name() == null || userRequest.getUser_name().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Tên người dùng không được để trống");
        }

        if (userRequest.getUser_password() == null || userRequest.getUser_password().length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Mật khẩu phải có ít nhất 6 ký tự");
        }

        try {
            User savedUser = userService.saveUser(userRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Đăng ký tài khoản thành công",
                    "user_id", savedUser.getId(),
                    "user_name", savedUser.getUser_name()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi đăng ký: " + e.getMessage());
        }
    }

    @PostMapping(value = "/register/validation")
    public ResponseEntity<?> validation(@RequestBody UserInput user_input) {
        String input = user_input.userInput();

        if (check_valid.containsKey(input)) {
            User u = check_valid.get(input);
            check_valid.remove(input);
            User savedUser = userService.saveUser(u);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Đăng ký tài khoản thành công",
                    "user_id", savedUser.getId()));
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Mã xác thực không tồn tại");
    }

    @PostMapping(value = "/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        // Kiểm tra dữ liệu đầu vào
        System.out.println("Nhận yêu cầu đăng nhập: " + loginRequest);
        if (loginRequest.user_name() == null || loginRequest.user_password() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Tên người dùng và mật khẩu không được để trống");
        }

        try {
            User user = userService.authenticateUser(
                    loginRequest.user_name(),
                    loginRequest.user_password());

            if (user != null) {
                // Lưu thông tin user vào session
                session.setAttribute("user_id", user.getId());
                session.setAttribute("user_name", user.getUser_name());
                session.setAttribute("full_name", user.getFull_name());
                session.setAttribute("email", user.getEmail());
                session.setAttribute("phone", user.getPhone());
                session.setAttribute("logged_in", true);
                session.setAttribute("login_time", System.currentTimeMillis());

                // Set session timeout (30 phút)
                session.setMaxInactiveInterval(120 * 60);

                return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                        "message", "Đăng nhập thành công",
                        "user", Map.of(
                                "id", user.getId(),
                                "user_name", user.getUser_name(),
                                "full_name", user.getFull_name(),
                                "email", user.getEmail(),
                                "phone", user.getPhone()),
                        "session_id", session.getId()));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Tên người dùng hoặc mật khẩu không đúng");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi đăng nhập: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        try {
            // Lấy thông tin user trước khi xóa session
            String userName = (String) session.getAttribute("user_name");

            // Hủy session
            session.invalidate();

            return ResponseEntity.ok(Map.of(
                    "message", "Đăng xuất thành công",
                    "user_name", userName != null ? userName : "Unknown"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi đăng xuất: " + e.getMessage());
        }
    }

    @GetMapping(value = "/profile")
    public ResponseEntity<?> getUserProfile(HttpSession session) {
        // Kiểm tra session
        Boolean loggedIn = (Boolean) session.getAttribute("logged_in");
        if (loggedIn == null || !loggedIn) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Vui lòng đăng nhập để xem thông tin cá nhân");
        }

        return ResponseEntity.ok(Map.of(
                "user_id", session.getAttribute("user_id"),
                "user_name", session.getAttribute("user_name"),
                "full_name", session.getAttribute("full_name"),
                "email", session.getAttribute("email"),
                "phone", session.getAttribute("phone"),
                "login_time", session.getAttribute("login_time")));
    }

    @PutMapping(value = "/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody User userUpdate, HttpSession session) {
        // Kiểm tra session
        Boolean loggedIn = (Boolean) session.getAttribute("logged_in");
        if (loggedIn == null || !loggedIn) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Vui lòng đăng nhập để cập nhật thông tin");
        }

        try {
            Integer userId = (Integer) session.getAttribute("user_id");
            Optional<User> userOpt = userService.getUserById(userId);

            if (userOpt.isPresent()) {
                User existingUser = userOpt.get();

                // Cập nhật thông tin (không cho phép thay đổi username)
                if (userUpdate.getFull_name() != null) {
                    existingUser.setFull_name(userUpdate.getFull_name());
                }
                if (userUpdate.getPhone() != null) {
                    existingUser.setPhone(userUpdate.getPhone());
                }
                if (userUpdate.getEmail() != null) {
                    existingUser.setEmail(userUpdate.getEmail());
                }

                // Nếu có mật khẩu mới
                if (userUpdate.getUser_password() != null && !userUpdate.getUser_password().isEmpty()) {
                    if (userUpdate.getUser_password().length() < 6) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("Mật khẩu phải có ít nhất 6 ký tự");
                    }
                    existingUser.setUser_password(userUpdate.getUser_password());
                }

                User updatedUser = userService.saveUser(existingUser);

                // Cập nhật lại session
                session.setAttribute("full_name", updatedUser.getFull_name());
                session.setAttribute("email", updatedUser.getEmail());
                session.setAttribute("phone", updatedUser.getPhone());

                return ResponseEntity.ok(Map.of(
                        "message", "Cập nhật thông tin thành công",
                        "user", Map.of(
                                "id", updatedUser.getId(),
                                "user_name", updatedUser.getUser_name(),
                                "full_name", updatedUser.getFull_name(),
                                "email", updatedUser.getEmail(),
                                "phone", updatedUser.getPhone())));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Không tìm thấy thông tin người dùng");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi cập nhật thông tin: " + e.getMessage());
        }
    }

    @GetMapping(value = "/session/check")
    public ResponseEntity<?> checkSession(HttpSession session) {
        System.out.println("Nhận yêu cầu kiểm tra session: sessionId=" + session.getId());
        Boolean loggedIn = (Boolean) session.getAttribute("logged_in");

        if (loggedIn != null && loggedIn) {
            Long loginTime = (Long) session.getAttribute("login_time");
            long currentTime = System.currentTimeMillis();
            long sessionDuration = currentTime - (loginTime != null ? loginTime : currentTime);

            return ResponseEntity.ok(Map.of(
                    "logged_in", true,
                    "user_id", session.getAttribute("user_id"),
                    "user_name", session.getAttribute("user_name"),
                    "full_name", session.getAttribute("full_name"),
                    "email", session.getAttribute("email"),
                    "phone", session.getAttribute("phone"),
                    "session_id", session.getId(),
                    "session_duration_minutes", sessionDuration / (1000 * 60),
                    "max_inactive_interval", session.getMaxInactiveInterval()));
        } else {
            System.out.println("Session không hợp lệ");
            return ResponseEntity.ok(Map.of(
                    "logged_in", false,
                    "message", "Chưa đăng nhập hoặc phiên đã hết hạn"));
        }
    }

    @GetMapping(value = "/home")
    public ResponseEntity<?> homepage(HttpSession session) {
        Boolean loggedIn = (Boolean) session.getAttribute("logged_in");

        if (loggedIn != null && loggedIn) {
            String userName = (String) session.getAttribute("user_name");
            String fullName = (String) session.getAttribute("full_name");

            return ResponseEntity.ok(Map.of(
                    "message", "Chào mừng đến trang chủ!",
                    "user_name", userName,
                    "full_name", fullName != null ? fullName : userName));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Vui lòng đăng nhập để truy cập trang chủ");
    }

    @DeleteMapping(value = "/account/delete")
    public ResponseEntity<?> deleteAccount(HttpSession session) {
        // Kiểm tra session
        Boolean loggedIn = (Boolean) session.getAttribute("logged_in");
        if (loggedIn == null || !loggedIn) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Vui lòng đăng nhập để thực hiện thao tác này");
        }

        try {
            Integer userId = (Integer) session.getAttribute("user_id");
            String userName = (String) session.getAttribute("user_name");

            userService.removeUserById(userId);

            // Hủy session sau khi xóa tài khoản
            session.invalidate();

            return ResponseEntity.ok(Map.of(
                    "message", "Xóa tài khoản thành công",
                    "deleted_user", userName));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi xóa tài khoản: " + e.getMessage());
        }
    }
}