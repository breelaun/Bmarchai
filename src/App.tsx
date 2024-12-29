import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Vendors from "./pages/Vendors";
import VendorProfile from "./pages/vendors/[id]";
import BlogsPage from "./pages/blogs";
import BlogCategory from "./pages/blogs/category/[category]";
import BlogTag from "./pages/blogs/tags/[tag]";
import BlogPost from "./pages/blogs/[id]";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
              <Route path="/vendors/new" element={<VendorProfile />} />
              <Route path="/vendors/:id" element={<VendorProfile />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/blogs/category/:category" element={<BlogCategory />} />
              <Route path="/blogs/tags/:tag" element={<BlogTag />} />
              <Route path="/blogs/:category/:slug" element={<BlogPost />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;