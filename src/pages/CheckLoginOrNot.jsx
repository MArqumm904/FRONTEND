import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Preloader from "../components/preloader/Preloader";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuth(false);
      return;
    }
    fetch(import.meta.env.VITE_API_BASE_URL + "/check-auth", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.ok)
      .then((ok) => setIsAuth(ok))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) return <Preloader />;
  if (!isAuth) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute; 