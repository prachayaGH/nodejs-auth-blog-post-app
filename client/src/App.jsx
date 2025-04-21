import { useEffect } from "react";
import "./App.css";
import { useAuth } from "./contexts/authentication";
import AuthenticatedApp from "./pages/AuthenticatedApp";
import UnauthenticatedApp from "./pages/UnauthenticatedApp";
import jwtInterceptor from "./utils/jwtInterceptor";

function App() {
  const auth = useAuth();

  useEffect(() => {
    jwtInterceptor();
  }, []); // <-- [] = เรียกครั้งเดียวตอน mount

  return auth.isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

export default App;
