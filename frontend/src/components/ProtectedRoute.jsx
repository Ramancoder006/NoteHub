import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current login session
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setLoading(false);
    };

    checkSession();

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Wait while checking login
  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px",
          fontSize: "18px",
        }}
      >
        Checking login...
      </div>
    );
  }

  // Not logged in
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Logged in
  return children;
}

export default ProtectedRoute;