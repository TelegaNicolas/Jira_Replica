import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/users/register', {
        email: form.email,
        password: form.password,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register__bg">
        <div className="register__grid" />
        <div className="register__glow" />
      </div>

      <nav className="register__nav">
        <Link to="/" className="register__nav-logo">TJ</Link>
      </nav>

      <main className="register__main">
        <div className="register__card">
          <h1 className="register__title">S'enregistrer</h1>
          <p className="register__subtitle">Créez votre compte Telega Jira</p>

          {error && <div className="register__error">{error}</div>}

          <form className="register__form" onSubmit={handleSubmit}>
            <div className="register__field">
              <label className="register__label">Email</label>
              <input
                className="register__input"
                type="email"
                name="email"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register__field">
              <label className="register__label">Mot de passe</label>
              <input
                className="register__input"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register__field">
              <label className="register__label">Confirmer le mot de passe</label>
              <input
                className="register__input"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="register__btn"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Inscription...' : "S'enregistrer"}
            </button>
          </form>

          <p className="register__footer">
            Déjà un compte ?{' '}
            <Link to="/login" className="register__link">Se connecter</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;
