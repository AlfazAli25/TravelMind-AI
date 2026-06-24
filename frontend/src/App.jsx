import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import ExtractionReviewPage from './pages/ExtractionReviewPage';
import ItineraryPage from './pages/ItineraryPage';
import ItineraryListPage from './pages/ItineraryListPage';
import SharedItineraryPage from './pages/SharedItineraryPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-dark-950 flex flex-col">
          <Routes>
            {/* Public shared page — no navbar */}
            <Route path="/share/:shareId" element={<SharedItineraryPage />} />

            {/* All other routes — with navbar */}
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      {/* Public */}
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />

                      {/* Protected */}
                      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                      <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
                      <Route path="/review" element={<ProtectedRoute><ExtractionReviewPage /></ProtectedRoute>} />
                      <Route path="/itinerary/:id" element={<ProtectedRoute><ItineraryPage /></ProtectedRoute>} />
                      <Route path="/itineraries" element={<ProtectedRoute><ItineraryListPage /></ProtectedRoute>} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#6366f1', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
