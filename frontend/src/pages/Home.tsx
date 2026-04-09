import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Zap, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow px-6 py-12">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl text-center space-y-8"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Understand emotions in <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            plain text, instantly.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          An interactive, beginner-friendly NLP tool that analyzes text to find out if it's Positive, Negative, or Neutral. Perfect for developers, researchers, and students.
        </p>
        
        <div className="flex items-center justify-center space-x-4 pt-4">
          <Link to="/analyze" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold text-lg transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]">
            Try the Analyzer
          </Link>
        </div>
      </motion.div>

      {/* Features showcase */}
      <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Zap className="text-blue-600 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Real-Time Analysis</h3>
          <p className="text-slate-600">Get instant sentiment scoring as you type or paste your text. Powered by modern Hugging Face models.</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Activity className="text-purple-600 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Educational Insights</h3>
          <p className="text-slate-600">Learn how models work under the hood. We break down the confidence scores and tokenization process.</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <ShieldCheck className="text-emerald-600 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">High Accuracy</h3>
          <p className="text-slate-600">Powered by state-of-the-art transformer models to guarantee accurate extraction of emotional tone.</p>
        </motion.div>
      </div>
    </div>
  );
}
