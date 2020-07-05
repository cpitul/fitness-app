import axios from "axios";
import React, { createContext, useState } from "react";

export const LoginContext = createContext();

const LoginState = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [activeUser, setActiveUser] = useState({});
  const [loading, setLoading] = useState(true);

  const toggleIsLogged = (bool) => setIsLogged(bool);

  const toggleActiveUser = (user) => setActiveUser(user);

  const toggleLoading = (bool) => setLoading(bool);

  const getLoggedUser = async (token) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    };
    try {
      const user = await axios.get("/api/login", config);
      setActiveUser(user.data);
      setIsLogged(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleLogin = async (user) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post("/api/login", user, config);

      setIsLogged(true);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      console.error(err.message);
      return err;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    setActiveUser({});
  };

  return (
    <LoginContext.Provider
      value={{
        isLogged,
        activeUser,
        loading,
        toggleLoading,
        toggleIsLogged,
        toggleActiveUser,
        handleLogin,
        handleLogout,
        getLoggedUser,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginState;
