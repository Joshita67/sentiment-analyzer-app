import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, Smile, Frown, Meh, ArrowRight } from 'lucide-react';

interface HistoryItem {
  id: number;
  inputText: string;
  sentimentLabel: string;
  confidenceScore: number;
  createdAt: string;
}

export default function Dashboard() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('sentiment_token');
    if (!token) {
      navigate('/auth');
      return;
    }

    axios.get('http://localhost:8080/api/history', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      setHistory(res.data);
      setLoading(false);
    })
    .catch(() => {
      localStorage.removeItem('sentiment_token');
      localStorage.removeItem('sentiment_user');
      navigate('/auth');
    });
  }, [navigate]);

  if (loading) return <div className="flex-grow flex items-center justify-center">Loading history...</div>;

  return (
    <div className="flex-grow py-12 px-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Your Dashboard</h2>
          <p className="text-slate-500">View your past sentiment analyses</p>
        </div>
        <button 
          onClick={() => navigate('/analyze')}
          className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors flex items-center space-x-2"
        >
          <span>New Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="text-lg">You haven't run any analysis yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((item, idx) => {
            const isPos = item.sentimentLabel === 'POSITIVE';
            const isNeg = item.sentimentLabel === 'NEGATIVE';
            const color = isPos ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : isNeg ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-amber-600 bg-amber-50 border-amber-200';
            const Icon = isPos ? Smile : isNeg ? Frown : Meh;

            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={item.id} 
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0"
              >
                <div className="flex-1 pr-6">
                  <p className="text-slate-800 font-medium">"{item.inputText}"</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                
                <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg border ${color} w-max`}>
                  <Icon className="w-5 h-5" />
                  <span className="font-bold">{item.sentimentLabel}</span>
                  <span className="text-sm opacity-80">({(item.confidenceScore * 100).toFixed(1)}%)</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  );
}
