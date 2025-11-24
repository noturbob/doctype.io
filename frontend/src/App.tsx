import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, FileText, Sparkles, Loader2, Zap, ChevronRight, Plus, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SignInButton, useAuth, useUser } from "@clerk/clerk-react";

import { cn } from './lib/utils';
import { Button } from './components/ui/Button';
import { GlassCard } from './components/ui/GlassCard';
import { ParticleBackground } from './components/visuals/ParticleBackground';
import { Navbar } from './components/layout/Navbar';

// PRODUCTION CONFIG: Uses .env variable or defaults to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

function App() {
  const { getToken } = useAuth();
  const { user, isSignedIn, isLoaded } = useUser();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Offline");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Smart Health Check (Polls every 30s)
  useEffect(() => {
    const checkHealth = () => {
      axios.get(`${API_URL}/`)
        .then(() => setStatus("Online"))
        .catch(() => setStatus("Offline"));
    };

    // Check immediately on load
    checkHealth();

    // Set up polling interval
    const interval = setInterval(checkHealth, 30000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  // 2. Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  // 3. Helper for Auth Requests
  const authRequest = async (method: 'post', endpoint: string, data: any) => {
    const token = await getToken();
    return axios({
      method,
      url: `${API_URL}${endpoint}`,
      data,
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json'
      }
    });
  };

  // 4. Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setStep(2); 
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      try {
        await authRequest('post', '/ingest', formData);
        setStatus("Online"); // If upload works, backend is definitely online
        setTimeout(() => setStep(3), 2500);
      } catch (err) {
        setStatus("Offline");
        alert("Upload failed. Is the backend running?");
        setStep(1);
      }
    }
  };

  // 5. Chat Handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newHistory = [...chatHistory, { role: 'user' as const, content: question }];
    setChatHistory(newHistory);
    setQuestion("");
    setLoading(true);

    try {
      const res = await authRequest('post', '/chat', { 
        question: question 
      });
      
      // If we get a response, the system is healthy
      setStatus("Online");
      
      setChatHistory([...newHistory, { role: 'ai' as const, content: res.data.answer }]);
    } catch (err) {
      // If it fails, mark as offline
      setStatus("Offline");
      setChatHistory([...newHistory, { role: 'ai' as const, content: "Error: Backend unavailable." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-hidden relative flex flex-col">
      
      {/* Vibrant Background */}
      <div className="fixed top-[-20%] left-[-10%] w-[700px] h-[700px] bg-indigo-600/25 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-blue-600/25 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="fixed top-[40%] left-[30%] w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[150px] pointer-events-none" />
      
      <ParticleBackground />
      <Navbar status={status} step={step} />

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-4xl mx-auto px-4">
        <AnimatePresence mode='wait'>
          
          {!isSignedIn ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              className="w-full max-w-lg"
            >
              <GlassCard className="p-8 bg-black/40">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-50" />
                <h2 className="text-2xl font-bold mb-2">Welcome to Doctype.io</h2>
                <p className="text-white/50 text-sm mb-8">Your AI-powered document intelligence engine.</p>
                
                <div className="space-y-4 mb-8">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Secure Analysis</h3>
                      <p className="text-xs text-white/40">Your documents are private and secure.</p>
                    </div>
                  </div>
                </div>

                <SignInButton mode="modal">
                  <Button className="w-full gap-2 group">
                    Sign In to Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </SignInButton>
              </GlassCard>
            </motion.div>
          ) : (
            <>
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  className="text-center w-full max-w-xl mt-12"
                >
                  <h1 className="text-5xl font-bold mb-4 tracking-tighter text-white">
                    Welcome back, <span className="text-blue-400">{user?.firstName}</span>.
                  </h1>
                  <p className="text-white/50 mb-8">Upload a document to begin your session.</p>
                  
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                    <label className="relative flex flex-col items-center justify-center w-full h-64 border border-white/10 rounded-2xl bg-black/90 hover:bg-white/5 transition-all cursor-pointer overflow-hidden group">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-white/20 transition-all duration-300">
                          <FileText className="w-8 h-8 text-white/70" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-white/90">Click to upload PDF</p>
                          <p className="text-xs text-white/40 mt-1">Max size 10MB</p>
                        </div>
                      </div>
                      <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf" />
                    </label>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                  className="text-center mt-12"
                >
                  <div className="relative w-32 h-32 mx-auto mb-8">
                    <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin" />
                    <div className="absolute inset-3 border-r-2 border-purple-500 rounded-full animate-spin animation-delay-200" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Processing</h2>
                  <p className="text-white/40 text-sm font-mono">Vectorizing content chunks...</p>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full h-[75vh] flex flex-col mt-4"
                >
                  <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-6 custom-scrollbar relative">
                    {chatHistory.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-center opacity-30 pointer-events-none">
                        <div>
                          <Sparkles className="w-12 h-12 mx-auto mb-4" />
                          <p>Ask me anything about the document.</p>
                        </div>
                      </div>
                    )}

                    {chatHistory.map((msg, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex w-full",
                          msg.role === 'user' ? "justify-end" : "justify-start"
                        )}
                      >
                        <div className={cn(
                          "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg",
                          msg.role === 'user' 
                            ? "bg-white text-black rounded-tr-sm" 
                            : "bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm backdrop-blur-sm"
                        )}>
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                              li: ({node, ...props}) => <li className="text-white/90" {...props} />,
                              strong: ({node, ...props}) => <span className="font-bold text-blue-300" {...props} />,
                              h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2 text-white" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2 text-white" {...props} />,
                              code: ({node, ...props}) => <code className="bg-black/30 px-1 py-0.5 rounded font-mono text-xs text-blue-200" {...props} />,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </motion.div>
                    ))}

                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-3 items-center text-white/50">
                          <Loader2 size={14} className="animate-spin" />
                          <span className="text-xs">Analyzing...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <GlassCard className="p-2 flex gap-2 items-center mt-auto mb-6 border-white/20 bg-black/40">
                    <button className="p-3 hover:bg-white/10 rounded-xl transition-colors text-white/50 hover:text-white">
                      <Plus size={20} />
                    </button>
                    
                    <form onSubmit={handleSendMessage} className="flex-1 flex gap-2">
                      <input 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Type your question..."
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 p-2 text-sm font-medium"
                        autoFocus
                      />
                      <Button 
                        type="submit" 
                        disabled={!question.trim() || loading}
                        size="icon"
                        className="rounded-lg"
                      >
                        <Send size={18} />
                      </Button>
                    </form>
                  </GlassCard>

                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;