
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Upload.css";

export default function UploadNotes() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    subject: "",
    semester: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const selectFile = (selected) => {
    setError("");

    if (!selected) return;

    if (
      selected.type !== "application/pdf" ||
      !selected.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF files are allowed.");
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError("Maximum file size is 10 MB.");
      return;
    }

    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } =
        await supabase.auth.getSession();

      if (authError) throw authError;

      if (!data.session) {
        navigate("/login");
        return;
      }

      const body = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        body.append(key, value);
      });

      body.append("file", file);

      const response = await fetch(
        "http://127.0.0.1:8000/upload-note",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${data.session.access_token}`,
          },
          body,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Upload failed.");
      }

      setSuccess("Your notes were uploaded successfully!");

      setForm({
        title: "",
        subject: "",
        semester: "",
        description: "",
      });

      setFile(null);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="nh-upload-page">
      <div className="nh-upload-container">
        <header className="nh-upload-heading">
          <span className="nh-eyebrow">CONTRIBUTE TO NOTEHUB</span>
          <h1>Share your knowledge.</h1>
          <p>
            Upload your study materials and help other
            students learn and succeed.
          </p>
        </header>

        <div className="nh-upload-layout">
          <section className="nh-upload-card">
            <div className="nh-card-heading">
              <div className="nh-heading-icon">📄</div>
              <div>
                <h2>Upload Study Notes</h2>
                <p>Fill in the details below.</p>
              </div>
            </div>

            {error && (
              <div className="nh-alert nh-error" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="nh-alert nh-success" role="status">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="nh-field">
                <label htmlFor="note-title">Note Title</label>
                <input
                  id="note-title"
                  name="title"
                  placeholder="e.g. Operating Systems Unit 1"
                  value={form.title}
                  onChange={update}
                  required
                />
              </div>

              <div className="nh-field-row">
                <div className="nh-field">
                  <label htmlFor="note-subject">Subject</label>
                  <input
                    id="note-subject"
                    name="subject"
                    placeholder="e.g. Operating Systems"
                    value={form.subject}
                    onChange={update}
                    required
                  />
                </div>

                <div className="nh-field">
                  <label htmlFor="note-semester">Semester</label>
                  <select
                    id="note-semester"
                    name="semester"
                    value={form.semester}
                    onChange={update}
                    required
                  >
                    <option value="">Select Semester</option>
                    {Array.from({ length: 8 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Semester {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="nh-field">
                <label htmlFor="note-description">
                  Description
                </label>
                <textarea
                  id="note-description"
                  name="description"
                  rows="4"
                  placeholder="What topics do these notes cover?"
                  value={form.description}
                  onChange={update}
                  required
                />
              </div>

              <div className="nh-field">
                <label>Upload PDF</label>

                <div
                  className={`nh-dropzone ${
                    dragging ? "nh-dragging" : ""
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    selectFile(e.dataTransfer.files[0]);
                  }}
                >
                  <div className="nh-drop-icon">☁️</div>

                  <h3>
                    {file
                      ? file.name
                      : "Drag and drop your PDF here"}
                  </h3>

                  <p>
                    {file
                      ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                      : "PDF format only • Maximum 10 MB"}
                  </p>

                  <label
                    className="nh-file-picker"
                    htmlFor="note-pdf"
                  >
                    {file ? "Change PDF" : "Choose PDF"}
                  </label>

                  <input
                    id="note-pdf"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) =>
                      selectFile(e.target.files[0])
                    }
                    hidden
                  />
                </div>
              </div>

              <button
                type="submit"
                className="nh-submit"
                disabled={loading}
              >
                {loading
                  ? "Uploading..."
                  : "↑ Upload Notes"}
              </button>
            </form>
          </section>

          <aside className="nh-upload-sidebar">
            <div className="nh-tip-card">
              <div className="nh-tip-icon">✨</div>
              <h3>Make your notes stand out</h3>
              <p>
                A descriptive title and subject make it
                easier for students to discover your work.
              </p>
            </div>

            <div className="nh-tip-card">
              <div className="nh-tip-icon">🛡️</div>
              <h3>Upload responsibly</h3>
              <p>
                Share clear, useful PDF materials that
                you have permission to distribute.
              </p>
            </div>

            <div className="nh-tip-card">
              <div className="nh-tip-icon">📊</div>
              <h3>Track your contributions</h3>
              <p>
                Visit your Dashboard to see your uploads
                and their view counts.
              </p>
              <button
                type="button"
                className="nh-dashboard-link"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard →
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
