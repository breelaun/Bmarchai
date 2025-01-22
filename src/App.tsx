import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/auth/Profile";
import Vendors from "./pages/Vendors";
import VendorProfile from "./pages/vendors/[id]";
import ProductPage from "./pages/products/[id]";
import BlogsPage from "./pages/blogs";
import BlogPost from "./pages/blogs/[id]";
import NewBlog from "./pages/blogs/new";
import BlogCategory from "./pages/blogs/category/[category]";
import BlogTags from "./pages/blogs/tags/[tag]";
import ArtsPage from "./pages/arts";
import CRMPage from "./pages/crm";
import StreamingPage from "./pages/streaming";
import SessionsPage from "./pages/sessions";
import PaymentSuccess from "./pages/payment/success";
import PaymentCancel from "./pages/payment/cancel";
import AdminPage from "./pages/admin";
import FitnessPuzzle from "./pages/puzzle";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/vendors/:id" element={<VendorProfile />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/:id" element={<BlogPost />} />
            <Route path="/blogs/new" element={<NewBlog />} />
            <Route path="/blogs/category/:category" element={<BlogCategory />} />
            <Route path="/blogs/tags/:tag" element={<BlogTags />} />
            <Route path="/arts" element={<ArtsPage />} />
            <Route path="/crm" element={<CRMPage />} />
            <Route path="/streaming" element={<StreamingPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/puzzle" element={<FitnessPuzzle />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;