package com.example.HotelManager.Service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.HotelManager.Repository.UserRepository;

import jakarta.transaction.Transactional;

import com.example.HotelManager.Entity.User;

@Service
@Transactional
public class UserServiceImp implements UserService {
    @Autowired
    private UserRepository userRepo;
    
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Override
    public boolean check_existed(String username) {
        Optional<User> userOptional = userRepo.findByUserName(username);
        return userOptional.isPresent();
    }
    
    @Override
    public User saveUser(User user) {
        // Mã hóa mật khẩu trước khi lưu
        System.out.print("user: "+user);
        String encryptedPass = passwordEncoder.encode(user.getUser_password());
        user.setUser_password(encryptedPass);
        return userRepo.save(user);
    }
    
    @Override
    public User authenticateUser(String username, String password) {
        Optional<User> userOpt = userRepo.findByUserName(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getUser_password())) {
                return user;
            }
        }
        return null;
    }
    
    @Override
    public Optional<User> getUserByUsername(String username) {
        return userRepo.findByUserName(username);
    }
    
    @Override
    public void removeUserById(int id) {
        userRepo.deleteById(id);
    }
    
    @Override
    public Optional<User> getUserById(int id) {
        return userRepo.findById(id);
    }
}
