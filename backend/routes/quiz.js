import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

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
router.post('/upload', upload.array('files', 10), async (req, res) => {
  try {
    const { language, numQuestions } = req.body;
    const files = req.files;

    // Validation
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    if (!language || !language.trim()) {
      return res.status(400).json({ error: 'Language is required' });
    }

    const numQuestionsInt = parseInt(numQuestions);
    if (isNaN(numQuestionsInt) || numQuestionsInt < 5 || numQuestionsInt > 50) {
      return res.status(400).json({ error: 'Number of questions must be between 5 and 50' });
    }

    // Process files (in a real app, you would process PDFs/images here)
    const fileInfo = files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    }));

    // TODO: Here you would:
    // 1. Extract text from PDFs/images
    // 2. Use AI to generate questions
    // 3. Save quiz to database
    // 4. Return quiz ID

    // For now, return a mock response
    const quizId = Date.now().toString();

    res.json({
      message: 'Quiz uploaded successfully',
      quizId: quizId,
      files: fileInfo,
      language: language,
      numQuestions: numQuestionsInt
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Server error during upload' });
  }
});

export default router;

