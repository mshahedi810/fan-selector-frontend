"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AIVoiceFilter = ({ onFiltersUpdate }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [error, setError] = useState('');

  const recognitionRef = useRef(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fa-IR';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setAnalysis('');
      setError('');
    };

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        interim += event.results[i][0].transcript;
      }
      setTranscript(interim);
    };

    recognition.onerror = (event) => {
      setError(`خطای گفتار: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, []);

  useEffect(() => {
    if (!isListening && transcript.trim()) analyzeTranscript(transcript);
  }, [isListening, transcript]);

  const handleListen = () => {
    if (!isSupported) return;
    if (isListening) recognitionRef.current?.stop();
    else recognitionRef.current?.start();
  };

  const analyzeTranscript = async (text) => {
    setIsLoading(true);
    setError('');
    setAnalysis('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در پردازش');

      onFiltersUpdate({
        airflow: data.airflow,
        staticPressure: data.staticPressure,
        temperature: data.temperature,
      });

      setAnalysis(`دبی: ${data.airflow} m³/h | فشار: ${data.staticPressure} Pa | دما: ${data.temperature}°C`);
    } catch (e) {
      console.error(e);
      setError('خطا در تحلیل صوت.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col items-center gap-6">

      <h2 className="text-2xl font-extrabold text-white mb-4 tracking-wide">
        فیلتر صوتی حرفه‌ای
      </h2>

      {!isSupported && (
        <div className="p-3 bg-red-500/20 rounded-xl shadow-lg text-red-100 text-sm font-semibold backdrop-blur-sm text-center">
          مرورگر شما از تشخیص گفتار پشتیبانی نمی‌کند.
        </div>
      )}

      <div className="relative">
        <AnimatePresence>
          {isListening && (
            <>
              <motion.span
                className="absolute w-40 h-40 rounded-full border border-pink-500/50"
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0.2, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              />
              <motion.span
                className="absolute w-56 h-56 rounded-full border border-purple-400/40"
                animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0.1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </>
          )}
        </AnimatePresence>

        <button
          onClick={handleListen}
          className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-4xl text-white shadow-lg transition-transform duration-300 transform ${
            isListening ? 'bg-pink-500/80 hover:bg-pink-600 scale-110' : 'bg-gray-700/80 hover:bg-gray-600'
          }`}
        >
          {isListening ? '🎤' : '🎧'}
        </button>
      </div>

      <p className="text-white/80 text-center text-sm">
        {isListening ? 'در حال گوش دادن...' : 'روی میکروفون کلیک کنید'}
      </p>

      {(transcript || isLoading || analysis || (error && !isListening)) && (
        <div className="w-full mt-4 flex flex-col gap-3">
          {isLoading && (
            <motion.div
              className="h-2 bg-linear-to-r from-pink-500 via-purple-500 to-yellow-500 rounded-full"
              animate={{ scaleX: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />
          )}

          <AnimatePresence>
            {transcript && !isLoading && !analysis && !error && (
              <motion.div
                className="p-3 bg-white/20 rounded-xl shadow-lg text-white text-sm backdrop-blur-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <strong>شما گفتید:</strong> {transcript}
              </motion.div>
            )}

            {analysis && (
              <motion.div
                className="p-3 bg-green-500/20 rounded-xl shadow-lg text-green-100 text-sm font-semibold backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {analysis}
              </motion.div>
            )}

            {error && !isListening && (
              <motion.div
                className="p-3 bg-red-500/20 rounded-xl shadow-lg text-red-100 text-sm font-semibold backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AIVoiceFilter;
