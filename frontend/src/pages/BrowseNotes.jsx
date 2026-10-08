import { useEffect, useMemo, useState } from "react";
import "./BrowseNotes.css";

function BrowseNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");

  // ==========================================
  // LOAD NOTES
  // ==========================================

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/notes"
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail || "Unable to load notes."
        );
      }

      setNotes(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Fetch notes error:", err);
      setError(err.message || "Unable to load notes.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SUBJECT LIST
  // ==========================================

  const subjects = useMemo(() => {
    const uniqueSubjects = notes
      .map((note) => note.subject)
      .filter(Boolean);

    return [...new Set(uniqueSubjects)].sort();
  }, [notes]);

  // ==========================================
  // FILTER NOTES
  // ==========================================

  const filteredNotes = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return notes.filter((note) => {
      const title = (note.title || "").toLowerCase();
      const noteSubject = (note.subject || "").toLowerCase();
      const description = (
        note.description || ""
      ).toLowerCase();

      const matchesSearch =
        searchText === "" ||
        title.includes(searchText) ||
        noteSubject.includes(searchText) ||
        description.includes(searchText);

      const matchesSemester =
        semester === "" ||
        String(note.semester) === semester;

      const matchesSubject =
        subject === "" ||
        note.subject === subject;

      return (
        matchesSearch &&
        matchesSemester &&
        matchesSubject
      );
    });
  }, [notes, search, semester, subject]);

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setSemester("");
    setSubject("");
  };

  const filtersActive =
    search !== "" ||
    semester !== "" ||
    subject !== "";

  // ==========================================
  // VIEW NOTE + DOWNLOAD COUNT
  // ==========================================

  const handleViewNote = async (note) => {
    if (!note.file_url) {
      alert("PDF is not available for this note.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/notes/${note.id}/download`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            "Unable to update download count."
        );
      }

      setNotes((previousNotes) =>
        previousNotes.map((currentNote) =>
          currentNote.id === note.id
            ? {
                ...currentNote,
                downloads: result.downloads,
              }
            : currentNote
        )
      );

      window.open(
        note.file_url,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (err) {
      console.error("Download count error:", err);

      // PDF should still open if counter fails
      window.open(
        note.file_url,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="browse-page">
        <div className="browse-container">
          <div className="browse-loading">
            <div className="loading-circle">
              📚
            </div>

            <h2>Loading notes...</h2>

            <p>
              Finding study materials for you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="browse-page">

      {/* HEADER */}

      <section className="browse-hero">
        <div className="browse-container">

          <div className="browse-hero-content">

            <div>
              <span className="browse-tag">
                📚 STUDY RESOURCES
              </span>

              <h1>
                Find the notes you
                <span> need.</span>
              </h1>

              <p>
                Search study materials shared by
                students and find the right notes
                for your subjects.
              </p>
            </div>

            <div className="browse-hero-stat">
              <div className="browse-stat-icon">
                📄
              </div>

              <div>
                <strong>{notes.length}</strong>
                <span>Notes available</span>
              </div>
            </div>

          </div>
        </div>
      </section>


      <div className="browse-container browse-main">

        {/* ERROR */}

        {error && (
          <div className="browse-error">
            <span>⚠️</span>
            {error}
          </div>
        )}


        {/* SEARCH / FILTER CARD */}

        <div className="browse-filter-card">

          <div className="modern-search">

            <span className="modern-search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search notes by title, subject or topic..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            {search && (
              <button
                className="search-clear"
                onClick={() => setSearch("")}
                type="button"
              >
                ×
              </button>
            )}

          </div>


          <div className="modern-filter-row">

            <div className="filter-select-group">

              <span>🎓</span>

              <select
                value={semester}
                onChange={(event) =>
                  setSemester(event.target.value)
                }
              >
                <option value="">
                  All Semesters
                </option>

                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </select>

            </div>


            <div className="filter-select-group">

              <span>📖</span>

              <select
                value={subject}
                onChange={(event) =>
                  setSubject(event.target.value)
                }
              >
                <option value="">
                  All Subjects
                </option>

                {subjects.map((subjectName) => (
                  <option
                    key={subjectName}
                    value={subjectName}
                  >
                    {subjectName}
                  </option>
                ))}
              </select>

            </div>


            {filtersActive && (
              <button
                className="modern-clear-button"
                onClick={clearFilters}
              >
                × Clear filters
              </button>
            )}

          </div>

        </div>


        {/* RESULTS HEADER */}

        <div className="browse-results-header">

          <div>
            <h2>Study Notes</h2>

            <p>
              Showing{" "}
              <strong>
                {filteredNotes.length}
              </strong>{" "}
              {filteredNotes.length === 1
                ? "note"
                : "notes"}
            </p>
          </div>

          {filtersActive && (
            <span className="filtered-badge">
              Filters applied
            </span>
          )}

        </div>


        {/* NO RESULTS */}

        {filteredNotes.length === 0 ? (

          <div className="modern-empty-state">

            <div className="empty-search-icon">
              🔎
            </div>

            <h2>No notes found</h2>

            <p>
              We couldn't find any notes matching
              your current search and filters.
            </p>

            <button onClick={clearFilters}>
              Clear all filters
            </button>

          </div>

        ) : (

          // NOTES GRID

          <div className="modern-notes-grid">

            {filteredNotes.map((note) => (

              <article
                className="modern-note-card"
                key={note.id}
              >

                <div className="modern-card-header">

                  <div className="document-icon">
                    📄
                  </div>

                  <div className="card-badges">

                    <span className="pdf-badge-new">
                      PDF
                    </span>

                    <span className="semester-badge-new">
                      Sem {note.semester}
                    </span>

                  </div>

                </div>


                <div className="modern-card-body">

                  <span className="modern-subject">
                    {note.subject ||
                      "Study Material"}
                  </span>

                  <h3>{note.title}</h3>

                  <p className="modern-description">
                    {note.description ||
                      "Study material shared on NoteHub."}
                  </p>

                </div>


                <div className="modern-uploader">

                  <div className="small-avatar">
                    {(note.uploader || "S")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <span>Uploaded by</span>

                    <strong>
                      {note.uploader || "Student"}
                    </strong>
                  </div>

                </div>


                <div className="modern-card-footer">

                  <div className="download-info">
                    <span>↓</span>

                    <div>
                      <strong>
                        {note.downloads || 0}
                      </strong>

                      <small>downloads</small>
                    </div>
                  </div>


                  <button
                    className="view-note-button"
                    onClick={() =>
                      handleViewNote(note)
                    }
                  >
                    View Notes
                    <span>→</span>
                  </button>

                </div>

              </article>

            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default BrowseNotes;