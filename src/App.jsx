import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout Components
import Navbar from './components/layout/Navbar';

// Page Components
import Home from './pages/Home';
import Experience from './pages/Experience';
import Projects from './pages/Projects';
import Research from './pages/Research';
import About from './pages/About';
import Contact from './pages/Contact';

/**
 * AnimatedRoutes Component
 * 
 * Wraps Routes in AnimatePresence for page transition animations.
 * Uses location.pathname as key to trigger exit/enter animations.
 */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/research" element={<Research />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  );
}

/**
 * App Component
 * 
 * Root application component with React Router setup.
 * Navbar is placed outside AnimatePresence for persistence across page transitions.
 * 
 * Requirements: 1.1, 1.3
 */
function App() {
  return (
    <BrowserRouter>
      {/* Navbar persists across all routes - outside AnimatePresence */}
      <Navbar />
      
      {/* Main content area with animated page transitions */}
      <main>
        <AnimatedRoutes />
      </main>
    </BrowserRouter>
  );
}

export default App;
