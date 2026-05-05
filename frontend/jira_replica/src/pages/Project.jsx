import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import './Project.css';

const COLUMNS = ['To Do', 'In Progress', 'Done'];

const PRIORITY_COLORS = {
  High: { label: '🔴 High', className: 'issue-badge--high' },
  Medium: { label: '🟡 Medium', className: 'issue-badge--medium' },
  Low: { label: '🟢 Low', className: 'issue-badge--low' },
};

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalColumn, setModalColumn] = useState('To Do');
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', assignee_id: '' });
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [projectRes, usersRes] = await Promise.all([
        axios.get(`/projects/get/${id}`),
        axios.get('/users/getAll'),
      ]);
      setProject(projectRes.data);
      setUsers(usersRes.data);

      try {
        const issuesRes = await axios.get(`/issues/getAll/${id}`);
        setIssues(issuesRes.data);
      } catch (err) {
        if (err.response?.status === 404) setIssues([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const getIssuesByStatus = (status) => issues.filter(i => i.status === status);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;
    const issueId = parseInt(draggableId);

    // Mise à jour optimiste
    setIssues(prev =>
      prev.map(i => i.id === issueId ? { ...i, status: newStatus } : i)
    );

    try {
      await axios.put(`/issues/update/${issueId}`, { updates: { status: newStatus } });
    } catch (err) {
      console.error(err);
      fetchData(); // rollback si erreur
    }
  };

  const openModal = (column) => {
    setModalColumn(column);
    setForm({ title: '', description: '', priority: 'Medium', assignee_id: '' });
    setFormError(null);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!form.title.trim()) {
      setFormError('Le titre est obligatoire.');
      return;
    }
    setFormLoading(true);
    try {
      await axios.post('/issues/create', {
        title: form.title,
        description: form.description,
        priority: form.priority,
        project_id: parseInt(id),
        assignee_id: form.assignee_id ? parseInt(form.assignee_id) : null,
        status: modalColumn,
      });
      setShowModal(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Erreur lors de la création.');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return (
    <div className="project">
      <Navbar />
      <p className="project__loading">Chargement...</p>
    </div>
  );

  return (
    <div className="project">
      <Navbar />

      <main className="project__main">
        <div className="project__header">
          <div>
            <h1 className="project__title">{project?.name}</h1>
            {project?.description && (
              <p className="project__desc">{project.description}</p>
            )}
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="project__board">
            {COLUMNS.map((column) => {
              const columnIssues = getIssuesByStatus(column);
              return (
                <div key={column} className="project__column">
                  <div className="project__column-header">
                    <span className="project__column-title">{column}</span>
                    <span className="project__column-count">{columnIssues.length}</span>
                  </div>

                  <Droppable droppableId={column}>
                    {(provided, snapshot) => (
                      <div
                        className={`project__column-body ${snapshot.isDraggingOver ? 'project__column-body--over' : ''}`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {columnIssues.map((issue, index) => (
                          <Draggable
                            key={issue.id}
                            draggableId={String(issue.id)}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                className={`project__card ${snapshot.isDragging ? 'project__card--dragging' : ''}`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => navigate(`/issues/${issue.id}`)}
                              >
                                <p className="project__card-title">{issue.title}</p>
                                <div className="project__card-footer">
                                  <span className={`issue-badge ${PRIORITY_COLORS[issue.priority]?.className}`}>
                                    {PRIORITY_COLORS[issue.priority]?.label}
                                  </span>
                                  {issue.assignee_id && (
                                    <span className="project__card-assignee">
                                      {users.find(u => u.id === issue.assignee_id)?.email?.[0].toUpperCase()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        <button
                          className="project__add-btn"
                          onClick={() => openModal(column)}
                        >
                          + Ajouter une issue
                        </button>
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </main>

      {showModal && (
        <div className="project__overlay" onClick={() => setShowModal(false)}>
          <div className="project__modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="project__modal-title">Nouvelle issue — {modalColumn}</h2>

            {formError && <div className="project__modal-error">{formError}</div>}

            <form className="project__modal-form" onSubmit={handleCreate}>
              <div className="project__modal-field">
                <label className="project__modal-label">Titre *</label>
                <input
                  className="project__modal-input"
                  type="text"
                  name="title"
                  placeholder="Titre de l'issue"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="project__modal-field">
                <label className="project__modal-label">Description</label>
                <textarea
                  className="project__modal-input project__modal-textarea"
                  name="description"
                  placeholder="Description de l'issue..."
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="project__modal-row">
                <div className="project__modal-field">
                  <label className="project__modal-label">Priorité</label>
                  <select
                    className="project__modal-input project__modal-select"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                  >
                    <option value="High">🔴 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>

                <div className="project__modal-field">
                  <label className="project__modal-label">Assigné à</label>
                  <select
                    className="project__modal-input project__modal-select"
                    name="assignee_id"
                    value={form.assignee_id}
                    onChange={handleChange}
                  >
                    <option value="">Non assigné</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.email}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="project__modal-actions">
                <button
                  type="button"
                  className="project__modal-btn project__modal-btn--cancel"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="project__modal-btn project__modal-btn--submit"
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

export default Project;
