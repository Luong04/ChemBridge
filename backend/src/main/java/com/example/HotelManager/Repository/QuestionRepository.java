package com.example.HotelManager.Repository;

import com.example.HotelManager.Entity.Question;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
   List<Question> findByQuestionListId(int listId);
}
