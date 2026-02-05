import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { uploadQuiz } from '../api/quiz';
import '../styles/Upload.css';

const Upload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [files, setFiles] = useState([]);
  const [language, setLanguage] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const acceptedFileTypes = {
    pdf: 'application/pdf',
    images: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setError('');
    setSuccess('');

    // Validate file types
    const invalidFiles = selectedFiles.filter(file => {
      const isPDF = file.type === acceptedFileTypes.pdf;
      const isImage = acceptedFileTypes.images.includes(file.type);
      return !isPDF && !isImage;
    });

    if (invalidFiles.length > 0) {
      setError('Please select only PDF files or images (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file sizes (max 10MB per file)
    const oversizedFiles = selectedFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('File size must be less than 10MB');
      return;
    }

    // Add files to state
    const newFiles = selectedFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setError('');
  };

  const handleNumQuestionsChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      if (value < 5) {
        setNumQuestions(5);
      } else if (value > 500) {
        setNumQuestions(500);
      } else {
        setNumQuestions(value);
      }
    }
    setError('');
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (files.length === 0) {
      setError('Please select at least one file');
      setLoading(false);
      return;
    }

    if (!language.trim()) {
      setError('Please enter the language');
      setLoading(false);
      return;
    }

    if (numQuestions < 5 || numQuestions > 500) {
      setError('Number of questions must be between 5 and 500');
      setLoading(false);
      return;
    }

    try {
      // Create FormData
      const formData = new FormData();
      
      // Append files
      files.forEach((fileObj, index) => {
        formData.append('files', fileObj.file);
      });

      // Append metadata
      formData.append('language', language.trim());
      formData.append('numQuestions', numQuestions.toString());

      // Upload to backend
      const response = await uploadQuiz(formData);
      
      setSuccess('Quiz generated successfully! Redirecting...');
      
      // Redirect to quiz page after a short delay
      setTimeout(() => {
        if (response.quizId) {
          navigate(`/quiz/${response.quizId}`);
        } else {
          navigate('/dashboard');
        }
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      const event = {
        target: {
          files: droppedFiles
        }
      };
      handleFileChange(event);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="upload-wrapper">
      <div className="upload-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
      </div>
      <Navbar />
      <div className="upload-container">
        <div className="upload-header">
          <h1 className="upload-title">Create Quiz from Documents</h1>
          <p className="upload-subtitle">
            Upload PDF files or images to generate AI-powered quizzes automatically
          </p>
        </div>

        <form onSubmit={handleGenerateQuiz} className="upload-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {/* File Upload Section */}
          <div className="upload-section">
            <label className="section-label">
              <span className="label-icon">📄</span>
              Upload Files (PDF or Images)
            </label>
            <div
              className="file-drop-zone"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,application/pdf,image/*"
                onChange={handleFileChange}
                className="file-input"
                disabled={loading}
              />
              <div className="drop-zone-content">
                <div className="drop-zone-icon">📤</div>
                <p className="drop-zone-text">
                  Drag and drop files here, or click to browse
                </p>
                <p className="drop-zone-hint">
                  Supports PDF files and images (JPEG, PNG, GIF, WebP). Max 10MB per file.
                </p>
              </div>
            </div>

            {/* File Preview List */}
            {files.length > 0 && (
              <div className="files-preview">
                <h3 className="preview-title">Selected Files ({files.length})</h3>
                <div className="files-list">
                  {files.map((fileObj) => (
                    <div key={fileObj.id} className="file-item">
                      <div className="file-info">
                        {fileObj.preview ? (
                          <img src={fileObj.preview} alt={fileObj.name} className="file-preview-image" />
                        ) : (
                          <div className="file-icon-pdf">📄</div>
                        )}
                        <div className="file-details">
                          <div className="file-name">{fileObj.name}</div>
                          <div className="file-size">{formatFileSize(fileObj.size)}</div>
                          {fileObj.type === 'application/pdf' && (
                            <div className="file-type-badge">PDF</div>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(fileObj.id)}
                        className="remove-file-btn"
                        disabled={loading}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Language Input */}
          <div className="upload-section">
            <label htmlFor="language" className="section-label">
              <span className="label-icon">🌐</span>
              Language
            </label>
            <input
              type="text"
              id="language"
              value={language}
              onChange={handleLanguageChange}
              placeholder="Enter language (e.g., English, Spanish, French)"
              className="form-input"
              disabled={loading}
              required
            />
            <p className="input-hint">Specify the language of the content in your documents</p>
          </div>

          {/* Number of Questions */}
          <div className="upload-section">
            <label htmlFor="numQuestions" className="section-label">
              <span className="label-icon">❓</span>
              Number of Questions
            </label>
            <div className="num-questions-wrapper">
              <input
                type="number"
                id="numQuestions"
                value={numQuestions}
                onChange={handleNumQuestionsChange}
                min="5"
                max="500"
                className="form-input num-questions-input"
                disabled={loading}
                required
              />
              <div className="num-questions-controls">
                <button
                  type="button"
                  onClick={() => setNumQuestions(prev => Math.max(5, prev - 1))}
                  className="num-btn"
                  disabled={loading || numQuestions <= 5}
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => setNumQuestions(prev => Math.min(500, prev + 1))}
                  className="num-btn"
                  disabled={loading || numQuestions >= 500}
                >
                  +
                </button>
              </div>
            </div>
            <p className="input-hint">Select between 5 and 500 questions per quiz</p>
          </div>

          {/* Generate Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="generate-btn"
              disabled={loading || files.length === 0 || !language.trim()}
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  <span>Generating Quiz...</span>
                </>
              ) : (
                <>
                  <span className="btn-icon">✨</span>
                  <span>Generate Quiz</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
