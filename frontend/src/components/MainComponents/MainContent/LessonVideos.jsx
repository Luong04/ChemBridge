import { useState, useEffect } from "react";
import QuizPage from "./QuizPage"; // Giả sử QuizPage nằm cùng thư mục hoặc điều chỉnh đường dẫn

const LessonVideos = ({ lessonId, lessonTitle, onBack }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [error, setError] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // Mock API call để lấy danh sách video và quiz theo lessonId
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        // Mock data cho video và quiz
        setTimeout(() => {
          const mockVideos = {
            1: [
              {
                id: 101,
                title: "Mô phỏng thí nghiệm về độ pH trong dạ dày",
                videoUrl: "https://www.youtube.com/embed/djX2VL1Sk-E",
                duration: "1:02",
                description: "Tìm hiểu khái niệm cơ bản về độ pH và cách sử dụng giấy quỳ tím",
                quiz: {
                  id: 1,
                  title: "Bài kiểm tra về độ pH",
                  duration: 60, // Thời gian làm bài (phút)
                  questions: [
                    {
                      questionId: 1001,
                      question: "Độ pH của dung dịch trung tính là bao nhiêu?",
                      options: [{ content: "7" }, { content: "0" }, { content: "14" }, { content: "5" }],
                    },
                    {
                      questionId: 1002,
                      question: "Giấy quỳ tím chuyển màu gì trong môi trường acid?",
                      options: [{ content: "Xanh" }, { content: "Đỏ" }, { content: "Tím" }, { content: "Vàng" }],
                    }
                  ]
                }
              },
              {
                id: 102,
                title: "Thí nghiệm về độ pH",
                videoUrl: "https://www.youtube.com/embed/fTthjFmncvc",
                duration: "1:20",
                description: "Thí nghiệm thực tế với giấy quỳ và các dung dịch acid, base",
                quiz: {
                  id: 1,
                  title: "Bài kiểm tra về độ pH",
                  duration: 10,
                  questions: [
                    {
                      questionId: 1003,
                      question: "Dung dịch nào dưới đây là base?",
                      options: [
                        { content: "Giấm" },
                        { content: "Nước cất" },
                        { content: "Nước chanh" },
                        { content: "Xút" }
                      ],
                    }
                  ]
                }
              }
            ],
            2: [
              {
                id: 201,
                title: "Thực hành chuẩn độ acid-base",
                videoUrl: "https://www.youtube.com/embed/Vpdvidk1OKQ",
                duration: "1:52",
                description: "Hiểu về phản ứng trung hòa giữa acid và base",
                quiz: {
                  id: 2,
                  title: "Bài kiểm tra về chuẩn độ acid-base",
                  duration: 35,
                  questions: [
                    {
                      questionId: 2001,
                      question: "Phản ứng trung hòa tạo ra sản phẩm nào?",
                      options: [
                        { content: "Muối và nước" },
                        { content: "Khí và nước" },
                        { content: "Muối và khí" },
                        { content: "Acid và base" }
                      ],
                    }
                  ]
                }
              }
            ]
          };

          const lessonVideos = mockVideos[lessonId] || [];
          setVideos(lessonVideos);
          if (lessonVideos.length > 0) {
            setCurrentVideo(lessonVideos[0]);
          }
          setLoading(false);
        }, 800);
      } catch (err) {
        setError("Không thể tải danh sách video. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchVideos();
    }
  }, [lessonId]);

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
    setShowQuiz(false); // Ẩn quiz khi chuyển video
    setSelectedQuiz(null);
  };

  const handleQuizClick = () => {
    if (currentVideo?.quiz) {
      setSelectedQuiz({
        id: currentVideo.quiz.id,
        title: currentVideo.quiz.title,
        duration: currentVideo.quiz.duration,
        questions: currentVideo.quiz.questions
      });
      setShowQuiz(true);
    } else {
      setError("Video này chưa có bài kiểm tra liên quan.");
    }
  };

  const handleQuizBack = () => {
    setShowQuiz(false);
    setSelectedQuiz(null);
  };

  if (loading) {
    return (
      <div className="container-fluid py-4" style={{ fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4" style={{ fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button className="btn btn-secondary" onClick={onBack}>
            ← Quay lại danh sách bài học
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={onBack}
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            ← Quay lại danh sách bài học
          </button>
          <h2 className="fw-bold text-primary mb-1" style={{ fontFamily: '"Inter", sans-serif' }}>
            🎥 {lessonTitle}
          </h2>
          <p className="text-muted" style={{ fontFamily: '"Inter", sans-serif' }}>
            {videos.length} video có sẵn
          </p>
        </div>
      </div>

      <div className="row">
        {/* Video Player */}
        <div className="col-lg-8 mb-4">
          {currentVideo && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="ratio ratio-16x9">
                  <iframe
                    src={currentVideo.videoUrl}
                    title={currentVideo.title}
                    allowFullScreen
                    style={{ borderRadius: '8px 8px 0 0' }}
                  ></iframe>
                </div>
                <div className="p-4">
                  <h4 className="fw-bold mb-2" style={{ fontFamily: '"Inter", sans-serif' }}>
                    {currentVideo.title}
                  </h4>
                  <p className="text-muted mb-2" style={{ fontFamily: '"Inter", sans-serif' }}>
                    ⏱️ {currentVideo.duration}
                  </p>
                  <p className="text-secondary" style={{ fontFamily: '"Inter", sans-serif' }}>
                    {currentVideo.description}
                  </p>
                  <button
                    className="btn btn-success w-100 mt-3"
                    onClick={handleQuizClick}
                    style={{ fontFamily: '"Inter", sans-serif' }}
                  >
                    ✏️ Làm bài tập
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Section */}
          {showQuiz && selectedQuiz && (
            <div className="mt-4">
              <QuizPage
                questionList={selectedQuiz}
                quizTitle={selectedQuiz.title}
                onBack={handleQuizBack}
              />
            </div>
          )}
        </div>

        {/* Video List */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-0">
              <h5 className="mb-0 fw-bold" style={{ fontFamily: '"Inter", sans-serif' }}>
                📋 Danh sách video
              </h5>
            </div>
            <div className="card-body p-0">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className={`d-flex align-items-center p-3 border-bottom cursor-pointer ${
                    currentVideo?.id === video.id ? 'bg-primary bg-opacity-10 border-primary border-opacity-25' : ''
                  }`}
                  style={{
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    fontFamily: '"Inter", sans-serif'
                  }}
                  onClick={() => handleVideoSelect(video)}
                  onMouseEnter={(e) => {
                    if (currentVideo?.id !== video.id) {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentVideo?.id !== video.id) {
                      e.currentTarget.style.backgroundColor = '';
                    }
                  }}
                >
                  <div className="me-3">
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center ${
                        currentVideo?.id === video.id ? 'bg-primary text-white' : 'bg-secondary text-white'
                      }`}
                      style={{ width: '32px', height: '32px', fontSize: '14px', fontWeight: 'bold' }}
                    >
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <h6
                      className="mb-1 fw-semibold"
                      style={{
                        fontSize: '14px',
                        color: currentVideo?.id === video.id ? '#0d6efd' : '#212529'
                      }}
                    >
                      {video.title}
                    </h6>
                    <small className="text-muted">⏱️ {video.duration}</small>
                  </div>
                  {currentVideo?.id === video.id && (
                    <div className="ms-2">
                      <i className="text-primary">▶️</i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonVideos;