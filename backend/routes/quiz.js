import express from 'express';
import multer from 'multer';
import { extractTextFromPDF } from '../utils/pdfParser.js';
import { extractTextFromImage } from '../utils/imageOCR.js';
import { generateQuizQuestions } from '../utils/aiService.js';
import Quiz from '../models/Quiz.js';
import QuizResult from '../models/QuizResult.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Configure multer for memory storage (like the provided code)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow PDF and images
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and images are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Upload quiz endpoint
router.post('/upload', authenticateToken, upload.array('files', 10), async (req, res) => {
  try {
    const { language, numQuestions } = req.body;
    const files = req.files;
    const userId = req.user.userId;

    // Validation
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    if (!language || !language.trim()) {
      return res.status(400).json({ error: 'Language preference is required' });
    }

    const numQuestionsInt = parseInt(numQuestions);
    if (isNaN(numQuestionsInt) || numQuestionsInt <= 0 || numQuestionsInt < 5 || numQuestionsInt > 500) {
      return res.status(400).json({ error: 'Invalid number of questions. Must be between 5 and 500' });
    }

    // Extract text from files
    let extractedText = '';
    
    for (const file of files) {
      try {
        if (file.mimetype === 'application/pdf') {
          const text = await extractTextFromPDF(file.buffer);
          extractedText += text + '\n\n';
        } else if (file.mimetype.startsWith('image/')) {
          const text = await extractTextFromImage(file.buffer);
          extractedText += text + '\n\n';
        }
      } catch (error) {
        console.error(`Error extracting text from ${file.originalname}:`, error);
        // Continue with other files
      }
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ error: 'Could not extract text from uploaded files. Please ensure files contain readable text.' });
    }

    // Limit text length for AI processing
    const maxTextLength = 10000;
    if (extractedText.length > maxTextLength) {
      extractedText = extractedText.substring(0, maxTextLength) + '...';
    }

    // Generate quiz questions using Gemini AI
    const questions = await generateQuizQuestions(extractedText, language, numQuestionsInt);

    if (!questions || questions.length === 0) {
      return res.status(500).json({ error: 'Failed to generate quiz questions' });
    }

    // Save quiz to database
    const quiz = new Quiz({
      title: `Quiz - ${language}`,
      language: language,
      questions: questions,
      createdBy: userId,
      sourceFiles: files.map(file => ({
        filename: file.originalname,
        originalname: file.originalname,
        mimetype: file.mimetype,
      })),
    });

    await quiz.save();

    res.json({
      message: 'Quiz generated successfully',
      quizId: quiz._id,
      questionsCount: questions.length,
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Server error during quiz generation' });
  }
});

// Get user's quiz history and stats (must be before /:id)
router.get('/history/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const results = await QuizResult.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    const totalQuizzes = results.length;
    const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0);
    const totalCorrect = results.reduce((sum, r) => sum + r.correctCount, 0);
    const averageScore = totalQuizzes > 0
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalQuizzes)
      : 0;
    const bestScore = totalQuizzes > 0
      ? Math.max(...results.map(r => r.score))
      : 0;

    res.json({
      stats: {
        totalQuizzes,
        totalQuestions,
        totalCorrect,
        averageScore,
        bestScore,
      },
      history: results.map(r => ({
        _id: r._id,
        quizTitle: r.quizTitle,
        score: r.score,
        correctCount: r.correctCount,
        totalQuestions: r.totalQuestions,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single result by ID (for viewing past result)
router.get('/results/:resultId', authenticateToken, async (req, res) => {
  try {
    const { resultId } = req.params;
    const userId = req.user.userId;
    const doc = await QuizResult.findOne({ _id: resultId, user: userId }).lean();
    if (!doc) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.json({
      _id: doc._id,
      quizTitle: doc.quizTitle,
      score: doc.score,
      correctCount: doc.correctCount,
      totalQuestions: doc.totalQuestions,
      results: doc.results,
      createdAt: doc.createdAt,
    });
  } catch (error) {
    console.error('Error fetching result:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get quiz by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Return quiz without correct answers for taking
    const quizForTaking = {
      _id: quiz._id,
      title: quiz.title,
      language: quiz.language,
      questions: quiz.questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options,
        // Don't send correctAnswer or explanation
      })),
      createdAt: quiz.createdAt,
    };

    res.json(quizForTaking);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit quiz answers
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body; // Array of { questionId, selectedOption }
    const userId = req.user.userId;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Calculate score
    let correctCount = 0;
    const results = quiz.questions.map((question) => {
      const userAnswer = answers.find(a => a.questionId === question._id.toString());
      const isCorrect = userAnswer && userAnswer.selectedOption === question.correctAnswer;
      
      if (isCorrect) {
        correctCount++;
      }

      return {
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        userAnswer: userAnswer ? userAnswer.selectedOption : null,
        isCorrect: isCorrect,
        explanation: question.explanation,
      };
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);

    // Save result to database
    const quizResult = new QuizResult({
      user: userId,
      quiz: quiz._id,
      quizTitle: quiz.title,
      score,
      correctCount,
      totalQuestions: quiz.questions.length,
      results,
    });
    await quizResult.save();

    res.json({
      score,
      correctCount,
      totalQuestions: quiz.questions.length,
      results,
      resultId: quizResult._id,
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
