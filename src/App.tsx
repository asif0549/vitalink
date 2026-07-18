import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Donors from "./pages/Donors";
import Hospitals from "./pages/Hospitals";
import Receivers from "./pages/Receivers";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Emergency from "./pages/Emergency";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import DonorDashboard from "./pages/dashboards/DonorDashboard";
import ReceiverDashboard from "./pages/dashboards/ReceiverDashboard";
import HospitalDashboard from "./pages/dashboards/HospitalDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Role-Based Dashboard Routes */}
              <Route path="/dashboard/donor" element={<DonorDashboard />} />
              <Route path="/dashboard/receiver" element={<ReceiverDashboard />} />
              <Route path="/dashboard/hospital" element={<HospitalDashboard />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />

              {/* Legacy fallback pages */}
              <Route path="/donors" element={<Donors />} />
              <Route path="/hospitals" element={<Hospitals />} />
              <Route path="/receivers" element={<Receivers />} />
              
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
