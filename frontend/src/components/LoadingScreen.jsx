import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  const [loadingText, setLoadingText] = useState("Uploading Image...");
  
  // This changes the text every 1.5 seconds to make it look "smart"
  useEffect(() => {
    const messages = [
      "Scanning handwriting...",
      "Identifying text blocks...",
      "Consulting AI Tutor...",
      "Generating Quiz Questions...",
      "Formatting PDF..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(messages[i % messages.length]);
      i++;
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
      <div className="relative">
        {/* The glow effect */}
        <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl animate-pulse"></div>
        {/* The spinning icon */}
        <Loader2 className="relative w-24 h-24 text-indigo-600 animate-spin" />
      </div>
      <h2 className="mt-8 text-2xl font-bold text-slate-800">{loadingText}</h2>
      <p className="text-slate-400 mt-2">This usually takes about 5-10 seconds.</p>
    </div>
  );
};

export default LoadingScreen;