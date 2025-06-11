package com.example.HotelManager.Repository;

import com.example.HotelManager.Entity.QuestionList;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface QuestionListRepository extends JpaRepository<QuestionList, Integer> {
//    @Query("SELECT p FROM BookingEntity p WHERE p.guest_id = :guestId")
//    List<BookingEntity> findByGuestID(String guestId);

}
