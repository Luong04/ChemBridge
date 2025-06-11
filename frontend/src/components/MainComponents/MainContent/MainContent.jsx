import { useState } from "react";
import StudyMaterials from "./StudyMaterials";
import PracticeQuestions from "./PracticeQuestions";
import QuizPage from "./QuizPage";

const MainContent = () => {
  const [activeTab, setActiveTab] = useState('study'); // 'study' hoặc 'practice'
  const [currentView, setCurrentView] = useState('list'); // 'list' hoặc 'quiz'
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // Xử lý khi click vào một bài quiz
  const handleQuizClick = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentView('quiz');
  };

  // Xử lý quay lại danh sách bài tập
  const handleBackToQuizzes = () => {
    setCurrentView('list');
    setSelectedQuiz(null);
  };

  // Render nội dung cho tab Luyện tập
  const renderPracticeContent = () => {
    if (currentView === 'quiz' && selectedQuiz) {
      return (
        <QuizPage
          questionList={selectedQuiz}
          quizTitle={selectedQuiz.title}
          onBack={handleBackToQuizzes}
        />
      );
    }
    
    return <PracticeQuestions onQuizClick={handleQuizClick} />;
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="bg-light border-bottom">
        <div className="container-fluid">
          <ul className="nav nav-tabs border-0">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'study' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('study');
                  // Reset về danh sách khi chuyển tab
                  setCurrentView('list');
                  setSelectedQuiz(null);
                }}
                style={{ 
                  border: 'none',
                  backgroundColor: activeTab === 'study' ? '#fff' : 'transparent',
                  fontWeight: activeTab === 'study' ? 'bold' : 'normal',
                  fontFamily: "Roboto"
                }}
              >
                📹 Học liệu
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'practice' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('practice');
                  // Reset về danh sách khi chuyển tab
                  setCurrentView('list');
                  setSelectedQuiz(null);
                }}
                style={{ 
                  border: 'none',
                  backgroundColor: activeTab === 'practice' ? '#fff' : 'transparent',
                  fontWeight: activeTab === 'practice' ? 'bold' : 'normal',
                  fontFamily: "Roboto"
                }}
              >
                ✏️ Luyện tập
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ minHeight: 'calc(100vh - 200px)' }}>
        {activeTab === 'study' ? <StudyMaterials /> : renderPracticeContent()}
      </div>
    </div>
  );
};

export default MainContent;