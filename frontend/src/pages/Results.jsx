import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getResultById, getQuizHistoryAndStats } from '../api/quiz';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Results.css';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Use window.location as fallback so resultId is available when navigating via Link
  const resultId = searchParams.get('resultId') || new URLSearchParams(window.location.search).get('resultId');
  const [result, setResult] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const id = searchParams.get('resultId') || new URLSearchParams(window.location.search).get('resultId');
    const stateResult = location.state?.result;
    const stateQuiz = location.state?.quiz;

    if (id) {
      setLoading(true);
      setError('');
      getResultById(id)
        .then((data) => {
          setResult({
            score: data.score,
            correctCount: data.correctCount,
            totalQuestions: data.totalQuestions,
            results: data.results,
          });
          setQuiz({ title: data.quizTitle });
        })
        .catch((err) => {
          setError(err.response?.data?.error || 'Failed to load result');
        })
        .finally(() => setLoading(false));
      return;
    }

    if (stateResult && stateQuiz) {
      setResult(stateResult);
      setQuiz(stateQuiz);
      setLoading(false);
      return;
    }

    // No resultId and no state – show history (do not redirect)
    setLoading(false);
  }, [resultId, location.state, navigate, searchParams]);

  // Fetch result history when no result is selected
  const showHistoryView = !resultId && !location.state?.result && !result && !loading && !error;
  useEffect(() => {
    if (!showHistoryView) return;
    setHistoryLoading(true);
    getQuizHistoryAndStats()
      .then((data) => setHistory(data.history || []))
      .catch(() => setHistory([]))
      .finally(() => setHistoryLoading(false));
  }, [showHistoryView]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { dateStyle: 'medium' });
  };

  // No result selected – show result history
  if (showHistoryView) {
    return (
      <div className="results-wrapper">
        <Navbar />
        <div className="results-container">
          <div className="results-history-section">
            <h2 className="results-history-title">Result History</h2>
            <p className="results-history-subtitle">Click on a result to view details.</p>
            {historyLoading ? (
              <div className="results-history-loading">
                <LoadingSpinner />
                <span>Loading history...</span>
              </div>
            ) : history.length === 0 ? (
              <div className="results-empty">
                <p className="results-empty-text">No quiz attempts yet. Take a quiz from the dashboard to see your results here.</p>
                <button onClick={() => navigate('/dashboard')} className="btn-primary">Go to Dashboard</button>
              </div>
            ) : (
              <ul className="results-history-list">
                {history.map((item) => (
                  <li key={item._id} className="results-history-item">
                    <div className="results-history-item-main">
                      <span className="results-history-item-title">{item.quizTitle}</span>
                      <span className="results-history-item-score">{item.score}%</span>
                    </div>
                    <div className="results-history-item-meta">
                      {item.correctCount}/{item.totalQuestions} correct · {formatDate(item.createdAt)}
                    </div>
                    <Link to={{ pathname: '/results', search: `?resultId=${item._id}` }} className="results-history-item-link">View result</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading || (!result && !error)) {
    return (
      <div className="results-wrapper">
        <Navbar />
        <div className="results-container">
          <p>Loading results...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="results-wrapper">
        <Navbar />
        <div className="results-container">
          <p className="results-error">{error}</p>
          <button onClick={() => navigate('/profile')}>Back to Profile</button>
        </div>
      </div>
    );
  }
  if (!result || !quiz) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Excellent!';
    if (score >= 80) return 'Great Job!';
    if (score >= 70) return 'Good Work!';
    if (score >= 60) return 'Not Bad!';
    return 'Keep Practicing!';
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return '🎉';
    if (score >= 80) return '👏';
    if (score >= 70) return '👍';
    if (score >= 60) return '💪';
    return '📚';
  };

  // Status badge and icon for the circle – clear pass/fail visual
  const getScoreStatus = (score) => {
    if (score >= 90) return { badge: 'Excellent', icon: '🏆', type: 'excellent' };
    if (score >= 80) return { badge: 'Pass', icon: '⭐', type: 'pass' };
    if (score >= 70) return { badge: 'Good', icon: '👍', type: 'good' };
    if (score >= 60) return { badge: 'Fair', icon: '💪', type: 'fair' };
    return { badge: 'Try Again', icon: '📚', type: 'try-again' };
  };

  const scoreStatus = getScoreStatus(result.score);

  // Attempted = user answered (userAnswer !== null)
  const attemptedCount = result.results?.filter((r) => r.userAnswer !== null && r.userAnswer !== undefined).length ?? 0;
  const notAttemptedCount = (result.totalQuestions ?? 0) - attemptedCount;

  return (
    <div className="results-wrapper">
      <Navbar />
      <div className="results-container">
        <div className="results-header">
          <h1 className="results-title">Quiz Results</h1>
          <div className="score-card" style={{ '--score-color': getScoreColor(result.score) }}>
            <div className="score-circle">
              <div className="score-circle-icon" aria-hidden="true">
                {scoreStatus.icon}
              </div>
              <div className="score-value">{result.score}%</div>
              <div className="score-label">Score</div>
              <div className={`score-circle-badge score-circle-badge--${scoreStatus.type}`}>
                {scoreStatus.badge}
              </div>
              <div className="score-circle-extra">
                <span className="score-circle-attempted">{attemptedCount}/{result.totalQuestions} attempted</span>
              </div>
            </div>
            <div className="score-details">
              <div className="score-item">
                <span className="score-icon">✅</span>
                <span className="score-text">
                  {result.correctCount} / {result.totalQuestions} Correct
                </span>
              </div>
              <div className="score-item">
                <span className="score-icon">📝</span>
                <span className="score-text">
                  {attemptedCount} attempted · {notAttemptedCount} not attempted
                </span>
              </div>
              <div className="score-message">{getScoreMessage(result.score)} {getScoreEmoji(result.score)}</div>
            </div>
          </div>
        </div>

        <div className="results-content">
          <h2 className="section-title">Question Review</h2>
          <div className="questions-review">
            {result.results.map((item, index) => {
              const wasAttempted = item.userAnswer !== null && item.userAnswer !== undefined;
              return (
              <div
                key={index}
                className={`question-review-card ${item.isCorrect ? 'correct' : 'incorrect'} ${!wasAttempted ? 'not-attempted' : ''}`}
              >
                <div className="review-question-header">
                  <span className="review-question-number">Q{index + 1}</span>
                  {wasAttempted ? (
                    <span className={`status-badge ${item.isCorrect ? 'correct' : 'incorrect'}`}>
                      {item.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  ) : (
                    <span className="status-badge not-attempted">Not attempted</span>
                  )}
                </div>
                <h3 className="review-question-text">{item.question}</h3>

                <div className="review-options">
                  {item.options.map((option, optIndex) => {
                    const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
                    const isCorrect = optIndex === item.correctAnswer;
                    const isUserAnswer = optIndex === item.userAnswer;
                    let optionClass = 'review-option';

                    if (isCorrect) {
                      optionClass += ' correct-answer';
                    }
                    if (isUserAnswer && !isCorrect) {
                      optionClass += ' wrong-answer';
                    }
                    if (isUserAnswer) {
                      optionClass += ' user-selected';
                    }

                    return (
                      <div key={optIndex} className={optionClass}>
                        <span className="option-label">{optionLabels[optIndex]}</span>
                        <span className="option-text">{option}</span>
                        {isCorrect && <span className="correct-icon">✓</span>}
                        {isUserAnswer && !isCorrect && <span className="wrong-icon">✗</span>}
                      </div>
                    );
                  })}
                </div>

                {!wasAttempted && (
                  <p className="review-not-attempted-note">You did not select an answer for this question.</p>
                )}

                {item.explanation && (
                  <div className="explanation">
                    <span className="explanation-label">💡 Explanation:</span>
                    <p className="explanation-text">{item.explanation}</p>
                  </div>
                )}
              </div>
            );
            })}
          </div>
        </div>

        <div className="results-actions">
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
          <button onClick={() => navigate('/upload')} className="btn-secondary">
            Create New Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
