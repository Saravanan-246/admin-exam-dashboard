import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  
  // Load user from localStorage if available
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("exam-admin-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Save user to localStorage when state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("exam-admin-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("exam-admin-user");
    }
  }, [user]);

  // Login Function
  const login = (userData) => {
    setUser(userData);
  };

  // Logout Function
  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
