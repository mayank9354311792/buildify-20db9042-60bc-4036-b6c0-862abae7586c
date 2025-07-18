
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import BuildBuddy from './pages/BuildBuddy';
import Book from './pages/Book';
import Xplore from './pages/Xplore';
import MyTrips from './pages/MyTrips';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Create a client for React Query
const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/landing" element={<Landing />} />
              <Route path="/onboarding" element={<Onboarding />} />
              
              {/* Redirect from Index to Landing */}
              <Route path="/index" element={<Navigate to="/landing" replace />} />
              
              {/* App routes */}
              <Route path="/" element={<BuildBuddy />} />
              <Route path="/book" element={<Book />} />
              <Route path="/xplore" element={<Xplore />} />
              
              {/* Protected routes */}
              <Route 
                path="/my-trips" 
                element={
                  <ProtectedRoute>
                    <MyTrips />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;