import React, { useState } from 'react';
import { createTicket } from '../utils/api';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export default function CreateTicketModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    customerEmail: '',
    priority: 'low'
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState(null);

  const validateField = (name, value) => {
    let error = '';
    if (!value || !value.trim()) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1).replace('customerEmail', 'Customer Email')} is required`;
    } else if (name === 'customerEmail' && !EMAIL_REGEX.test(value)) {
      error = 'Please enter a valid email address';
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Mark all as touched
      setTouched({
        subject: true,
        description: true,
        customerEmail: true,
        priority: true
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newTicket = await createTicket(formData);
      onCreated(newTicket);
      onClose();
    } catch (err) {
      // If server returned field-level errors
      if (err.message && err.message.includes('validation')) {
        setGeneralError(err.message);
      } else {
        setGeneralError(err.message || 'Failed to create ticket. Please check inputs.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create Support Ticket</h2>
          <button type="button" className="btn-close-modal" onClick={onClose}>✕</button>
        </div>

        {generalError && (
          <div className="modal-error-banner">
            ⚠ {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="form-group">
            <label htmlFor="subject" className="form-label">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              className={`form-input ${errors.subject ? 'input-error' : ''}`}
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="Summary of the issue"
            />
            {errors.subject && <span className="error-message">{errors.subject}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              className={`form-textarea ${errors.description ? 'input-error' : ''}`}
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              rows="4"
              placeholder="Detailed description of what is happening..."
            ></textarea>
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="customerEmail" className="form-label">Customer Email</label>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              className={`form-input ${errors.customerEmail ? 'input-error' : ''}`}
              value={formData.customerEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="name@example.com"
            />
            {errors.customerEmail && <span className="error-message">{errors.customerEmail}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="priority" className="form-label">Priority</label>
            <select
              id="priority"
              name="priority"
              className="form-select"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-mini"></span> Creating...
                </>
              ) : (
                'Create Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
