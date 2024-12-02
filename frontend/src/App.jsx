import Home from "./pages/home";
import NotFound from "./pages/notFound";
import Dashboard from "./pages/dashboard";
import AuthProvider from "./context/authContext";
import ServiceProvider from "./context/serviceContext";
import AppointmentProvider from "./context/appointmentContext";

import { QueryClientProvider } from "react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./service/queryClient";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <HelmetProvider>
          <AuthProvider>
            <ServiceProvider>
              <AppointmentProvider>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>

                <Toaster />
              </AppointmentProvider>
            </ServiceProvider>
          </AuthProvider>
        </HelmetProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
