import mongoose from 'mongoose';

const resultItemSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [String],
  correctAnswer: { type: Number, required: true },
  userAnswer: { type: Number, default: null },
  isCorrect: { type: Boolean, required: true },
  explanation: { type: String, default: '' },
}, { _id: false });

const quizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  quizTitle: {
    type: String,
    default: 'Quiz',
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  correctCount: {
    type: Number,
    required: true,
    min: 0,
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1,
  },
  results: [resultItemSchema],
}, {
  timestamps: true,
});

quizResultSchema.index({ user: 1, createdAt: -1 });
quizResultSchema.index({ user: 1 });

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

export default QuizResult;
