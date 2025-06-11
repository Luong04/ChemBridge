package com.example.HotelManager.Repository;

import com.example.HotelManager.Entity.Option;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OptionRepository extends JpaRepository<Option, Integer> {
   List<Option> findOptionByQuestionId(int questionId);
}
