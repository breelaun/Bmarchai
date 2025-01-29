import { Routes, Route, Navigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import Navigation from './components/Navigation';
import Index from './pages/Index';
import Discover from './pages/Discover';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import AdminPage from './pages/AdminPage';
import AdminRoute from './AdminRoute';
import PuzzlePage from "./pages/PuzzlePage";
import ChatPage from "./pages/chat";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navigation />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/puzzle" element={<PuzzlePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </div>
  );
};

export default App;
