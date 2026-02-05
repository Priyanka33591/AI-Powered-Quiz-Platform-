import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getQuiz, submitQuiz } from '../api/quiz';
import '../styles/Quiz.css';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const data = await getQuiz(id);
      setQuiz(data);
      // Initialize answers object
      const initialAnswers = {};
      data.questions.forEach((q) => {
        initialAnswers[q._id] = null;
      });
      setAnswers(initialAnswers);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    const unansweredCount = Object.values(answers).filter((a) => a === null).length;
    if (unansweredCount > 0) {
      const confirm = window.confirm(
        `You have ${unansweredCount} unanswered questions. Do you want to submit anyway?`
      );
      if (!confirm) return;
    }

    try {
      setSubmitting(true);
      const answersArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      }));

      const result = await submitQuiz(id, answersArray);
      navigate('/results', { state: { result, quiz } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const getAnsweredCount = () => {
    return Object.values(answers).filter((a) => a !== null).length;
  };

  if (loading) {
    return (
      <div className="quiz-wrapper">
        <Navbar />
        <div className="quiz-container">
          <div className="loading-container">
            <LoadingSpinner />
            <p>Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-wrapper">
        <Navbar />
        <div className="quiz-container">
          <div className="error-container">
            <div className="error-message">{error}</div>
            <button onClick={() => navigate('/dashboard')} className="btn-back">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  const question = quiz.questions[currentQuestion];
  const answeredCount = getAnsweredCount();

  return (
    <div className="quiz-wrapper">
      <Navbar />
      <div className="quiz-container">
        <div className="quiz-header">
          <h1 className="quiz-title">{quiz.title}</h1>
          <div className="quiz-meta">
            <span className="meta-item">📝 {quiz.questions.length} Questions</span>
            <span className="meta-item">🌐 {quiz.language}</span>
            <span className="meta-item">✅ {answeredCount} Answered</span>
          </div>
        </div>

        <div className="quiz-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="progress-text">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
        </div>

        <div className="question-card">
          <div className="question-header">
            <span className="question-number">Q{currentQuestion + 1}</span>
            <h2 className="question-text">{question.question}</h2>
          </div>

          <div className="options-list">
            {question.options.map((option, index) => {
              const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
              const isSelected = answers[question._id] === index;
              return (
                <button
                  key={index}
                  className={`option-button ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(question._id, index)}
                >
                  <span className="option-label">{optionLabels[index]}</span>
                  <span className="option-text">{option}</span>
                  {isSelected && <span className="check-icon">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="quiz-navigation">
          <button
            onClick={handlePrevious}
            className="nav-button prev"
            disabled={currentQuestion === 0}
          >
            ← Previous
          </button>

          <div className="question-indicators">
            {quiz.questions.map((q, index) => (
              <button
                key={q._id}
                className={`indicator ${index === currentQuestion ? 'active' : ''} ${
                  answers[q._id] !== null ? 'answered' : ''
                }`}
                onClick={() => setCurrentQuestion(index)}
                title={`Question ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion < quiz.questions.length - 1 ? (
            <button onClick={handleNext} className="nav-button next">
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="nav-button submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <LoadingSpinner />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Quiz</span>
                  <span className="submit-icon">✓</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
