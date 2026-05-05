import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const getPriority = (issues) => {
  if (!issues || issues.length === 0) return null;
  if (issues.some(i => i.priority === 'High')) return 'High';
  if (issues.some(i => i.priority === 'Medium')) return 'Medium';
  return 'Low';
};

const PriorityBadge = ({ priority }) => {
  if (!priority) return <span className="dash-badge dash-badge--none">Aucune issue</span>;
  if (priority === 'High') return <span className="dash-badge dash-badge--high">🔴 Urgent</span>;
  if (priority === 'Medium') return <span className="dash-badge dash-badge--medium">🟡 Moyen</span>;
  return <span className="dash-badge dash-badge--low">🟢 Non urgent</span>;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [projectsWithPriority, setProjectsWithPriority] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/projects/getAll');
      setProjects(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setProjects([]);
      } else {
        setError('Erreur lors du chargement des projets.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Récupère les issues de chaque projet pour calculer la priorité
  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchIssues = async () => {
      const updated = await Promise.all(
        projects.map(async (project) => {
          try {
            const res = await axios.get(`/issues/getAll/${project.id}`);
            return { ...project, priority: getPriority(res.data) };
          } catch {
            return { ...project, priority: null };
          }
        })
      );
      setProjectsWithPriority(updated);
    };

    if (projects.length > 0) fetchIssues();
    else setProjectsWithPriority([]);
  }, [projects]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!form.name.trim()) {
      setFormError('Le nom est obligatoire.');
      return;
    }
    setFormLoading(true);
    try {
      await axios.post('/projects/create', form);
      setForm({ name: '', description: '' });
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Erreur lors de la création.');
    } finally {
      setFormLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="dash">
      <Navbar />

      <main className="dash__main">
        <div className="dash__header">
          <div>
            <h1 className="dash__title">Projets</h1>
            <p className="dash__subtitle">{projectsWithPriority.length} projet{projectsWithPriority.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="dash__btn-create" onClick={() => setShowModal(true)}>
            + Nouveau projet
          </button>
        </div>

        {loading && <p className="dash__loading">Chargement...</p>}
        {error && <p className="dash__error">{error}</p>}

        {!loading && !error && projectsWithPriority.length === 0 && (
          <div className="dash__empty">
            <p>Aucun projet pour l'instant.</p>
            <button className="dash__btn-create" onClick={() => setShowModal(true)}>
              Créer votre premier projet
            </button>
          </div>
        )}

        <div className="dash__grid">
          {projectsWithPriority.map((project) => (
            <div
              key={project.id}
              className="dash__card"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div className="dash__card-top">
                <h2 className="dash__card-name">{project.name}</h2>
                <PriorityBadge priority={project.priority} />
              </div>
              <p className="dash__card-desc">
                {project.description || <span className="dash__card-nodesc">Aucune description</span>}
              </p>
              <p className="dash__card-date">Créé le {formatDate(project.created_at)}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Modal créer projet */}
      {showModal && (
        <div className="dash__overlay" onClick={() => setShowModal(false)}>
          <div className="dash__modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="dash__modal-title">Nouveau projet</h2>

            {formError && <div className="dash__modal-error">{formError}</div>}

            <form className="dash__modal-form" onSubmit={handleCreate}>
              <div className="dash__modal-field">
                <label className="dash__modal-label">Nom *</label>
                <input
                  className="dash__modal-input"
                  type="text"
                  name="name"
                  placeholder="Mon projet"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="dash__modal-field">
                <label className="dash__modal-label">Description</label>
                <textarea
                  className="dash__modal-input dash__modal-textarea"
                  name="description"
                  placeholder="Description du projet..."
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="dash__modal-actions">
                <button
                  type="button"
                  className="dash__modal-btn dash__modal-btn--cancel"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="dash__modal-btn dash__modal-btn--submit"
                  disabled={formLoading}
                >
                  {formLoading ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
