import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import { BrainCircuit, Home as HomeIcon, LineChart, LayoutDashboard, LogOut, User } from 'lucide-react';

function App() {
  const [username, setUsername] = useState<string | null>(null);

  const checkAuth = () => setUsername(localStorage.getItem('sentiment_user'));

  useEffect(() => {
    checkAuth();
    window.addEventListener('auth-change', checkAuth);
    return () => window.removeEventListener('auth-change', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sentiment_token');
    localStorage.removeItem('sentiment_user');
    checkAuth();
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        {/* Navigation */}
        <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              SentimentAI
            </span>
          </Link>
          <div className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="hidden md:flex items-center space-x-1 hover:text-indigo-600 transition-colors">
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link to="/analyze" className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
              <LineChart className="w-4 h-4" />
              <span>Analyzer</span>
            </Link>
            
            {/* Auth section */}
            <div className="h-6 w-px bg-slate-300 mx-2"></div>
            
            {username ? (
              <>
                <Link to="/dashboard" className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center space-x-1 text-slate-500 hover:text-rose-600 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link to="/auth" className="flex items-center space-x-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hover:border-indigo-300 hover:text-indigo-600 transition-all">
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyzer />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="py-6 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} SentimentAI. Built for educational purposes.
        </footer>
      </div>
    </Router>
  );
}

export default App;
