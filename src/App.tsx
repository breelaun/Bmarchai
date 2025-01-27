import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./components/cart/CartProvider";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Vendors from "./pages/Vendors";
import VendorProfile from "./pages/vendors/[id]";
import BlogsPage from "./pages/blogs";
import BlogCategory from "./pages/blogs/category/[category]";
import BlogTag from "./pages/blogs/tags/[tag]";
import BlogPost from "./pages/blogs/[id]";
import CreateBlog from "./pages/blogs/new";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/auth/Profile";
import StreamingPage from "./pages/streaming";
import ArtsPage from "./pages/arts";
import AdminPage from "./pages/admin";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import ProductPage from "./pages/products/[id]";
import SessionsPage from "./pages/sessions";
import CRMPage from "./pages/crm";
import { supabase } from "./integrations/supabase/client";
import { VideoProvider } from "./contexts/VideoPlayerContext";
import PersistentPlayer from "./components/PersistentPlayer";
import { useVideo } from "./contexts/VideoPlayerContext";

const queryClient = new QueryClient();

const AppContent = () => {
  const { activeVideo, setActiveVideo } = useVideo();
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navigation />
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/new" element={<VendorProfile />} />
          <Route path="/vendors/:id" element={<VendorProfile />} />
          <Route path="/vendors/profile" element={<VendorProfile />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/new" element={<CreateBlog />} />
          <Route path="/blogs/category/:category" element={<BlogCategory />} />
          <Route path="/blogs/tags/:tag" element={<BlogTag />} />
          <Route path="/blogs/:category/:slug" element={<BlogPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/streaming" element={<StreamingPage />} />
          <Route path="/arts" element={<ArtsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/crm" element={<CRMPage />} />
        </Routes>
      </main>
      <Footer />
      {activeVideo && (
        <PersistentPlayer
          videoUrl={activeVideo.url}
          title={activeVideo.title}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <CartProvider>
          <VideoProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </TooltipProvider>
          </VideoProvider>
        </CartProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;
