import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/auth/Profile";
import PuzzlePage from "./pages/PuzzlePage";
import ChatPage from "./pages/chat";
import { VideoProvider } from "@/contexts/VideoPlayerContext";

const App = () => {
  return (
    <Router>
      <VideoProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/puzzle" element={<PuzzlePage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
        <Footer />
      </VideoProvider>
    </Router>
  );
};

export default App;