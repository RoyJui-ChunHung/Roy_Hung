import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { Ticket, TicketPriority, TicketCategory, User } from '../../types/ticket.types';
import type { ApiResponse } from '../../../../shared/types/api.types';
import styles from './TicketForm.module.css';

const API_URL = 'http://localhost:4000/api';

export function TicketCreateForm() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [category, setCategory] = useState<TicketCategory>('bug');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const [users, setUsers] = useState<User[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<ApiResponse<User[]>>(`${API_URL}/users`);
        setUsers(response.data.data);
      } catch {
        // the form still works without assignees, so leave the dropdown as "Unassigned"
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await axios.post<ApiResponse<Ticket>>(`${API_URL}/tickets`, {
        title,
        description,
        priority,
        category,
        reporterName,
        reporterEmail,
        assigneeId: assigneeId ? Number(assigneeId) : null,
      });
      navigate(`/tickets/${response.data.data.id}`);
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to create ticket' : 'Failed to create ticket');
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create Ticket</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <label htmlFor="title">Title *</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Description *</label>
          <textarea id="description" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="priority">Priority *</label>
            <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="category">Category *</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value as TicketCategory)}>
              <option value="bug">Bug</option>
              <option value="feature_request">Feature Request</option>
              <option value="question">Question</option>
              <option value="account_issue">Account Issue</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="reporterName">Reporter Name *</label>
            <input id="reporterName" type="text" value={reporterName} onChange={(e) => setReporterName(e.target.value)} required />
            </div>

          <div className={styles.field}>
            <label htmlFor="reporterEmail">Reporter Email *</label>
            <input id="reporterEmail" type="email" value={reporterEmail} onChange={(e) => setReporterEmail(e.target.value)} required />
            </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="assigneeId">Assignee</label>
          <select id="assigneeId" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.displayName}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton} disabled={submitting}>
            {submitting ? 'Saving...' : 'Create Ticket'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
