import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Vendors from "./pages/Vendors";
import VendorProfile from "./pages/vendors/[id]";
import Startup from "./pages/vendors/Startup";
import BlogsPage from "./pages/blogs";
import BlogCategory from "./pages/blogs/category/[category]";
import BlogTag from "./pages/blogs/tags/[tag]";
import BlogPost from "./pages/blogs/[id]";
import CreateBlog from "./pages/blogs/new";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/auth/Profile";
import StreamingPage from "./pages/streaming";
import { supabase } from "./integrations/supabase/client";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-background text-foreground">
              <Navigation />
              <main className="flex-grow pt-16">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/vendors" element={<Vendors />} />
                  <Route path="/vendors/startup" element={<Startup />} />
                  <Route path="/vendors/new" element={<VendorProfile />} />
                  <Route path="/vendors/:id" element={<VendorProfile />} />
                  <Route path="/blogs" element={<BlogsPage />} />
                  <Route path="/blogs/new" element={<CreateBlog />} />
                  <Route path="/blogs/category/:category" element={<BlogCategory />} />
                  <Route path="/blogs/tags/:tag" element={<BlogTag />} />
                  <Route path="/blogs/:category/:slug" element={<BlogPost />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/streaming" element={<StreamingPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;