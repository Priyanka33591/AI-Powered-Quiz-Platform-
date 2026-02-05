import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 2 && v.length <= 6;
      },
      message: 'Options must be between 2 and 6',
    },
  },
  correctAnswer: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return v >= 0 && v < this.options.length;
      },
      message: 'Correct answer index must be within options range',
    },
  },
  explanation: {
    type: String,
    default: '',
  },
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Generated Quiz',
  },
  language: {
    type: String,
    required: true,
  },
  questions: {
    type: [questionSchema],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sourceFiles: [{
    filename: String,
    originalname: String,
    mimetype: String,
  }],
}, {
  timestamps: true,
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;

