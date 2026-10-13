
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import API_URL from "../api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ==========================================
  // LOAD USER + USER'S NOTES
  // ==========================================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      // Get current Supabase session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      // Redirect if not logged in
      if (!session) {
        navigate("/login");
        return;
      }

      setUser(session.user);

      // Fetch user's notes from Render FastAPI backend
      const response = await fetch(
        `${API_URL}/my-notes`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result.detail === "string"
            ? result.detail
            : "Unable to load your notes."
        );
      }

      setNotes(result);
    } catch (err) {
      console.error("Dashboard loading error:", err);

      setError(
        err.message || "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE NOTE
  // ==========================================

  const handleDelete = async (noteId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(noteId);
      setError("");
      setMessage("");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session) {
        navigate("/login");
        return;
      }

      // Delete note through Render backend
      const response = await fetch(
        `${API_URL}/my-notes/${noteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result.detail === "string"
            ? result.detail
            : "Unable to delete note."
        );
      }

      // Remove deleted note from dashboard
      setNotes((previousNotes) =>
        previousNotes.filter(
          (note) => note.id !== noteId
        )
      );

      setMessage("Note deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);

      setError(
        err.message || "Unable to delete note."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // VIEW PDF
  // ==========================================

  const handleView = (fileUrl) => {
    if (!fileUrl) {
      alert("PDF is not available.");
      return;
    }

    window.open(
      fileUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <p className="dashboard-loading">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD UI
  // ==========================================

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Student Dashboard</h1>

            <p>
              Manage the notes you have uploaded.
            </p>

            {user && (
              <span className="dashboard-email">
                Logged in as: {user.email}
              </span>
            )}
          </div>

          <button
            className="dashboard-upload-button"
            onClick={() => navigate("/upload")}
          >
            + Upload Notes
          </button>
        </div>

        {message && (
          <div
            className="dashboard-success"
            role="status"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            className="dashboard-error"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="dashboard-stats">
          <div className="stat-card">
            <span>Total Notes</span>

            <strong>{notes.length}</strong>
          </div>

          <div className="stat-card">
            <span>Total Downloads</span>

            <strong>
              {notes.reduce(
                (total, note) =>
                  total + Number(note.downloads || 0),
                0
              )}
            </strong>
          </div>
        </div>

        <div className="dashboard-section-header">
          <h2>My Uploaded Notes</h2>

          <span>
            {notes.length}{" "}
            {notes.length === 1 ? "note" : "notes"}
          </span>
        </div>

        {notes.length === 0 ? (
          <div className="empty-dashboard">
            <div className="empty-icon">📚</div>

            <h2>No notes uploaded yet</h2>

            <p>
              Upload your first study note and it
              will appear here.
            </p>

            <button
              onClick={() => navigate("/upload")}
            >
              Upload Your First Note
            </button>
          </div>
        ) : (
          <div className="dashboard-grid">
            {notes.map((note) => (
              <div
                className="dashboard-note-card"
                key={note.id}
              >
                <div className="dashboard-card-top">
                  <span className="pdf-badge">
                    PDF
                  </span>

                  <span className="semester-badge">
                    Semester {note.semester}
                  </span>
                </div>

                <h3>{note.title}</h3>

                <p className="dashboard-subject">
                  {note.subject}
                </p>

                <p className="dashboard-description">
                  {note.description}
                </p>

                <div className="dashboard-note-info">
                  <span>
                    ↓ {note.downloads || 0} downloads
                  </span>
                </div>

                <div className="dashboard-card-actions">
                  <button
                    className="view-button"
                    onClick={() =>
                      handleView(note.file_url)
                    }
                  >
                    View PDF
                  </button>

                  <button
                    className="delete-button"
                    disabled={deletingId === note.id}
                    onClick={() =>
                      handleDelete(note.id)
                    }
                  >
                    {deletingId === note.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
