import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase";
import "./Auth.css";


function Login() {

  const navigate = useNavigate();


  // ==========================================
  // FORM STATE
  // ==========================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    // Basic validation
    if (!email || !password) {

      setError(
        "Please enter your email and password."
      );

      return;
    }


    try {

      setLoading(true);


      // Login using Supabase Authentication
      const {
        data,
        error: loginError
      } = await supabase.auth.signInWithPassword({

        email: email,

        password: password,

      });


      // Supabase returned an error
      if (loginError) {

        throw loginError;

      }


      // Check user exists
      if (!data.user) {

        throw new Error(
          "Unable to login."
        );

      }


      console.log(
        "Logged in user:",
        data.user
      );


      setSuccess(
        "Login successful!"
      );


      // Wait briefly before redirecting
      setTimeout(() => {

        navigate("/dashboard");

      }, 700);


    } catch (err) {

      console.error(
        "Login error:",
        err
      );


      if (
        err.message ===
        "Invalid login credentials"
      ) {

        setError(
          "Incorrect email or password."
        );

      } else if (
        err.message ===
        "Email not confirmed"
      ) {

        setError(
          "Please confirm your email before logging in."
        );

      } else {

        setError(
          err.message ||
          "Unable to login. Please try again."
        );

      }


    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="form-page">

      <div className="form-card auth-card">


        <div className="auth-icon">
          📚
        </div>


        <h1>
          Welcome Back
        </h1>


        <p className="form-subtitle">

          Login to your NoteHub account.

        </p>


        {/* ERROR MESSAGE */}

        {error && (

          <div style={styles.errorMessage}>

            {error}

          </div>

        )}


        {/* SUCCESS MESSAGE */}

        {success && (

          <div style={styles.successMessage}>

            {success}

          </div>

        )}


        {/* LOGIN FORM */}

        <form onSubmit={handleLogin}>


          <label>
            Email Address
          </label>


          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            autoComplete="email"
            required
          />


          <label>
            Password
          </label>


          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            autoComplete="current-password"
            required
          />


          <button
            type="submit"
            className="form-button"
            disabled={loading}
            style={{
              opacity:
                loading ? 0.7 : 1,

              cursor:
                loading
                  ? "not-allowed"
                  : "pointer",
            }}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>


        <p className="auth-bottom">

          Don't have an account?{" "}

          <Link to="/register">

            Register

          </Link>

        </p>


      </div>

    </div>

  );

}


// ==========================================
// MESSAGE STYLES
// ==========================================

const styles = {

  errorMessage: {

    backgroundColor: "#fee2e2",

    color: "#991b1b",

    border: "1px solid #fecaca",

    padding: "12px",

    borderRadius: "7px",

    marginBottom: "20px",

    fontSize: "14px",

  },


  successMessage: {

    backgroundColor: "#dcfce7",

    color: "#166534",

    border: "1px solid #bbf7d0",

    padding: "12px",

    borderRadius: "7px",

    marginBottom: "20px",

    fontSize: "14px",

  },

};


export default Login;