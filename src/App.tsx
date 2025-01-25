import { Routes, Route, Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "@/pages/Index";
import Shop from "@/pages/Shop";
import Cart from "@/pages/Cart";
import Vendors from "@/pages/Vendors";
import CRM from "@/pages/crm";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

const App = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } 
          />
          <Route path="/vendors" element={<Vendors />} />
          <Route 
            path="/crm" 
            element={
              <ProtectedRoute>
                <CRM />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;