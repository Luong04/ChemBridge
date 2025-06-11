import { useState, useEffect } from "react";
import userApi from "../../../api/userApi";

const QuizPage = ({ questionList, quizTitle, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState(null);

  // Fetch câu hỏi từ API backend
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);

      try {
        // Gọi API backend để lấy danh sách câu hỏi
        const response = await userApi.getQuestionInList(questionList.id);
        const questionsData = response;
        // Chuyển đổi dữ liệu từ backend format sang frontend format
        const formattedQuestions = questionsData.map(q => ({
          id: q.questionId,
          question: q.question,
          options: q.options.map(opt => opt.content),
          // Không lưu correctAnswer ở frontend để bảo mật
        }));

        setQuestions(formattedQuestions);
        setTimeLeft(questionList.duration * 60); // duration từ questionList
        setLoading(false);
      } catch (err) {
        setError(err.message || "Không thể tải câu hỏi. Vui lòng thử lại sau.");
        setLoading(false);
        console.error('Error fetching questions:', err);
      }
    };

    fetchQuestions();
  }, [questionList.id]);

  // Đếm ngược thời gian
  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleSubmit();
    }
  }, [timeLeft, showResults]);

  // Xử lý chọn đáp án
  const handleAnswerSelect = (questionId, optionIndex) => {
    if (showResults) return;

    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // Nộp bài và lấy kết quả từ server
  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      // Chuẩn bị dữ liệu gửi lên server
      const submissionData = {
        questionListId: questionList.id,
        answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
          questionId: parseInt(questionId),
          selectedOption: selectedOption
        }))
      };

      // Gọi API để nộp bài và nhận kết quả
      const response = await userApi.postSubmission(submissionData);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Vui lòng đăng nhập để nộp bài');
        }
        throw new Error('Không thể nộp bài');
      }

      const resultData = await response.json();

      // Cập nhật kết quả từ server - sử dụng đúng field names từ backend
      setResults({
        score: resultData.correctCount,
        totalQuestions: resultData.totalQuestions,
        percentage: resultData.percentage,
        questionResults: resultData.questionResults.map(result => ({
          questionId: result.questionId,
          userAnswer: result.userAnswer,
          correctAnswer: result.correctAnswer,
          isCorrect: result.correct // Backend trả về 'correct', không phải 'isCorrect'
        }))
      });

      setShowResults(true);
      setSubmitting(false);
    } catch (error) {
      setError(error.message || "Không thể nộp bài. Vui lòng thử lại.");
      setSubmitting(false);
      console.error('Error submitting quiz:', error);
    }
  };

  // Format thời gian
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Lấy màu cho đáp án - Logic cải thiện
  const getOptionClass = (question, optionIndex) => {
    if (!showResults) {
      return answers[question.id] === optionIndex ? 'btn-primary' : 'btn-outline-secondary';
    }

    const result = results?.questionResults.find(r => r.questionId === question.id);
    const isCorrectAnswer = optionIndex === result?.correctAnswer;
    const isUserAnswer = result?.userAnswer === optionIndex;
    const userAnsweredCorrectly = result?.isCorrect;

    // Đáp án đúng - tô nền xanh
    if (isCorrectAnswer) {
      return 'btn-success text-white';
    }

    // Đáp án sai mà user chọn -> tô nền đỏ
    if (isUserAnswer && !userAnsweredCorrectly) {
      return 'btn-danger text-white';
    }

    return 'btn-outline-secondary';
  };

  // Reset quiz để làm lại
  const resetQuiz = async () => {
    setAnswers({});
    setShowResults(false);
    setResults(null);
    setTimeLeft(questionList.duration * 60);
    setError(null);
  };

  if (loading) {
    return (
      <div className="container-fluid py-4" style={{ fontFamily: '"Inter", sans-serif' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Đang tải câu hỏi...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4" style={{ fontFamily: '"Inter", sans-serif' }}>
        <div className="text-center">
          <div className="alert alert-danger" role="alert" style={{ fontFamily: '"Inter", sans-serif' }}>
            {error}
          </div>
          <button className="btn btn-secondary" onClick={onBack} style={{ fontFamily: '"Inter", sans-serif' }}>
            ← Quay lại danh sách bài tập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ fontFamily: '"Inter", sans-serif' }}>
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={onBack}
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            ← Quay lại danh sách bài tập
          </button>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-success mb-1" style={{ fontFamily: '"Inter", sans-serif' }}>
                ✏️ {quizTitle}
              </h2>
              <p className="text-muted" style={{ fontFamily: '"Inter", sans-serif' }}>
                {questions.length} câu hỏi
              </p>
            </div>
            {!showResults && timeLeft !== null && (
              <div className="text-end">
                <div
                  className={`fw-bold fs-4 ${timeLeft < 300 ? 'text-danger' : 'text-warning'}`}
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  ⏰ {formatTime(timeLeft)}
                </div>
                <small className="text-muted" style={{ fontFamily: '"Inter", sans-serif' }}>Thời gian còn lại</small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kết quả */}
      {showResults && results && (
        <div className="row mb-4">
          <div className="col">
            <div className="card border-0 shadow-sm bg-light">
              <div className="card-body text-center">
                <h3 className="fw-bold text-success mb-3" style={{ fontFamily: '"Inter", sans-serif' }}>
                  🎉 Hoàn thành bài tập!
                </h3>
                <div className="row">
                  <div className="col-md-4">
                    <div className="fs-2 fw-bold text-primary" style={{ fontFamily: '"Inter", sans-serif' }}>
                      {results.score}/{results.totalQuestions}
                    </div>
                    <div className="text-muted" style={{ fontFamily: '"Inter", sans-serif' }}>Số câu đúng</div>
                  </div>
                  <div className="col-md-4">
                    <div className="fs-2 fw-bold text-success" style={{ fontFamily: '"Inter", sans-serif' }}>
                      {results.percentage.toFixed(1)}%
                    </div>
                    <div className="text-muted" style={{ fontFamily: '"Inter", sans-serif' }}>Tỷ lệ chính xác</div>
                  </div>
                  <div className="col-md-4">
                    <div 
                      className={`fs-2 fw-bold ${results.percentage >= 70 ? 'text-success' : results.percentage >= 50 ? 'text-warning' : 'text-danger'}`}
                      style={{ fontFamily: '"Inter", sans-serif' }}
                    >
                      {results.percentage >= 70 ? 'Giỏi' : results.percentage >= 50 ? 'Khá' : 'Cần cố gắng'}
                    </div>
                    <div className="text-muted" style={{ fontFamily: '"Inter", sans-serif' }}>Đánh giá</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Câu hỏi */}
      <div className="row">
        <div className="col">
          {questions.map((question, index) => (
            <div key={question.id} className="card mb-4 border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start mb-3">
                  <span
                    className="badge bg-secondary me-3 fs-6"
                    style={{ minWidth: '40px', fontFamily: '"Inter", sans-serif' }}
                  >
                    {index + 1}
                  </span>
                  <h5 className="mb-0 flex-grow-1" style={{ fontFamily: '"Inter", sans-serif' }}>
                    {question.question}
                  </h5>
                  {showResults && (
                    <span 
                      className={`badge ${results?.questionResults.find(r => r.questionId === question.id)?.isCorrect ? 'bg-success' : 'bg-danger'}`}
                      style={{ fontFamily: '"Inter", sans-serif' }}
                    >
                      {results?.questionResults.find(r => r.questionId === question.id)?.isCorrect ? '✓' : '✕'}
                    </span>
                  )}
                </div>

                <div className="row g-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="col-md-6">
                      <button
                        className={`btn w-100 text-start ${getOptionClass(question, optionIndex)}`}
                        onClick={() => handleAnswerSelect(question.id, optionIndex)}
                        disabled={showResults}
                        style={{
                          fontFamily: '"Inter", sans-serif',
                          minHeight: '48px'
                        }}
                      >
                        <span className="me-2">{String.fromCharCode(65 + optionIndex)}.</span>
                        {option}
                      </button>
                    </div>
                  ))}
                </div>

                {showResults && (
                  <div className="mt-3 p-3 bg-light rounded">
                    {(() => {
                      const result = results?.questionResults.find(r => r.questionId === question.id);
                      const correctAnswer = result?.correctAnswer;
                      const userAnswer = result?.userAnswer;
                      const isCorrect = result?.isCorrect;
                      
                      return (
                        <div style={{ fontFamily: '"Inter", sans-serif' }}>
                          {isCorrect ? (
                            // Chỉ hiển thị icon tích xanh khi trả lời đúng
                            <div className="text-center">
                              <span className="text-success fs-4">✓</span>
                              <div className="text-success">Chính xác</div>
                            </div>
                          ) : (
                            // Hiển thị đáp án đúng và sai khi trả lời sai
                            <div className="row">
                              <div className="col-md-6">
                                <small className="text-muted">Đáp án đúng:</small>
                                <div className="text-success">
                                  {String.fromCharCode(65 + correctAnswer)}. {question.options[correctAnswer]}
                                </div>
                              </div>
                              <div className="col-md-6">
                                <small className="text-muted">Câu trả lời của bạn:</small>
                                <div className="text-danger">
                                  {userAnswer !== undefined && userAnswer !== -1 
                                    ? `${String.fromCharCode(65 + userAnswer)}. ${question.options[userAnswer]}`
                                    : "Không trả lời"
                                  }
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nút nộp bài */}
      {!showResults && (
        <div className="row">
          <div className="col text-center">
            <button
              className="btn btn-success btn-lg px-5"
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).length === 0}
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Đang nộp bài...
                </>
              ) : (
                `📤 Nộp bài (${Object.keys(answers).length}/${questions.length})`
              )}
            </button>
            <div className="mt-2">
              <small className="text-muted" style={{ fontFamily: '"Inter", sans-serif' }}>
                Bạn đã trả lời {Object.keys(answers).length}/{questions.length} câu hỏi
              </small>
            </div>
          </div>
        </div>
      )}

      {/* Nút làm lại */}
      {showResults && (
        <div className="row">
          <div className="col text-center">
            <button
              className="btn btn-primary me-3"
              onClick={resetQuiz}
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              🔄 Làm lại
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={onBack}
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              📚 Chọn bài khác
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;