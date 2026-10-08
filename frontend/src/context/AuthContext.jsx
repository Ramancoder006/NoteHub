import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    // ==========================================
    // GET EXISTING SESSION
    // ==========================================

    const getSession = async () => {

      try {

        const {
          data,
          error
        } = await supabase.auth.getSession();


        if (error) {
          console.error(
            "Session error:",
            error
          );
        }


        setSession(
          data.session ?? null
        );


        setUser(
          data.session?.user ?? null
        );


      } catch (error) {

        console.error(
          "Authentication error:",
          error
        );


      } finally {

        setLoading(false);

      }

    };


    getSession();


    // ==========================================
    // LISTEN FOR AUTH CHANGES
    // ==========================================

    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {

        setSession(
          newSession ?? null
        );


        setUser(
          newSession?.user ?? null
        );


        setLoading(false);

      }
    );


    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {

      subscription.unsubscribe();

    };

  }, []);


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = async () => {

    const {
      error
    } = await supabase.auth.signOut();


    if (error) {

      console.error(
        "Logout error:",
        error
      );

      throw error;

    }

  };


  // ==========================================
  // USER DISPLAY NAME
  // ==========================================

  const userName =

    user?.user_metadata?.full_name ||

    user?.email?.split("@")[0] ||

    "Student";


  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = {

    user,

    session,

    loading,

    logout,

    userName,

    isLoggedIn: Boolean(user),

  };


  return (

    <AuthContext.Provider value={value}>

      {children}

    </AuthContext.Provider>

  );

}


// ==========================================
// CUSTOM HOOK
// ==========================================

export function useAuth() {

  const context = useContext(
    AuthContext
  );


  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );

  }


  return context;

}