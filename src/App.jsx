import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";

function App() {
  function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <button onClick={() => window.history.back()}>Go Back</button>
      <button onClick={() => window.location.href = '/dashboard/home'}>
        Go to Home
      </button>
    </div>
  );
}
  return (
    <Routes>
  <Route path="/dashboard/*" element={<Dashboard />} />
  <Route path="/auth/*" element={<Auth />} />
   {/* Redirect root path to dashboard */}
  <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
  <Route path="/404" element={<NotFound />} />
  <Route path="*" element={<Navigate to="/404" replace />} />
</Routes>
  );
}

export default App;
