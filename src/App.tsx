import { Routes, Route, Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Index from "@/pages/Index";
import Shop from "@/pages/Shop";
import Cart from "@/pages/Cart";
import Vendors from "@/pages/Vendors";
import CRM from "@/pages/crm";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://43b96a275e539584834b17b2d3d42192@o4508694101753856.ingest.us.sentry.io/4508694117089280",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const container = document.getElementById(“app”);
const root = createRoot(container);
root.render(<App />);

const App = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Catch all route - redirects to home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
