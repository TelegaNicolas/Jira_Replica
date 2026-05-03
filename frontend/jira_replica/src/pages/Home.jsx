import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="home__bg">
        <div className="home__grid" />
        <div className="home__glow" />
      </div>

      <nav className="home__nav">
        <span className="home__nav-logo">TJ</span>
      </nav>

      <main className="home__main">
        <div className="home__badge">Project Management Reimagined</div>

        <h1 className="home__title">
          <span className="home__title-line">Telega</span>
          <span className="home__title-line home__title-line--accent">Jira</span>
        </h1>

        <p className="home__subtitle">
          Track issues, manage projects and ship faster —<br />
          all in one place.
        </p>

        <div className="home__actions">
          <button
            className="home__btn home__btn--primary"
            onClick={() => navigate('/login')}
          >
            Se connecter
          </button>
          <button
            className="home__btn home__btn--secondary"
            onClick={() => navigate('/register')}
          >
            S'enregistrer
          </button>
        </div>
      </main>

      <footer className="home__footer">
        <span>© 2026 Telega Jira</span>
      </footer>
    </div>
  );
};

export default Home;
