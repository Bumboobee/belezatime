import Home from "./pages/home";
import NotFound from "./pages/notFound";
import Dashboard from "./pages/dashboard";
import AuthProvider from "./context/authContext";

import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <HelmetProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </HelmetProvider>
    </Router>
  );
}

export default App;
