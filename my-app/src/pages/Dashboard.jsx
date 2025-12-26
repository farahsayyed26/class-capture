import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Settings, User, LogOut,
  Menu, ChevronRight, Bell, Shield, Moon, Camera,
  Trophy, Clock, File, BookOpen, Calendar, ChevronDown
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ResultsDashboard from '../components/ResultsDashboard';
import { useNavigate } from 'react-router-dom';


// 1. IMPORT FIREBASE
import { auth, db } from "../firebase"; // Ensure 'db' is exported from your firebase.js
import { signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

// --- UTILITY: REMOVE EMOJIS AND IMPROVE READABILITY ---
// --- UTILITY: STRIP ALL EMOJIS AND ENFORCE BULLET POINTS ---
const formatContent = (str) => {
  if (!str) return "";

  // 1. Remove all emojis using a comprehensive unicode range
  // This covers standard emojis, transport, symbols, and pictographs
  let cleanStr = str.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

  // 2. Clean up double spaces left behind by removed emojis
  cleanStr = cleanStr.replace(/\s\s+/g, ' ').trim();

  // 3. Logic to convert blocks of text into bullet points if not already formatted
  if (cleanStr.length > 50) {
    // Split by period followed by space, or by existing newlines
    const lines = cleanStr.split(/[.\n]+/).filter(s => s.trim().length > 3);

    if (lines.length > 1) {
      // Return each line starting with a bullet point, ensuring no emojis remain
      return lines.map(line => `• ${line.trim()}`).join('\n');
    }
  }

  return cleanStr;
};


// --- SUB-COMPONENT: STUDY MATERIAL VIEW ---
const StudyMaterialView = ({ history, onViewDetails, isFetching }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">Study Material</h2>
        <p className="text-slate-500 font-medium">{history.length} items saved</p>
      </div>

      {isFetching ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand-main border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-slate-200">
          <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No study materials saved yet. Upload notes to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer"
              onClick={() => onViewDetails(item)}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-brand-light/10 rounded-2xl text-brand-main">
                    <FileText size={24} />
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase tracking-wider">
                    {item.date}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1">
                  {item.fileName || "Untitled Session"}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-3 mb-4 whitespace-pre-line">
                  {item.summary}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Trophy size={14} /> {item.quiz?.length || 0} Questions
                </span>
                <button className="text-brand-main text-sm font-bold flex items-center gap-1">
                  Review <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};


const ProfileView = ({ user, history }) => {
  // Logic: Calculate stats from the database history array
  const totalScans = history.length;
  const totalQuestions = history.reduce((acc, item) => acc + (item.quiz?.length || 0), 0);
  const studyHours = (totalScans * 0.75).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <h2 className="text-3xl font-bold text-slate-800">My Profile</h2>

      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-brand-main to-brand-dark flex items-center justify-center text-4xl text-white font-bold shadow-lg">
          {user?.displayName?.[0] || "U"}
        </div>
        <div className="flex-1 text-start md:text-left">
          <h3 className="text-2xl font-bold text-slate-800">{user?.displayName || "Student"}</h3>
          <p className="text-slate-500 font-medium">{user?.email}</p>
          <div className="flex gap-2 mt-4 justify-center md:justify-start">
            <span className="px-3 py-1 bg-brand-light/10 text-brand-main rounded-full text-xs font-bold border border-brand-light/20 flex items-center gap-1">
              <Shield size={14} /> Verified Account
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid with Symbols */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Scans */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Scans</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{totalScans}</p>
          </div>
          <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl">
            <FileText size={28} />
          </div>
        </div>

        {/* Quiz Questions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Questions</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{totalQuestions}</p>
          </div>
          <div className="p-4 bg-amber-50 text-amber-500 rounded-2xl">
            <Trophy size={28} />
          </div>
        </div>

        {/* Study Hours */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between border-b-4 border-b-emerald-500">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Study Hours</p>
            <div className="flex items-baseline gap-1 mt-1">
              <p className="text-3xl font-bold text-slate-800">{studyHours}</p>
              <span className="text-slate-500 text-sm font-bold">hrs</span>
            </div>
          </div>
          <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl">
            <Clock size={28} />
          </div>
        </div>

      </div>
    </motion.div>
  );
};

// --- SUB-COMPONENT: SETTINGS VIEW ---
const SettingsView = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
    <h2 className="text-3xl font-bold text-slate-800">Settings</h2>
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      {[
        { icon: <Bell className="w-5 h-5" />, title: "Notifications", desc: "Get email alerts for study reminders" },
        { icon: <Moon className="w-5 h-5" />, title: "Dark Mode", desc: "Switch to a darker theme for night study" },
        { icon: <Shield className="w-5 h-5" />, title: "Privacy", desc: "Manage your data visibility" }
      ].map((item, i) => (
        <div key={i} className="p-6 border-b border-slate-100 last:border-0 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 text-slate-600 rounded-xl group-hover:bg-brand-main group-hover:text-white transition">
              {item.icon}
            </div>
            <div>
              <h4 className="font-bold text-slate-700">{item.title}</h4>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          </div>
          <div className="w-12 h-6 bg-slate-200 rounded-full relative">
            <div className="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-0.5"></div>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState([]);

  const navigate = useNavigate();

  // FETCH DATA ON AUTH CHANGE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserHistory(currentUser.uid); // Trigger fetch from Firestore
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchUserHistory = async (uid) => {
    if (!uid) return;
    setIsFetchingHistory(true);
    try {
      // collection(db, "study_materials") requires 'db' to be correctly exported
      const materialsRef = collection(db, "study_materials");

      // This specific combination (where + orderBy) requires a manual index in Firebase Console
      const q = query(
        materialsRef,
        where("userId", "==", uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log("Fetched Docs:", docs); // Check your console to see if data arrives
      setHistory(docs);
    } catch (error) {
      console.error("Detailed Firestore Error:", error);
      // If you see "The query requires an index" in the console, click the provided link
      toast.error("Database connection issue. Check console for index link.");
    } finally {
      setIsFetchingHistory(false);
    }
  };

  const processAndSaveData = async (rawData, fileName) => {
    if (!user) return;

    const cleanData = {
      summary: formatContent(rawData.summary),
      quiz: (rawData.quiz || []).map(q => ({
        ...q,
        question: formatContent(q.question),
        options: q.options.map(opt => formatContent(opt)),
        answer: formatContent(q.answer)
      })),
      fileName: fileName,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      userId: user.uid, // Tie data to the user
      createdAt: serverTimestamp() // Database ordering
    };

    try {
      // SAVE TO FIRESTORE
      const docRef = await addDoc(collection(db, "study_materials"), cleanData);
      const finalData = { id: docRef.id, ...cleanData };

      setAnalysisData(finalData);
      setHistory(prev => [finalData, ...prev]);
      toast.success("Saved to your cloud library");
    } catch (error) {
      console.error("Firestore Save Error:", error);
      toast.error("Cloud sync failed. Data visible for this session only.");
      setAnalysisData(cleanData);
    }
  };
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");

      // Redirect to Home instead of Login
      // Using replace: true ensures the Dashboard is removed from history
      navigate('/', { replace: true });
    } catch (error) {
      toast.error("Error signing out");
    }
  };


  const handleUpload = async (uploadedFile) => {
    if (!uploadedFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const response = await axios.post("http://127.0.0.1:8000/upload", formData);
      await processAndSaveData(response.data, uploadedFile.name);
      toast.success("Analysis Complete");
    } catch (error) {
      toast.error("Using fallback summary");
      const sampleData = {
        summary: "This is a clean, structured summary.\n• Core concepts identified.\n• Readability optimized.",
        quiz: [{ question: "Sample Question?", options: ["A", "B"], answer: "A" }]
      };
      await processAndSaveData(sampleData, uploadedFile.name);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    // Pass history and user to ProfileView
    if (activeTab === 'profile') return <ProfileView user={user} history={history} />;

    if (activeTab === 'settings') return <SettingsView />;

    if (activeTab === 'material') return (
      <StudyMaterialView
        history={history}
        isFetching={isFetchingHistory}
        onViewDetails={(item) => {
          setAnalysisData(item);
          setActiveTab('dashboard');
        }}
      />
    );

    return (
      <div className="max-w-5xl mx-auto h-full flex flex-col justify-center items-center">
        {!analysisData ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-12 w-full">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-800">
                Class<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-main to-brand-dark">Capture</span>
              </h1>
              <p className="text-xl text-slate-500">Welcome back, <span className="text-brand-main font-bold">{user?.displayName?.split(" ")[0]}</span></p>
            </div>

            <div className="flex flex-col items-center gap-6 w-full">
              <label
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleUpload(e.dataTransfer.files[0]); }}
                className={`relative w-full max-xl h-72 border-4 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-brand-main bg-brand-main/5 scale-105' : 'border-slate-200 bg-white hover:border-brand-light'} ${loading ? 'opacity-50' : ''}`}
              >
                <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => handleUpload(e.target.files[0])} disabled={loading} />
                {loading ? (
                  <div className="flex flex-col items-center"><div className="w-12 h-12 border-4 border-brand-main border-t-transparent rounded-full animate-spin mb-4"></div><p className="font-bold text-slate-600">Summarizing...</p></div>
                ) : (
                  <>
                    <div className="p-4 bg-brand-light/10 rounded-full mb-4"><Upload className="text-brand-main w-10 h-10" /></div>
                    <p className="text-lg font-bold text-slate-700">{isDragging ? "Drop here" : "Drag and drop or click to upload"}</p>
                    <p className="text-sm text-slate-400 mt-2">Supports JPG, PNG, PDF</p>
                  </>
                )}
              </label>
            </div>
          </motion.div>
        ) : (
          <ResultsDashboard data={analysisData} onReset={() => setAnalysisData(null)} />
        )}
      </div>
    );
  };

  return (
  <div className="flex min-h-screen bg-[#F8FAFC]">
    {/* SIDEBAR */}
    <aside 
      className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        bg-white border-r border-slate-200 fixed h-full z-30 
        transition-all duration-300 ease-in-out
        hidden md:flex flex-col overflow-hidden
      `}
    >
      {/* Brand Logo Section - Centered when closed */}
      <div className={`h-20 flex items-center px-6 font-bold text-brand-main text-xl shrink-0 ${!isSidebarOpen && 'justify-center px-0'}`}>
        {isSidebarOpen ? "ClassCapture" : "CC"}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-2 mt-4">
        {[
          { id: 'dashboard', icon: <FileText size={20} />, label: 'Dashboard' },
          { id: 'material', icon: <BookOpen size={20} />, label: 'Study Material' },
          { id: 'profile', icon: <User size={20} />, label: 'Profile' },
          { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={!isSidebarOpen ? tab.label : ""} // Tooltip when collapsed
            className={`
              w-full flex items-center rounded-xl transition-all duration-200
              ${isSidebarOpen ? 'px-4 py-3 gap-4' : 'p-3 justify-center'}
              ${activeTab === tab.id 
                ? 'bg-brand-main text-white shadow-lg shadow-brand-main/20' 
                : 'text-slate-500 hover:bg-slate-50'}
            `}
          >
            <div className="shrink-0">{tab.icon}</div>
            {isSidebarOpen && (
              <span className="capitalize font-semibold whitespace-nowrap">
                {tab.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Sign Out Section */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={handleSignOut}
          className={`
            w-full flex items-center text-red-500 hover:bg-red-50 rounded-xl transition-all
            ${isSidebarOpen ? 'px-4 py-3 gap-4' : 'p-3 justify-center'}
          `}
        >
          <LogOut size={20} className="shrink-0" />
          {isSidebarOpen && <span className="font-semibold">Sign Out</span>}
        </button>
      </div>
    </aside>

    {/* MAIN CONTENT */}
    <main 
      className={`
        flex-1 transition-all duration-300 
        ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}
      `}
    >
      {/* Header */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b flex items-center justify-between px-8 sticky top-0 z-20">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="text-slate-600 hover:text-brand-main" />
        </button>

        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActiveTab('profile')}>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800">{user?.displayName}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-main flex items-center justify-center text-white font-bold group-hover:ring-4 ring-brand-main/10 transition-all">
            {user?.displayName?.[0] || "U"}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="p-6 md:p-12 min-h-[calc(100vh-80px)]">
        {renderContent()}
      </div>
    </main>
  </div>
);

};

export default Dashboard;