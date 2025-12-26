import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { 
  ArrowRight, BookOpen, Camera, Zap, FileText, 
  Star, Users, BrainCircuit, LogOut, LayoutDashboard 
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 1. Listen for Auth State to toggle buttons
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans text-brand-dark overflow-x-hidden">
      
      {/* --- GLASS NAVBAR --- */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-lg border-b border-brand-light/20 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="bg-brand-dark text-white p-2 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            Class<span className="text-brand-main">Capture</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-medium text-brand-muted text-sm">
            <a href="#how-it-works" className="hover:text-brand-main transition">How It Works</a>
            <a href="#features" className="hover:text-brand-main transition">Features</a>
            <a href="#reviews" className="hover:text-brand-main transition">Reviews</a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="hidden md:flex items-center gap-2 text-brand-dark font-semibold text-sm hover:text-brand-main transition-colors px-4"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </button>
                <button 
                  onClick={handleSignOut}
                  className="bg-red-50 text-red-600 px-5 py-2 rounded-full font-semibold text-sm hover:bg-red-600 hover:text-white transition-all border border-red-100"
                >
                  <LogOut className="w-4 h-4 inline mr-2" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-brand-dark font-semibold text-sm hover:text-brand-main transition-colors px-4"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate('/login')} // Or /register
                  className="bg-brand-dark text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-brand-main hover:shadow-lg hover:shadow-brand-main/30 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Try for Free
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-48 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-0 w-72 h-72 bg-brand-light/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-brand-main/20 rounded-full blur-3xl -z-10"></div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-5xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-brand-main font-semibold text-xs uppercase tracking-widest mb-8 shadow-sm">
            <Zap className="w-4 h-4 fill-current" /> AI-Powered Study Assistant
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight tracking-tight text-brand-dark">
            Master Your Classes <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-main via-blue-400 to-brand-dark">
              In Seconds.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-brand-muted mb-12 max-w-2xl mx-auto leading-relaxed">
            Stop manually typing notes. Snap a photo of the whiteboard and let our AI generate <span className="text-brand-dark font-semibold">Summaries, Flashcards, and Quizzes</span> instantly.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              className="group relative bg-brand-main text-white text-lg px-10 py-5 rounded-2xl font-bold hover:bg-brand-dark transition-all shadow-xl shadow-brand-main/30 hover:shadow-2xl overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                {user ? "Go to Dashboard" : "Start Learning Now"} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
            
            <button className="flex items-center gap-3 text-brand-dark font-semibold px-8 py-5 rounded-2xl border border-brand-light/40 hover:bg-white hover:border-brand-main transition-all">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
              </div>
              View Demo
            </button>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-brand-light/20 pt-10">
            {[
              { label: "Active Students", val: "10k+" },
              { label: "Notes Processed", val: "500k+" },
              { label: "Quiz Accuracy", val: "99%" },
              { label: "Time Saved", val: "100hrs" },
            ].map((stat, i) => (
              <div key={i}>
                <h4 className="text-3xl font-bold text-brand-dark">{stat.val}</h4>
                <p className="text-brand-muted text-sm uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">From Photo to <span className="text-brand-main">Genius</span></h2>
            <p className="text-brand-muted max-w-2xl mx-auto">Three simple steps to hack your productivity.</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: Camera, title: "1. Capture", desc: "Take a photo of the whiteboard, textbook, or your messy handwritten notes." },
              { icon: BrainCircuit, title: "2. Analyze", desc: "Our AI reads the text, understands the context, and fixes errors." },
              { icon: FileText, title: "3. Master", desc: "Get a perfect PDF summary and an interactive quiz to test your knowledge." }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                className="relative p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-brand-main/30 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="w-8 h-8 text-brand-main" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-brand-muted leading-relaxed">{step.desc}</p>
                {i !== 2 && <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-brand-light/30"></div>}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 bg-brand-dark text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <span className="text-brand-main font-bold tracking-widest uppercase text-sm">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">Everything you need to <br/> ace the exam.</h2>
            <div className="space-y-6">
              {["Handwriting Recognition (OCR)", "Auto-Generated Flashcards", "Export to PDF & Notion", "Dark Mode Support"].map((feature, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-brand-main flex items-center justify-center text-xs">✓</div>
                  <span className="font-medium text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-brand-main/20 blur-3xl rounded-full"></div>
            <div className="relative bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-auto text-sm text-brand-light">Generated_Quiz.pdf</span>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-full"></div>
                <div className="h-24 bg-brand-main/20 rounded-xl mt-6 border border-brand-main/30 flex items-center justify-center">
                  <span className="text-brand-main font-bold text-center px-4">AI generates summaries and quizzes in real-time.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- REVIEWS --- */}
      <section id="reviews" className="py-24 bg-blue-50/50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Loved by Students at</h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 mb-16">
             <span className="text-2xl font-black text-slate-400">MIT</span>
             <span className="text-2xl font-black text-slate-400">STANFORD</span>
             <span className="text-2xl font-black text-slate-400">HARVARD</span>
             <span className="text-2xl font-black text-slate-400">IIT BOMBAY</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {[
              { name: "Zaid Belif", role: "BCA Student", text: "This saved my life during finals. I just snapped pics of my friend's notes and the quiz mode helped me memorize everything." },
              { name: "Sarah J.", role: "Med Student", text: "The handwriting recognition is insane. It actually read my professor's terrible writing!" }
            ].map((review, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-brand-muted mb-6 italic">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-main rounded-full flex items-center justify-center text-white font-bold">{review.name[0]}</div>
                  <div>
                    <h4 className="font-bold text-brand-dark">{review.name}</h4>
                    <p className="text-xs text-brand-muted uppercase">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-brand-main rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 relative z-10">Ready to boost your grades?</h2>
          <button 
            onClick={() => navigate(user ? '/dashboard' : '/login')}
            className="bg-white text-brand-main px-12 py-4 rounded-full font-bold text-lg hover:bg-brand-dark hover:text-white transition-all shadow-2xl relative z-10"
          >
            {user ? "Go to Dashboard" : "Get Started for Free"}
          </button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-brand-light/20 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl text-brand-dark">
            <BookOpen className="w-6 h-6 text-brand-main" />
            ClassCapture
          </div>
          <p className="text-brand-muted text-sm">© 2025 ClassCapture Inc. Built for Hackathons.</p>
          <div className="flex gap-6 text-brand-muted">
            <a href="#" className="hover:text-brand-main transition"><Users className="w-5 h-5"/></a>
            <a href="#" className="hover:text-brand-main transition"><Camera className="w-5 h-5"/></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;