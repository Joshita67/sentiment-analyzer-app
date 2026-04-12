import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Smile, Frown, Meh, Info } from 'lucide-react';
import axios from 'axios';

interface SentimentResult {
  label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  score: number;
}

export default function Analyzer() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [error, setError] = useState('');

  const analyzeText = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('sentiment_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const response = await axios.post(`${baseUrl}/api/analyze`, { text }, { headers });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze text. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentConfig = (label: string) => {
    switch(label) {
      case 'POSITIVE': return { color: 'text-emerald-500', bg: 'bg-emerald-100', icon: Smile, text: 'Positive' };
      case 'NEGATIVE': return { color: 'text-rose-500', bg: 'bg-rose-100', icon: Frown, text: 'Negative' };
      default: return { color: 'text-amber-500', bg: 'bg-amber-100', icon: Meh, text: 'Neutral' };
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-3xl space-y-8">
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Text Analyzer</h2>
          <p className="text-slate-500">Enter a review, tweet, or any text to determine its emotional tone.</p>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full h-40 p-4 resize-none outline-none text-lg bg-transparent"
          />
          <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-400 font-medium ml-2">
              {text.length} characters
            </span>
            <button 
              onClick={analyzeText}
              disabled={loading || !text.trim()}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-6 py-3 rounded-lg font-medium transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span>{loading ? 'Analyzing...' : 'Analyze'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="text-rose-500 text-sm font-medium text-center bg-rose-50 p-4 rounded-xl border border-rose-100">
            {error}
          </div>
        )}

        {/* Results Area */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-slate-500">Sentiment Detected</h3>
                  <div className="flex items-center space-x-3">
                    {(() => {
                      const config = getSentimentConfig(result.label);
                      const Icon = config.icon;
                      return (
                        <>
                          <div className={`p-3 rounded-full ${config.bg}`}>
                            <Icon className={`w-8 h-8 ${config.color}`} />
                          </div>
                          <span className={`text-4xl font-extrabold ${config.color}`}>
                            {config.text}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <h3 className="text-lg font-medium text-slate-500">Confidence</h3>
                  <div className="text-4xl font-extrabold text-slate-800">
                    {(result.score * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="space-y-2">
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.score * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full ${getSentimentConfig(result.label).bg.replace('100', '500')} saturate-200`}
                  />
                </div>
              </div>

              {/* Educational Box */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start space-x-4">
                <div className="mt-1">
                  <Info className="text-blue-500 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">How it works</h4>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    The text was tokenized into an array of words and sub-words. 
                    A transformer model (`distilbert-base`) assigned mathematical weight to emotional keywords, 
                    resulting in a continuous probability distribution where {getSentimentConfig(result.label).text} scored the highest.
                  </p>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
