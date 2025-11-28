import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Quiz.css';

const Quiz = () => {
  const { id } = useParams();
  return (
    <div className="quiz-wrapper">
      <Navbar />
      <div className="quiz-container">
        <h1>Quiz {id}</h1>
        <p>Quiz page coming soon...</p>
      </div>
    </div>
  );
};

export default Quiz;

