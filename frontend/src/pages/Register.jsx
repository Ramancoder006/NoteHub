import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase";
import "./Auth.css";


function Register() {

  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {

    const {
      name,
      value
    } = event.target;


    setFormData((previousData) => ({

      ...previousData,

      [name]: value,

    }));

  };


  // ==========================================
  // REGISTER
  // ==========================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    if (
      formData.password !==
      formData.confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;

    }


    if (formData.password.length < 6) {

      setError(
        "Password must contain at least 6 characters."
      );

      return;

    }


    try {

      setLoading(true);


      const {
        data,
        error: signUpError
      } = await supabase.auth.signUp({

        email: formData.email,

        password: formData.password,

        options: {

          data: {
            full_name: formData.name,
          },

        },

      });


      if (signUpError) {

        throw signUpError;

      }


      console.log(
        "Registered user:",
        data.user
      );


      if (data.session) {

        setSuccess(
          "Account created successfully!"
        );


        setTimeout(() => {

          navigate("/");

        }, 1000);

      } else {

        setSuccess(
          "Account created. Please check your email to confirm your account."
        );

      }


    } catch (err) {

      console.error(
        "Registration error:",
        err
      );


      setError(
        err.message ||
        "Unable to create account."
      );


    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div style={styles.page}>

      <div style={styles.card}>


        <div style={styles.header}>

          <h1 style={styles.title}>
            Create Account
          </h1>

          <p style={styles.subtitle}>
            Join NoteHub and start sharing notes.
          </p>

        </div>


        {error && (

          <div style={styles.error}>
            {error}
          </div>

        )}


        {success && (

          <div style={styles.success}>
            {success}
          </div>

        )}


        <form onSubmit={handleSubmit}>


          <div style={styles.formGroup}>

            <label style={styles.label}>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />

          </div>


          <div style={styles.formGroup}>

            <label style={styles.label}>
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />

          </div>


          <div style={styles.formGroup}>

            <label style={styles.label}>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />

          </div>


          <div style={styles.formGroup}>

            <label style={styles.label}>
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
            />

          </div>


          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,

              opacity:
                loading ? 0.7 : 1,
            }}
          >

            {loading
              ? "Creating Account..."
              : "Create Account"}

          </button>

        </form>


        <p style={styles.loginText}>

          Already have an account?{" "}

          <Link
            to="/login"
            style={styles.link}
          >
            Login
          </Link>

        </p>

      </div>

    </div>

  );

}


const styles = {

  page: {

    minHeight:
      "calc(100vh - 70px)",

    display:
      "flex",

    justifyContent:
      "center",

    alignItems:
      "center",

    backgroundColor:
      "#f5f7fb",

    padding:
      "40px 20px",

  },


  card: {

    width:
      "100%",

    maxWidth:
      "450px",

    backgroundColor:
      "#ffffff",

    padding:
      "35px",

    borderRadius:
      "12px",

    border:
      "1px solid #e2e8f0",

  },


  header: {

    marginBottom:
      "28px",

  },


  title: {

    margin:
      "0 0 8px 0",

    fontSize:
      "30px",

    color:
      "#111827",

  },


  subtitle: {

    margin:
      0,

    color:
      "#64748b",

  },


  formGroup: {

    marginBottom:
      "20px",

  },


  label: {

    display:
      "block",

    marginBottom:
      "7px",

    fontWeight:
      "600",

    color:
      "#1f2937",

  },


  input: {

    width:
      "100%",

    boxSizing:
      "border-box",

    padding:
      "12px 14px",

    border:
      "1px solid #d1d5db",

    borderRadius:
      "7px",

    fontSize:
      "15px",

  },


  button: {

    width:
      "100%",

    padding:
      "13px",

    backgroundColor:
      "#4f46e5",

    color:
      "#ffffff",

    border:
      "none",

    borderRadius:
      "7px",

    fontSize:
      "15px",

    fontWeight:
      "600",

    cursor:
      "pointer",

  },


  error: {

    backgroundColor:
      "#fee2e2",

    color:
      "#991b1b",

    padding:
      "12px",

    borderRadius:
      "7px",

    marginBottom:
      "20px",

  },


  success: {

    backgroundColor:
      "#dcfce7",

    color:
      "#166534",

    padding:
      "12px",

    borderRadius:
      "7px",

    marginBottom:
      "20px",

  },


  loginText: {

    textAlign:
      "center",

    marginTop:
      "22px",

    color:
      "#64748b",

  },


  link: {

    color:
      "#4f46e5",

    fontWeight:
      "600",

    textDecoration:
      "none",

  },

};


export default Register;