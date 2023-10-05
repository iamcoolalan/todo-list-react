import { checkPermission, login, register } from "api/auth";
import { createContext, useContext, useEffect, useState } from "react";
import * as jwt from "jsonwebtoken";
import { useLocation } from "react-router-dom";

const defaultAuthContext = {
  isAuthenticated: false,
  currentMember: null,
  register: null,
  login: null,
  logout: null
}

const AuthContext = createContext(defaultAuthContext)

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [payload, setPayload] = useState(null)

  const { pathname } = useLocation()

  useEffect(() => {
    const checkTokenIsValid = async () => {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        setIsAuthenticated(false);
        setPayload(null);
        return
      }

      const result = await checkPermission(authToken);

      if (result) {
        const temptPayload = jwt.decode(authToken);

        setIsAuthenticated(true);
        setPayload(temptPayload);
      } else {
        setIsAuthenticated(false);
        setPayload(null);
      }
    };

    checkTokenIsValid();
  }, [pathname]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentMember: payload && {
          id: payload.sub,
          name: payload.name
        },
        register: async (data) => {
          const { success, authToken } = await register({
            username: data.userName,
            email: data.userEmail,
            password: data.password,
          });

          const temptPayload = jwt.decode(authToken);

          if (temptPayload) {
            setIsAuthenticated(true);
            setPayload(temptPayload);
            localStorage.setItem('authToken', authToken);
          } else {
            setIsAuthenticated(false);
            setPayload(null);
          }

          return success
        },
        login: async (data) => {
          const { success, authToken } = await login({
            username: data.userName,
            password: data.password,
          });

          const temptPayload = jwt.decode(authToken);

          if (temptPayload) {
            setIsAuthenticated(true);
            setPayload(temptPayload);
            localStorage.setItem('authToken', authToken);
          } else {
            setIsAuthenticated(false);
            setPayload(null);
          }

          return success;
        },
        logout: () => {
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
          setPayload(null);
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
 
}