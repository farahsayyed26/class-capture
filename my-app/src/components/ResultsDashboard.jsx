import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';
import { Download, FileText, BrainCircuit, RotateCcw, CheckCircle, Volume2, StopCircle, Settings, XCircle, ArrowRight, AlertCircle } from 'lucide-react';
const ResultsDashboard = ({ data, onReset }) => {
  // --- STATE MANAGEMENT ---
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  
  // --- NEW QUIZ STATE ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track active card
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // --- 1. LOAD VOICES ---
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      const defaultVoice = availableVoices.find(v => v.lang.includes('en')) || availableVoices[0];
      setSelectedVoice(defaultVoice);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => window.speechSynthesis.cancel();
  }, []);

  // --- 2. TEXT CLEANERS ---
  const cleanForPDF = (text) => text.replace(/[^\x00-\x7F]/g, "").replace(/\*/g, "-");
  
  const cleanForSpeech = (text) => {
    return text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/gu, '')
      .replace(/[*#_`]/g, '') 
      .replace(/- /g, ', ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // --- 3. TEXT TO SPEECH LOGIC ---
  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      toast.error("Browser does not support Text-to-Speech");
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const speakText = cleanForSpeech(data.summary);
      const utterance = new SpeechSynthesisUtterance(speakText);
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.rate = 1; 
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // --- 4. NEW QUIZ LOGIC ---
  const handleOptionSelect = (option) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < data.quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmitQuiz = () => {
    // Check if current question is answered before submitting
    if (!userAnswers[currentQuestionIndex] && !userAnswers[data.quiz.length - 1]) {
       toast.error("Please answer the last question!");
       return;
    }

    let calculatedScore = 0;
    data.quiz.forEach((q, index) => {
      if (userAnswers[index] === q.answer) calculatedScore += 1;
    });
    setScore(calculatedScore);
    setIsSubmitted(true);
    
    if (calculatedScore === data.quiz.length) toast.success("🎉 Perfect Score!");
    else if (calculatedScore > 0) toast.success(`👍 Good job! ${calculatedScore}/${data.quiz.length}`);
    else toast.error("😅 Keep studying!");
  };

  const getOptionStyle = (qIndex, option) => {
    const isSelected = userAnswers[qIndex] === option;
    const isCorrect = data.quiz[qIndex].answer === option;

    // Active Quiz Styles (Clean & Simple)
    if (!isSubmitted) {
      if (isSelected) return "bg-brand-main text-white border-brand-main shadow-md transform scale-[1.02] font-semibold";
      return "bg-white border-slate-200 hover:bg-slate-50 hover:border-brand-main/50 text-slate-600";
    }

    // Result Styles (Detailed)
    if (isCorrect) return "bg-green-100 border-green-500 text-green-700 font-bold";
    if (isSelected && !isCorrect) return "bg-red-100 border-red-500 text-red-700 font-medium";
    return "opacity-50 grayscale bg-slate-50";
  };

  // --- 5. PDF GENERATION ---
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("ClassCapture Smart Summary", 20, 20);
    doc.setFontSize(12);
    const safeSummary = cleanForPDF(data.summary);
    const splitText = doc.splitTextToSize(safeSummary, 170);
    doc.text(splitText, 20, 40);
    doc.save('ClassCapture_Notes.pdf');
    toast.success("PDF Downloaded successfully!");
  };

  // Helper variables for rendering
  const currentQuestion = data.quiz[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === data.quiz.length - 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-brand-dark">Analysis Complete</h2>
          <p className="text-slate-500 mt-1">Here is what we found in your notes.</p>
        </div>
        <button 
          onClick={() => { window.speechSynthesis.cancel(); onReset(); }}
          className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 rounded-full text-slate-600 font-medium hover:bg-slate-50 hover:text-brand-main transition shadow-sm"
        >
          <RotateCcw className="w-4 h-4" /> Scan New File
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Summary (Unchanged) */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
            <div className="bg-gradient-to-r from-brand-dark to-[#4B5563] p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg"><FileText className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold">Smart Summary</h3>
              </div>
              <div className="flex gap-2 relative">
                {showVoiceMenu && (
                  <div className="absolute top-12 right-0 bg-white text-slate-800 p-2 rounded-xl shadow-xl w-64 max-h-60 overflow-y-auto z-50 border border-slate-200">
                    {voices.map((voice, i) => (
                      <button key={i} onClick={() => { setSelectedVoice(voice); setShowVoiceMenu(false); }} className={`w-full text-left text-sm p-2 rounded-lg hover:bg-brand-light/20 truncate ${selectedVoice?.name === voice.name ? 'text-brand-main font-bold' : ''}`}>{voice.name}</button>
                    ))}
                  </div>
                )}
                <button onClick={() => setShowVoiceMenu(!showVoiceMenu)} className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition"><Settings className="w-4 h-4" /></button>
                <button onClick={handleSpeak} className={`px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-md transition flex items-center gap-2 ${isSpeaking ? 'bg-red-500 animate-pulse' : 'bg-white/20 hover:bg-white/30'}`}>{isSpeaking ? <StopCircle className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}{isSpeaking ? 'Stop' : 'Listen'}</button>
                <button onClick={handleDownloadPDF} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"><Download className="w-4 h-4" /> PDF</button>
              </div>
            </div>
            <div className="p-8 prose prose-slate max-w-none">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl">💡</span>
                <p className="text-lg text-slate-600 leading-relaxed font-medium whitespace-pre-line">{data.summary}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Interactive Quiz (Completely Redesigned) */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-5">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 h-full relative overflow-hidden flex flex-col min-h-[500px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-main/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            
            {/* Quiz Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-light/20 rounded-lg"><BrainCircuit className="w-6 h-6 text-brand-main" /></div>
                <div>
                  <h3 className="text-xl font-bold text-brand-dark">Quick Quiz</h3>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    {isSubmitted ? "Review Results" : `Question ${currentQuestionIndex + 1} of ${data.quiz.length}`}
                  </p>
                </div>
              </div>
              {isSubmitted && (
                <div className="bg-slate-100 px-4 py-2 rounded-full text-sm font-bold text-slate-700">
                  Score: <span className={score === data.quiz.length ? "text-green-600" : "text-brand-main"}>{score}/{data.quiz.length}</span>
                </div>
              )}
            </div>

            {/* --- QUIZ CONTENT AREA --- */}
            <div className="relative z-10 flex-grow flex flex-col">
              
              {/* MODE 1: ACTIVE QUIZ (Flashcards) */}
              {!isSubmitted ? (
                <div className="flex flex-col justify-between h-full">
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
                    <motion.div 
                      className="h-full bg-brand-main"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestionIndex + 1) / data.quiz.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  {/* Animated Question Card */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQuestionIndex}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -50, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-grow"
                    >
                      <p className="font-bold text-slate-800 text-lg mb-6 leading-relaxed">
                        {currentQuestion.question}
                      </p>

                      <div className="space-y-3">
                        {currentQuestion.options.map((option, oIndex) => (
                          <button
                            key={oIndex}
                            onClick={() => handleOptionSelect(option)}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex justify-between items-center ${getOptionStyle(currentQuestionIndex, option)}`}
                          >
                            <span className="font-medium text-sm">{option}</span>
                            {userAnswers[currentQuestionIndex] === option && (
                              <div className="w-4 h-4 bg-white/20 rounded-full border border-white/50"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Footer */}
                  <div className="mt-8 flex justify-end">
                    {!isLastQuestion ? (
                      <button 
                        onClick={handleNextQuestion}
                        disabled={!userAnswers[currentQuestionIndex]}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={handleSubmitQuiz}
                        disabled={!userAnswers[currentQuestionIndex]}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-main text-white rounded-xl font-bold hover:bg-opacity-90 transition shadow-lg shadow-brand-main/20 disabled:opacity-50"
                      >
                        Submit Quiz <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* MODE 2: REVIEW RESULTS (Scrollable List) */
                <div className="space-y-8 animate-in fade-in duration-500 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                  {data.quiz.map((q, idx) => {
                    const isCorrect = userAnswers[idx] === q.answer;
                    return (
                      <div key={idx} className="border-b border-slate-100 pb-6 last:border-0">
                        <div className="flex items-start gap-3 mb-3">
                          {isCorrect ? <CheckCircle className="w-6 h-6 text-green-500 mt-1" /> : <XCircle className="w-6 h-6 text-red-500 mt-1" />}
                          <div>
                            <p className="font-bold text-slate-800 text-md">{q.question}</p>
                            <div className="flex gap-2 mt-1 text-xs font-semibold uppercase tracking-wider">
                              <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                {isCorrect ? "Correct" : "Incorrect"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Options Review */}
                        <div className="grid gap-2 pl-9">
                          {q.options.map((opt, i) => (
                            <div key={i} className={`p-3 rounded-lg border text-sm flex justify-between ${getOptionStyle(idx, opt)}`}>
                              <span>{opt}</span>
                              {q.answer === opt && <span className="text-xs font-bold px-2 py-0.5 bg-white/50 rounded">Correct Answer</span>}
                            </div>
                          ))}
                        </div>

                        {/* Explanation Box (Only shown if incorrect) */}
                        {!isCorrect && (
                          <div className="ml-9 mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-3 text-orange-800">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="font-bold mb-1">Explanation:</p>
                              {/* Fallback if your data doesn't have an explanation field yet */}
                              <p className="opacity-90">{q.explanation || `The correct answer is "${q.answer}" because it aligns with the core concepts discussed in the summary.`}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  <button onClick={() => { setIsSubmitted(false); setCurrentQuestionIndex(0); setUserAnswers({}); setScore(0); }} className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition">
                    Retake Quiz
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsDashboard;