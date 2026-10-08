import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* ================= HERO ================= */}

      <section className="home-hero">
        <div className="hero-glow hero-glow-one"></div>
        <div className="hero-glow hero-glow-two"></div>

        <div className="home-container hero-container">

          <div className="hero-content">

            <div className="hero-badge">
              🎓 Built for students, by students
            </div>

            <h1>
              Study smarter.
              <br />
              <span>Share knowledge.</span>
            </h1>

            <p className="hero-description">
              Discover useful notes, assignments and study
              materials shared by students. Upload your own
              resources and help your classmates succeed.
            </p>

            <div className="hero-buttons">

              <Link
                to="/notes"
                className="hero-primary-button"
              >
                Browse Notes
                <span>→</span>
              </Link>

              <Link
                to="/upload"
                className="hero-secondary-button"
              >
                ↑ Upload Notes
              </Link>

            </div>

            <div className="hero-trust">

              <div className="hero-avatars">
                <span>A</span>
                <span>M</span>
                <span>R</span>
                <span>S</span>
              </div>

              <p>
                Join students sharing knowledge
                on NoteHub
              </p>

            </div>
          </div>


          {/* HERO VISUAL */}

          <div className="hero-visual">

            <div className="hero-card-main">

              <div className="hero-card-header">
                <div>
                  <span className="small-label">
                    FEATURED NOTES
                  </span>

                  <h3>
                    Find what you need.
                  </h3>
                </div>

                <div className="hero-book-icon">
                  📚
                </div>
              </div>

              <div className="fake-search">
                🔍
                <span>Search notes...</span>
              </div>


              <div className="preview-note-card">

                <div className="preview-icon">
                  📄
                </div>

                <div>
                  <strong>
                    Operating System Notes
                  </strong>

                  <span>
                    Computer Science • Semester 5
                  </span>
                </div>

                <div className="preview-download">
                  ↓ 24
                </div>

              </div>


              <div className="preview-note-card">

                <div className="preview-icon purple">
                  📘
                </div>

                <div>
                  <strong>
                    Computer Networks
                  </strong>

                  <span>
                    Networking • Semester 5
                  </span>
                </div>

                <div className="preview-download">
                  ↓ 18
                </div>

              </div>


              <div className="preview-note-card">

                <div className="preview-icon green">
                  📗
                </div>

                <div>
                  <strong>
                    Cloud Computing
                  </strong>

                  <span>
                    Cloud • Semester 5
                  </span>
                </div>

                <div className="preview-download">
                  ↓ 15
                </div>

              </div>

            </div>


            <div className="floating-card floating-top">
              <span>✓</span>

              <div>
                <strong>Easy to use</strong>
                <small>Find notes instantly</small>
              </div>
            </div>


            <div className="floating-card floating-bottom">
              <span>↑</span>

              <div>
                <strong>Share knowledge</strong>
                <small>Upload PDFs easily</small>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================= FEATURES ================= */}

      <section className="features-section">

        <div className="home-container">

          <div className="section-heading">

            <span className="section-tag">
              WHY NOTEHUB?
            </span>

            <h2>
              Everything you need to
              <span> study better</span>
            </h2>

            <p>
              A simple platform designed to make sharing
              and finding academic resources easier.
            </p>

          </div>


          <div className="features-grid">

            <div className="feature-card">

              <div className="feature-icon feature-purple">
                🔍
              </div>

              <h3>Find Notes</h3>

              <p>
                Quickly search study materials by
                subject, semester or topic.
              </p>

              <Link to="/notes">
                Browse resources →
              </Link>

            </div>


            <div className="feature-card">

              <div className="feature-icon feature-blue">
                ↑
              </div>

              <h3>Share Notes</h3>

              <p>
                Upload your PDF study materials and
                help other students learn.
              </p>

              <Link to="/upload">
                Upload notes →
              </Link>

            </div>


            <div className="feature-card">

              <div className="feature-icon feature-green">
                📚
              </div>

              <h3>Study Anywhere</h3>

              <p>
                Access useful academic resources
                whenever and wherever you need them.
              </p>

              <Link to="/notes">
                Start studying →
              </Link>

            </div>

          </div>
        </div>
      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section className="how-section">

        <div className="home-container">

          <div className="section-heading">

            <span className="section-tag">
              SIMPLE & FAST
            </span>

            <h2>
              How <span>NoteHub</span> works
            </h2>

            <p>
              Get started with NoteHub in three
              simple steps.
            </p>

          </div>


          <div className="steps-grid">

            <div className="step-item">
              <div className="step-number">
                01
              </div>

              <div className="step-icon">
                🔎
              </div>

              <h3>Discover</h3>

              <p>
                Search and filter notes uploaded
                by other students.
              </p>
            </div>


            <div className="step-line"></div>


            <div className="step-item">
              <div className="step-number">
                02
              </div>

              <div className="step-icon">
                📖
              </div>

              <h3>Learn</h3>

              <p>
                Open useful PDF notes and study
                the material you need.
              </p>
            </div>


            <div className="step-line"></div>


            <div className="step-item">
              <div className="step-number">
                03
              </div>

              <div className="step-icon">
                🚀
              </div>

              <h3>Contribute</h3>

              <p>
                Upload your own notes and help
                your classmates succeed.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* ================= CTA ================= */}

      <section className="home-cta">

        <div className="cta-glow"></div>

        <div className="cta-content">

          <span>📚</span>

          <h2>
            Ready to study smarter?
          </h2>

          <p>
            Discover notes shared by students or
            contribute your own study materials.
          </p>

          <div className="cta-buttons">

            <Link
              to="/notes"
              className="cta-primary"
            >
              Browse Notes →
            </Link>

            <Link
              to="/upload"
              className="cta-secondary"
            >
              Upload Notes
            </Link>

          </div>

        </div>
      </section>


      {/* ================= FOOTER ================= */}

      <footer className="home-footer">

        <div className="home-container footer-container">

          <div className="footer-brand">

            <div className="footer-logo">
              📚
            </div>

            <div>
              <strong>NoteHub</strong>

              <p>
                Learn. Share. Grow.
              </p>
            </div>

          </div>

          <p className="footer-text">
            Student Notes Sharing Platform
          </p>

          <p className="footer-copyright">
            © 2026 NoteHub
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Home;