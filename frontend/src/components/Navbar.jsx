import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";
import { supabase } from "../supabaseClient";

function Navbar() {
  const navigate = useNavigate();

  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get current login session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}

        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            📚
          </div>

          <div className="logo-text">
            <span>NoteHub</span>
            <small>Learn. Share. Grow.</small>
          </div>
        </Link>

        {/* NAVIGATION */}

        <div className="nav-links">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-active" : ""
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/notes"
            className={({ isActive }) =>
              isActive ? "nav-active" : ""
            }
          >
            Browse Notes
          </NavLink>

          {session && (
            <>
              <NavLink
                to="/upload"
                className={({ isActive }) =>
                  isActive ? "nav-active" : ""
                }
              >
                Upload
              </NavLink>

              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "nav-active" : ""
                }
              >
                Dashboard
              </NavLink>
            </>
          )}

        </div>

        {/* RIGHT SIDE */}

        <div className="navbar-actions">

          {session ? (
            <>
              <div className="navbar-user">

                <div className="user-avatar">
                  {session.user.email
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div className="user-details">
                  <span>Student</span>
                  <small>
                    {session.user.email}
                  </small>
                </div>

              </div>

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="navbar-login"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="navbar-register"
              >
                Get Started
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;