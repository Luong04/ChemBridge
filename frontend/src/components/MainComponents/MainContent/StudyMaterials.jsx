import { useState } from "react";
import LessonVideos from "./LessonVideos";

const StudyMaterials = () => {
  const [currentView, setCurrentView] = useState('lessons');
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [lessons] = useState([
    {
      id: 1,
      title: "Bài 1: Thí nghiệm pH",
      description: "Sự đổi màu của quỳ tím khi nhúng vào các dung dịch",
      duration: "3 phút",
      videoCount: 2,
      thumbnail: "https://courier.unesco.org/sites/default/files/styles/best_image/article/courier/photos/gettyimages-874157664.jpg?itok=QmvdimcR",
      quiz: {
        id: "a06352a8-edec-4a15-ba34-c0b5f8339bdf", // artifact_id từ pH_questions.sql
        title: "Bài kiểm tra về thí nghiệm pH",
        duration: 15 // Thời gian làm bài (phút)
      }
    },
    {
      id: 2,
      title: "Bài 2: Thí nghiệm chuẩn độ",
      description: "Các thí nghiệm đặc trưng về phản ứng giữa base và acid",
      duration: "2 phút",
      videoCount: 1,
      thumbnail: "https://www.chemicals.co.uk/wp-content/uploads/2021/09/molecules-and-formula-graphic-scaled.jpg",
      quiz: {
        id: "d3c93c93-3e76-41ee-ad22-70b67d047735", // artifact_id từ titration_questions.sql
        title: "Bài kiểm tra về thí nghiệm chuẩn độ",
        duration: 10 // Thời gian làm bài (phút)
      }
    }
  ]);

  const handleLessonClick = (lessonId) => {
    const lesson = lessons.find(l => l.id === lessonId);
    setSelectedLesson(lesson);
    setCurrentView('videos');
  };

  const handleBackToLessons = () => {
    setCurrentView('lessons');
    setSelectedLesson(null);
  };

  if (currentView === 'videos' && selectedLesson) {
    return (
      <LessonVideos
        lessonId={selectedLesson.id}
        lessonTitle={selectedLesson.title}
        quiz={selectedLesson.quiz}
        onBack={handleBackToLessons}
      />
    );
  }

  return (
    <div className="container-fluid py-4" style={{ fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-primary mb-1" style={{ fontFamily: '"Inter", sans-serif' }}>📚 Học liệu</h2>
          <p className="text-muted" style={{ fontFamily: '"Inter", sans-serif' }}>Chọn bài học để bắt đầu học tập</p>
        </div>
      </div>
      
      <div className="row g-4">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="col-lg-6 col-xl-4">
            <div 
              className="card h-100 shadow-sm border-0"
              style={{ 
                cursor: 'pointer', 
                transition: 'transform 0.2s',
                fontFamily: '"Inter", sans-serif'
              }}
              onClick={() => handleLessonClick(lesson.id)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <img 
                src={lesson.thumbnail} 
                className="card-img-top" 
                alt={lesson.title}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title fw-bold" style={{ fontFamily: '"Inter", sans-serif' }}>{lesson.title}</h5>
                <p className="card-text text-muted" style={{ fontFamily: '"Inter", sans-serif' }}>{lesson.description}</p>
                
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted" style={{ fontFamily: '"Inter", sans-serif' }}>
                    ⏱️ {lesson.duration}
                  </small>
                  <small className="text-muted" style={{ fontFamily: '"Inter", sans-serif' }}>
                    📹 {lesson.videoCount} video
                  </small>
                </div>
              </div>
              <div className="card-footer bg-transparent border-0">
                <button className="btn btn-primary w-100" style={{ fontFamily: '"Inter", sans-serif' }}>
                  Bắt đầu học
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyMaterials;