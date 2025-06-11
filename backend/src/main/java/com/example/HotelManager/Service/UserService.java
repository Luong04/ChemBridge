package com.example.HotelManager.Service;

import com.example.HotelManager.Entity.User;
import java.util.Optional;

public interface UserService {
    boolean check_existed(String username);
    User saveUser(User user);
    void removeUserById(int id);
    Optional<User> getUserById(int id);
    User authenticateUser(String username, String password);
    Optional<User> getUserByUsername(String username);
    
    // Records cho input
    public record UserInput(String userInput) {}
    public record LoginRequest(String user_name, String user_password) {}
}