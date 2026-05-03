import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post('/users/login', form);
      login(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__bg">
        <div className="login__grid" />
        <div className="login__glow" />
      </div>

      <nav className="login__nav">
        <Link to="/" className="login__nav-logo">TJ</Link>
      </nav>

      <main className="login__main">
        <div className="login__card">
          <h1 className="login__title">Se connecter</h1>
          <p className="login__subtitle">Bon retour sur Telega Jira</p>

          {error && <div className="login__error">{error}</div>}

          <form className="login__form" onSubmit={handleSubmit}>
            <div className="login__field">
              <label className="login__label">Email</label>
              <input
                className="login__input"
                type="email"
                name="email"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login__field">
              <label className="login__label">Mot de passe</label>
              <input
                className="login__input"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="login__btn"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="login__footer">
            Pas encore de compte ?{' '}
            <Link to="/register" className="login__link">S'enregistrer</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
