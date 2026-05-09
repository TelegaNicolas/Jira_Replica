import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.newPassword !== form.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    if (form.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);
    try {
      await axios.put('/users/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess('Mot de passe modifié avec succès.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile">
      <Navbar />

      <main className="profile__main">
        <div className="profile__header">
          <h1 className="profile__title">Profil</h1>
        </div>

        <div className="profile__content">
          {/* Infos utilisateur */}
          <div className="profile__card">
            <h2 className="profile__card-title">Informations</h2>
            <div className="profile__info">
              <div className="profile__avatar">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div>
                <p className="profile__email">{user?.email}</p>
                <p className="profile__role">Membre</p>
              </div>
            </div>
          </div>

          {/* Changer mot de passe */}
          <div className="profile__card">
            <h2 className="profile__card-title">Changer le mot de passe</h2>

            {error && <div className="profile__error">{error}</div>}
            {success && <div className="profile__success">{success}</div>}

            <form className="profile__form" onSubmit={handleChangePassword}>
              <div className="profile__field">
                <label className="profile__label">Mot de passe actuel</label>
                <input
                  className="profile__input"
                  type="password"
                  name="currentPassword"
                  placeholder="••••••••"
                  value={form.currentPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="profile__field">
                <label className="profile__label">Nouveau mot de passe</label>
                <input
                  className="profile__input"
                  type="password"
                  name="newPassword"
                  placeholder="••••••••"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="profile__field">
                <label className="profile__label">Confirmer le nouveau mot de passe</label>
                <input
                  className="profile__input"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                className="profile__btn profile__btn--save"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Modification...' : 'Modifier le mot de passe'}
              </button>
            </form>
          </div>

          {/* Déconnexion */}
          <div className="profile__card">
            <h2 className="profile__card-title">Session</h2>
            <p className="profile__card-desc">Vous serez redirigé vers la page d'accueil.</p>
            <button
              className="profile__btn profile__btn--logout"
              onClick={handleLogout}
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
