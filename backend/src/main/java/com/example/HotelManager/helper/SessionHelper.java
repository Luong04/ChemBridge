package com.example.HotelManager.helper;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class SessionHelper {
    
    public boolean isUserLoggedIn(HttpSession session) {
        Boolean loggedIn = (Boolean) session.getAttribute("logged_in");
        return loggedIn != null && loggedIn;
    }
    
    public Integer getCurrentUserId(HttpSession session) {
        return (Integer) session.getAttribute("user_id");
    }
    
    public String getCurrentUserName(HttpSession session) {
        return (String) session.getAttribute("user_name");
    }
    
    public ResponseEntity<?> createUnauthorizedResponse() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body("Vui lòng đăng nhập để truy cập chức năng này");
    }
    
    public ResponseEntity<?> checkAuthenticationAndExecute(HttpSession session, AuthenticatedAction action) {
        if (!isUserLoggedIn(session)) {
            return createUnauthorizedResponse();
        }
        
        try {
            return action.execute();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi hệ thống: " + e.getMessage());
        }
    }
    
    @FunctionalInterface
    public interface AuthenticatedAction {
        ResponseEntity<?> execute() throws Exception;
    }
}
