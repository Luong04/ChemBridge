package com.example.HotelManager.Controller;

import com.example.HotelManager.DTO.QuizSubmissionDTO;
import com.example.HotelManager.Entity.QuestionList;
import com.example.HotelManager.DTO.QuizResultDTO;
import com.example.HotelManager.Service.QuestionService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpSession;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class QuizController {
    private final ObjectMapper objectMapper;

    public QuizController(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Autowired
    private QuestionService questionService;

    @GetMapping(value="/questions/list/{questionListId}", produces = "application/json; charset=UTF-8")
    public ResponseEntity<?> getQuestions(@PathVariable int questionListId, HttpSession session) {
        // Kiểm tra session
        Boolean loggedIn = (Boolean) session.getAttribute("logged_in");
        if (loggedIn == null || !loggedIn) {
            System.out.println("Session không hợp lệ hoặc chưa đăng nhập");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("error", "Chưa đăng nhập hoặc phiên đã hết hạn"));
        }

        try {
            List<?> questions = questionService.getQuestionsInList(questionListId);
            if (questions.isEmpty()) {
                System.out.println("Không tìm thấy câu hỏi cho questionListId=" + questionListId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        Map.of("error", "Không tìm thấy câu hỏi cho danh sách này"));
            }
            System.out.println("Trả về " + questions.size() + " câu hỏi");
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            System.out.println("Lỗi khi lấy danh sách câu hỏi: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error", "Không thể lấy danh sách câu hỏi: " + e.getMessage()));
        }
    }

    @PostMapping("/quiz/submit")
    public ResponseEntity<?> submitQuiz(@RequestBody Map<String, Object> submission, HttpSession session) {
        System.out.println("Nhận yêu cầu nộp bài, submission: " + submission);

        // Kiểm tra session
        Boolean loggedIn = (Boolean) session.getAttribute("logged_in");
        if (loggedIn == null || !loggedIn) {
            System.out.println("Session không hợp lệ hoặc chưa đăng nhập");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                Map.of("error", "Chưa đăng nhập hoặc phiên đã hết hạn"));
        }

        try {
            // Kiểm tra dữ liệu đầu vào
            Object questionListIdObj = submission.get("questionListId");
            Object answersObj = submission.get("answers");

            if (questionListIdObj == null || answersObj == null) {
                System.out.println("Dữ liệu không hợp lệ: questionListId hoặc answers null");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of("error", "Dữ liệu không hợp lệ"));
            }

            // Ép kiểu questionListId
            int questionListId;
            if (questionListIdObj instanceof Integer) {
                questionListId = (Integer) questionListIdObj;
            } else {
                throw new IllegalArgumentException("questionListId phải là số nguyên");
            }

            // Ép kiểu answers
            if (!(answersObj instanceof List)) {
                throw new IllegalArgumentException("answers phải là danh sách");
            }
            List<Map<String, Object>> rawAnswers = (List<Map<String, Object>>) answersObj;
            List<QuizSubmissionDTO.AnswerDTO> answers = rawAnswers.stream().map(rawAnswer -> {
                QuizSubmissionDTO.AnswerDTO answerDTO = new QuizSubmissionDTO.AnswerDTO();
                Object questionIdObj = rawAnswer.get("questionId");
                Object selectedOptionObj = rawAnswer.get("selectedOption");
                if (questionIdObj instanceof Integer && selectedOptionObj instanceof Integer) {
                    answerDTO.setQuestionId((Integer) questionIdObj);
                    answerDTO.setSelectedOption((Integer) selectedOptionObj);
                } else {
                    throw new IllegalArgumentException("questionId hoặc selectedOption không hợp lệ");
                }
                return answerDTO;
            }).collect(Collectors.toList());

            // Tạo QuizSubmissionDTO
            QuizSubmissionDTO subDTO = new QuizSubmissionDTO();
            subDTO.setQuestionListId(questionListId);
            subDTO.setAnswers(answers);

            // Gọi service
            QuizResultDTO result = questionService.evaluateQuiz(subDTO);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("error", "Không thể xử lý bài nộp: " + e.getMessage()));
        }
    }

    @GetMapping(value = "/questionList", produces = "application/json; charset=UTF-8")
    public ResponseEntity<?> getAllQuestionList(HttpSession session) {
        System.out.println("Nhận yêu cầu lấy danh sách câu hỏi: sessionId=" + session.getId());

        // Kiểm tra session
        Boolean loggedIn = (Boolean) session.getAttribute("logged_in");
        if (loggedIn == null || !loggedIn) {
            System.out.println("Session không hợp lệ hoặc chưa đăng nhập");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("error", "Chưa đăng nhập hoặc phiên đã hết hạn"));
        }

        try {
            List<QuestionList> questionLists = questionService.getAllQuestionList();
            System.out.println("Trả về danh sách câu hỏi: " + questionLists.size() + " mục");
            return ResponseEntity.ok(questionLists);
        } catch (Exception e) {
            System.out.println("Lỗi khi lấy danh sách câu hỏi: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error", "Không thể lấy danh sách câu hỏi"));
        }
    }
}
