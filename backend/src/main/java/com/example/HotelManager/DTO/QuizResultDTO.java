package com.example.HotelManager.DTO;

import java.util.List;

public class QuizResultDTO {
    private int correctCount;
    private int totalQuestions;
    private double percentage;
    private List<QuestionResultDTO> questionResults;

    // Constructors
    public QuizResultDTO() {}

    public QuizResultDTO(int correctCount, int totalQuestions, double percentage, List<QuestionResultDTO> questionResults) {
        this.correctCount = correctCount;
        this.totalQuestions = totalQuestions;
        this.percentage = percentage;
        this.questionResults = questionResults;
    }

    // Getters and Setters
    public int getCorrectCount() {
        return correctCount;
    }

    public void setCorrectCount(int correctCount) {
        this.correctCount = correctCount;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    public List<QuestionResultDTO> getQuestionResults() {
        return questionResults;
    }

    public void setQuestionResults(List<QuestionResultDTO> questionResults) {
        this.questionResults = questionResults;
    }

    public static class QuestionResultDTO {
        private int questionId;
        private int userAnswer;
        private int correctAnswer;
        private boolean isCorrect;

        // Constructors
        public QuestionResultDTO() {}

        public QuestionResultDTO(int questionId, int userAnswer, int correctAnswer, boolean isCorrect) {
            this.questionId = questionId;
            this.userAnswer = userAnswer;
            this.correctAnswer = correctAnswer;
            this.isCorrect = isCorrect;
        }

        // Getters and Setters
        public int getQuestionId() {
            return questionId;
        }

        public void setQuestionId(int questionId) {
            this.questionId = questionId;
        }

        public int getUserAnswer() {
            return userAnswer;
        }

        public void setUserAnswer(int userAnswer) {
            this.userAnswer = userAnswer;
        }

        public int getCorrectAnswer() {
            return correctAnswer;
        }

        public void setCorrectAnswer(int correctAnswer) {
            this.correctAnswer = correctAnswer;
        }

        public boolean isCorrect() {
            return isCorrect;
        }

        public void setCorrect(boolean correct) {
            isCorrect = correct;
        }
    }
}
