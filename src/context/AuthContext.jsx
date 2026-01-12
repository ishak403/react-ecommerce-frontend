import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { fetchUser } from "../api/users";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Auth parse error:", err);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (token, initialUser) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setToken(token);

    try {
      const response = await fetchUser();
      const userDetails = response.data.data;
      localStorage.setItem("user", JSON.stringify(userDetails));
      setUser(userDetails);
      return userDetails;
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      // Fallback to initial user if fetch fails
      localStorage.setItem("user", JSON.stringify(initialUser));
      setUser(initialUser);
      return initialUser;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
