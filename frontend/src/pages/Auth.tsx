import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn, UserPlus } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const response = await axios.post(`${baseUrl}${endpoint}`, { username, password });
      
      if (isLogin) {
        localStorage.setItem('sentiment_token', response.data);
        localStorage.setItem('sentiment_user', username);
        window.dispatchEvent(new Event('auth-change'));
        navigate('/dashboard');
      } else {
        setMessage('Registration successful! You log in now.');
        setIsLogin(true);
      }
    } catch (err: any) {
      if (err.response?.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : 'Invalid credentials');
      } else {
        setError('Failed to connect to the server');
      }
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500 mt-2">
            {isLogin ? 'Log in to view your history' : 'Sign up to start saving your analysis history'}
          </p>
        </div>

        {error && <div className="mb-4 text-center text-sm font-medium text-rose-600 bg-rose-50 p-3 rounded-lg">{error}</div>}
        {message && <div className="mb-4 text-center text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-lg">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input 
              type="text" required
              value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex justify-center items-center space-x-2 transition-all mt-4"
          >
            {isLogin ? <LogIn className="w-5 h-5"/> : <UserPlus className="w-5 h-5" />}
            <span>{isLogin ? 'Log In' : 'Sign Up'}</span>
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }}
            className="text-indigo-600 font-semibold hover:underline border-none bg-transparent cursor-pointer"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
