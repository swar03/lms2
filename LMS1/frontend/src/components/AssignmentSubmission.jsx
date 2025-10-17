import { useState } from 'react';

export default function AssignmentSubmission({ assignment, onSubmit, onClose }) {
  const [gdriveLink, setGdriveLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!gdriveLink.trim()) {
      setError('Please provide a Google Drive link');
      return;
    }

    if (!gdriveLink.includes('drive.google.com') && !gdriveLink.includes('docs.google.com')) {
      setError('Please provide a valid Google Drive link');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          assignmentId: assignment.id,
          gdriveLink: gdriveLink.trim()
        })
      });

      if (response.ok) {
        onSubmit?.();
        onClose?.();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit assignment');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Submit Assignment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-white mb-2">{assignment.title}</h4>
          {assignment.description && (
            <p className="text-gray-400 text-sm mb-2">{assignment.description}</p>
          )}
          {assignment.taskUrl && (
            <a
              href={assignment.taskUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              📋 View Assignment Instructions
            </a>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Google Drive Link *
            </label>
            <input
              type="url"
              value={gdriveLink}
              onChange={(e) => setGdriveLink(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Share your Google Drive file/folder with view access and paste the link here
            </p>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900 bg-opacity-20 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}