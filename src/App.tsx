
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MessagingProvider } from "./contexts/MessagingContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Ideas from "./pages/Ideas";
import IdeaDetails from "./pages/IdeaDetails";
import SubmitIdea from "./pages/SubmitIdea";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import SubmitJob from "./pages/SubmitJob";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import Teams from "./pages/Teams";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <MessagingProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ideas" element={<Ideas />} />
                <Route path="/ideas/:id" element={<IdeaDetails />} />
                <Route path="/submit-idea" element={<SubmitIdea />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/submit-job" element={<SubmitJob />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:username" element={<PublicProfile />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/search" element={<Search />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </MessagingProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
