import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { SessionExpiredModal } from "./modals/Modals";
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSessionExpiredModal, setSessionExpiredModal] = useState(false);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  const INACTIVITY_LIMIT = Number(import.meta.env.VITE_IDLE_TIMEOUT || 600000); // 10 min padrão

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setLoading(false);

    if (token) {
      startIdleTimer();
      window.addEventListener("mousemove", resetIdleTimer);
      window.addEventListener("keydown", resetIdleTimer);
      window.addEventListener("touchstart", resetIdleTimer);
    }

    return () => {
      stopIdleTimer();
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      window.removeEventListener("touchstart", resetIdleTimer);
    };
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    startIdleTimer();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    stopIdleTimer();
    window.location.href = "/login";
  };

  const startIdleTimer = () => {
    stopIdleTimer();
    idleTimer.current = setTimeout(() => {
      setSessionExpiredModal(true);
    }, INACTIVITY_LIMIT);
  };

  const resetIdleTimer = () => {
    if (isAuthenticated) startIdleTimer();
  };

  const stopIdleTimer = () => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}

      {showSessionExpiredModal && (
        <SessionExpiredModal
          onConfirm={() => {
            setSessionExpiredModal(false);
            logout();
          }}
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
