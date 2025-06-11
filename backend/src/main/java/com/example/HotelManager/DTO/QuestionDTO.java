package com.example.HotelManager.DTO;

import java.util.List;
import com.example.HotelManager.DTO.OptionDTO;

public class QuestionDTO {
    private int questionId;
    private int questionListId;
    private String question;
    private List<OptionDTO> optionDTOs;

    // Getter và Setter cho questionId
    public int getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

    // Getter và Setter cho questionListId
    public int getQuestionListId() {
        return questionListId;
    }

    public void setQuestionListId(int questionListId) {
        this.questionListId = questionListId;
    }

    // Getter và Setter cho question
    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    // Getter và Setter cho options
    public List<OptionDTO> getOptions() {
        return optionDTOs;
    }

    public void setOptions(List<OptionDTO> optionDTOs) {
        this.optionDTOs = optionDTOs;
    }
}
