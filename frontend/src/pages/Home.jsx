import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleCreateQuiz = () => {
    if (isAuthenticated) {
      navigate('/upload');
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Create and share quizzes in seconds with our intuitive interface'
    },
    {
      icon: '🤖',
      title: 'AI Powered',
      description: 'Leverage AI to generate questions and enhance your quiz experience'
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Track performance with detailed statistics and insights'
    },
    {
      icon: '🎨',
      title: 'Customizable',
      description: 'Personalize your quizzes with themes, images, and branding'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Works seamlessly on all devices - desktop, tablet, and mobile'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Select Quiz',
      description: 'Choose a quiz from available options',
      icon: '📝'
    },
    {
      number: '02',
      title: 'Read Questions',
      description: 'Carefully read each question and options',
      icon: '👀'
    },
    {
      number: '03',
      title: 'Answer Questions',
      description: 'Select your answers and submit the quiz',
      icon: '✅'
    },
    {
      number: '04',
      title: 'View Results',
      description: 'Get instant feedback and see your score',
      icon: '🏆'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Teacher',
      image: '👩‍🏫',
      text: 'This platform has revolutionized how I create quizzes for my students. The AI features are incredible!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Corporate Trainer',
      image: '👨‍💼',
      text: 'Perfect for team building activities. My colleagues love the interactive quizzes!',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Student',
      image: '👩‍🎓',
      text: 'Makes studying so much more fun. The real-time feedback helps me learn faster.',
      rating: 5
    }
  ];

  // const stats = [
  //   { value: '10K+', label: 'Active Users' },
  //   { value: '50K+', label: 'Quizzes Created' },
  //   { value: '1M+', label: 'Questions Answered' },
  //   { value: '98%', label: 'Satisfaction Rate' }
  // ];

  return (
    <div className="home-wrapper">
      {/* Navigation Header - Show Navbar for logged-in users, home-nav for guests */}
      {isAuthenticated ? (
        <Navbar />
      ) : (
        <nav className="home-nav">
          <div className="home-nav-container">
            <Link to="/" className="home-logo">
              <span className="logo-icon">🧠</span>
              <span className="logo-text">AI Quiz Platform</span>
            </Link>
            <div className="home-nav-links">
              <Link to="/login" className="nav-link-button">Login</Link>
              <Link to="/register" className="nav-link-button">Sign Up</Link>
            </div>
          </div>
        </nav>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Quiz Maker: Create a quiz to challenge your audience
              </h1>
              <p className="hero-description">
                Make fun interactive quizzes to test your colleagues' knowledge, run a quiz night with friends, or help students study.
              </p>
              <div className="hero-buttons">
                <button onClick={handleCreateQuiz} className="hero-cta-primary">
                  Create a quiz
                </button>
              </div>
            </div>

            <div className="hero-illustration">
              <div className="desktop-screen">
                <div className="screen-header">
                  <div className="window-controls">
                    <span className="control-dot red"></span>
                    <span className="control-dot yellow"></span>
                    <span className="control-dot green"></span>
                  </div>
                </div>
                <div className="screen-content">
                  <div className="quiz-question">What is the capital of Sweden?</div>
                  <div className="quiz-results">
                    <div className="result-bar correct">
                      <div className="bar-fill" style={{ height: '75%' }}></div>
                      <span className="bar-value">3</span>
                      <span className="bar-check">✓</span>
                    </div>
                    <div className="result-bar incorrect">
                      <div className="bar-fill" style={{ height: '25%' }}></div>
                      <span className="bar-value">1</span>
                      <span className="bar-x">✗</span>
                    </div>
                    <div className="result-bar incorrect">
                      <div className="bar-fill" style={{ height: '50%' }}></div>
                      <span className="bar-value">2</span>
                      <span className="bar-x">✗</span>
                    </div>
                  </div>
                  <div className="quiz-options">
                    <span>Stockholm</span>
                    <span>Copenhagen</span>
                    <span>Oslo</span>
                  </div>
                </div>
              </div>

              <div className="smartphone">
                <div className="phone-screen">
                  <div className="phone-emoji-circle">
                    <span className="phone-emoji">😻</span>
                    <span className="phone-check">✓</span>
                  </div>
                  <div className="phone-message">Correct answer!</div>
                </div>
              </div>

              <div className="abstract-shapes">
                <div className="shape-green"></div>
                <div className="shape-red-blocks">
                  <div className="red-block"></div>
                  <div className="red-block"></div>
                  <div className="red-block"></div>
                </div>
                <div className="shape-hand">👆</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-box">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section> */}

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-subtitle">Everything you need to create engaging quizzes</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attempt Quiz Section */}
      <section className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Attempt Quiz</h2>
            <p className="section-subtitle">Take quizzes in just four simple steps</p>
          </div>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                {index < steps.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-subtitle">Join thousands of satisfied users</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.image}</div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Create Your First Quiz?</h2>
            <p className="cta-description">
              Join thousands of users creating engaging quizzes today
            </p>
            <button onClick={handleCreateQuiz} className="cta-button">
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon">🧠</span>
                <span className="logo-text">AI Quiz Platform</span>
              </div>
              <p className="footer-description">
                Create engaging quizzes with AI-powered features
              </p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4 className="footer-heading">Product</h4>
                <Link to="/" className="footer-link">Features</Link>
                <Link to="/" className="footer-link">Pricing</Link>
                <Link to="/" className="footer-link">Updates</Link>
              </div>
              <div className="footer-column">
                <h4 className="footer-heading">Company</h4>
                <Link to="/" className="footer-link">About</Link>
                <Link to="/" className="footer-link">Blog</Link>
                <Link to="/" className="footer-link">Careers</Link>
              </div>
              <div className="footer-column">
                <h4 className="footer-heading">Support</h4>
                <Link to="/" className="footer-link">Help Center</Link>
                <Link to="/" className="footer-link">Contact</Link>
                <Link to="/" className="footer-link">Privacy</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 AI Quiz Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
