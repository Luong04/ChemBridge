package com.example.HotelManager.Service;

import com.example.HotelManager.DTO.OptionDTO;
import com.example.HotelManager.DTO.QuestionDTO;
import com.example.HotelManager.DTO.QuizResultDTO;
import com.example.HotelManager.DTO.QuizSubmissionDTO;
import com.example.HotelManager.Entity.Option;
import com.example.HotelManager.Entity.Question;
import com.example.HotelManager.Entity.QuestionList;
import com.example.HotelManager.Repository.OptionRepository;
import com.example.HotelManager.Repository.QuestionListRepository;
import com.example.HotelManager.Repository.QuestionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.print.Book;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class QuestionService {
    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionListRepository questionListRepository;

    public List<QuestionList> getAllQuestionList() {
        return questionListRepository.findAll();
    }

    public List<QuestionDTO> getQuestionsInList(int questionListId) {
        List<QuestionDTO> questionDTO = new ArrayList<>();
        List<Question> questions = questionRepository.findByQuestionListId(questionListId);

        for (Question question : questions) {
            // Lấy danh sách Option
            List<Option> options = getOptionInQuestion(question.getId());

            // Chuyển đổi List<Option> -> List<OptionDTO>
            List<OptionDTO> optionDTOList = new ArrayList<>();
            for (Option option : options) {
                OptionDTO optionDTO = new OptionDTO();
                optionDTO.setOptionId(option.getOptionId());
                optionDTO.setQuestionId(option.getQuestionId());
                optionDTO.setContent(option.getContent());
                optionDTOList.add(optionDTO);
            }

            // Tạo QuestionDTO
            QuestionDTO qdto = new QuestionDTO();
            qdto.setOptions(optionDTOList); // Set danh sách DTO
            qdto.setQuestionId(question.getId());
            qdto.setQuestion(question.getQuestion());
            qdto.setQuestionListId(questionListId);
            questionDTO.add(qdto);
        }

        return questionDTO;
    }

    public List<Option> getOptionInQuestion(int id) {
        return optionRepository.findOptionByQuestionId(id);
    }

    public List<Integer> getAnswerOfList(int questionListId) {
        List<Integer> answers = new ArrayList<>();
        List<Question> questions = questionRepository.findByQuestionListId(questionListId);
        for (Question question : questions) {
            answers.add(question.getCorrectAnswer());
        }
        return answers;
    }

    public QuizResultDTO evaluateQuiz(QuizSubmissionDTO submissionData) {
        List<Integer> correctAnswers = getAnswerOfList(submissionData.getQuestionListId());
        List<Question> questions = questionRepository.findByQuestionListId(submissionData.getQuestionListId());

        int correctCount = 0;
        List<QuizResultDTO.QuestionResultDTO> questionResults = new ArrayList<>();

        // Tạo map để dễ dàng tìm câu trả lời của user
        Map<Integer, Integer> userAnswersMap = new HashMap<>();
        for (QuizSubmissionDTO.AnswerDTO answer : submissionData.getAnswers()) {
            userAnswersMap.put(answer.getQuestionId(), answer.getSelectedOption());
        }

        // Đánh giá từng câu hỏi
        for (int i = 0; i < questions.size(); i++) {
            Question question = questions.get(i);
            int correctAnswer = correctAnswers.get(i);
            Integer userAnswer = userAnswersMap.get(question.getId());

            boolean isCorrect = false;
            if (userAnswer != null && userAnswer.equals(correctAnswer)) {
                isCorrect = true;
                correctCount++;
            }

            QuizResultDTO.QuestionResultDTO questionResult = new QuizResultDTO.QuestionResultDTO(
                    question.getId(),
                    userAnswer != null ? userAnswer : -1, // -1 nếu không trả lời
                    correctAnswer,
                    isCorrect);
            questionResults.add(questionResult);
        }
        System.out.println("result: "+ questionResults);
        double percentage = Math.round((double) correctCount / questions.size() * 100 * 100.0) / 100.0;

        return new QuizResultDTO(correctCount, questions.size(), percentage, questionResults);
    }

}
