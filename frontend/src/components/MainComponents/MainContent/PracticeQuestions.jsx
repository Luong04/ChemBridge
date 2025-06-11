import { useState, useEffect } from "react";
import userApi from "../../../api/userApi";
// PracticeQuestions Component
const PracticeQuestions = ({ onQuizClick }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await userApi.getQuestionList();
        // Giả sử response là mảng các object tương tự mockQuizzes
        setQuizzes(response || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách bài kiểm tra:", error.response?.data || error.message);
        setError("Không thể tải danh sách bài kiểm tra. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleQuizClick = (quizId) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (onQuizClick && typeof onQuizClick === 'function') {
      onQuizClick(quiz);
    } else {
      console.error('onQuizClick is not a function');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Dễ': return 'success';
      case 'Trung bình': return 'warning';
      case 'Khó': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-success mb-1" style={{ fontFamily: '"Inter", sans-serif' }}>✏️ Luyện tập</h2>
          <p className="text-muted" style={{ fontFamily: '"Inter", sans-serif' }}>Chọn bài kiểm tra để luyện tập</p>
        </div>
      </div>
      
      <div className="row g-4">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="col-lg-6 col-xl-4">
            <div 
              className="card h-100 shadow-sm border-0"
              style={{ 
                cursor: 'pointer', 
                transition: 'transform 0.2s',
                fontFamily: '"Inter", sans-serif'
              }}
              onClick={() => handleQuizClick(quiz.id)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="card-title fw-bold" style={{ fontFamily: '"Inter", sans-serif' }}>{quiz.title}</h5>
                  <span className={`badge bg-${getDifficultyColor(quiz.difficulty)}`} style={{ fontFamily: '"Inter", sans-serif' }}>
                    {quiz.difficulty}
                  </span>
                </div>
                
                <p className="card-text text-muted mb-3" style={{ fontFamily: '"Inter", sans-serif' }}>{quiz.description}</p>
                
                <div className="row text-center mb-3">
                  <div className="col-4">
                    <div className="text-primary fw-bold fs-5" style={{ fontFamily: '"Inter", sans-serif' }}>{quiz.questionCount}</div>
                    <small className="text-muted" style={{ fontFamily: '"Inter", sans-serif' }}>Câu hỏi</small>
                  </div>
                  <div className="col-4">
                    <div className="text-warning fw-bold fs-5" style={{ fontFamily: '"Inter", sans-serif' }}>{quiz.duration}</div>
                    <small className="text-muted" style={{ fontFamily: '"Inter", sans-serif' }}>Phút</small>
                  </div>
                  <div className="col-4">
                    <div className="text-info fw-bold fs-5" style={{ fontFamily: '"Inter", sans-serif' }}>{quiz.attempts}</div>
                    <small className="text-muted" style={{ fontFamily: '"Inter", sans-serif' }}>Lượt làm</small>
                  </div>
                </div>
              </div>
              
              <div className="card-footer bg-transparent border-0">
                <button className="btn btn-success w-100" style={{ fontFamily: '"Inter", sans-serif' }}>
                  Bắt đầu làm bài
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticeQuestions