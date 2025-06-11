package com.example.HotelManager.DTO;

import java.util.List;


public class QuizSubmissionDTO {
    private int questionListId;
    private List<AnswerDTO> answers;

    // Constructors
    public QuizSubmissionDTO() {}

    public QuizSubmissionDTO(int questionListId, List<AnswerDTO> answers) {
        this.questionListId = questionListId;
        this.answers = answers;
    }

    // Getters and Setters
    public int getQuestionListId() {
        return questionListId;
    }

    public void setQuestionListId(int questionListId) {
        this.questionListId = questionListId;
    }

    public List<AnswerDTO> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerDTO> answers) {
        this.answers = answers;
    }

    public static class AnswerDTO {
        private int questionId;
        private int selectedOption;

        // Constructors
        public AnswerDTO() {}

        public AnswerDTO(int questionId, int selectedOption) {
            this.questionId = questionId;
            this.selectedOption = selectedOption;
        }

        // Getters and Setters
        public int getQuestionId() {
            return questionId;
        }

        public void setQuestionId(int questionId) {
            this.questionId = questionId;
        }

        public int getSelectedOption() {
            return selectedOption;
        }

        public void setSelectedOption(int selectedOption) {
            this.selectedOption = selectedOption;
        }
    }
}