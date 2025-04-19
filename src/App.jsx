import { useState, useEffect } from 'react';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';

function App() {
  const [textInput, setTextInput] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Voice recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (recognition) {
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US'; // Default to English, can be dynamic based on sourceLanguage

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTextInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        setError('Voice recognition error: ' + event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, [recognition]);

  const handleVoiceInput = () => {
    if (!recognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setError('');
      recognition.start();
      setIsListening(true);
    }
  };

  const handleTextTranslation = async () => {
    // Clear previous error
    setError('');

    // Validate inputs
    if (!textInput.trim()) {
      setError('Please enter text to translate.');
      return;
    }
    if (!sourceLanguage) {
      setError('Please select a source language.');
      return;
    }
    if (!targetLanguage) {
      setError('Please select a target language.');
      return;
    }
    if (sourceLanguage === targetLanguage) {
      setError('Source and target languages cannot be the same.');
      return;
    }

    setLoading(true);
    try {
      const options = {
        method: 'POST',
        url: 'https://google-translator9.p.rapidapi.com/v2',
        headers: {
          'x-rapidapi-key': '4218e772d8mshd3036d10d2f0012p1a8adbjsnbdbc9d7a30a6',
          'x-rapidapi-host': 'google-translator9.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
        data: {
          q: textInput,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text',
        },
      };

      const response = await axios.request(options);
      setResult(response?.data?.data?.translations?.[0]?.translatedText || 'No translation found');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Failed to translate text. Please try again.');
      console.error(error);
    }
  };

  // Language options for both source and target dropdowns
  const languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'mr', name: 'Marathi' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'or', name: 'Odia' },
    { code: 'as', name: 'Assamese' },
    { code: 'ur', name: 'Urdu' },
    { code: 'ne', name: 'Nepali' },
    { code: 'si', name: 'Sinhala' },
    { code: 'ar', name: 'Arabic' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'es', name: 'Spanish' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'zh-TW', name: 'Chinese (Traditional)' },
    { code: 'ru', name: 'Russian' },
    { code: 'tr', name: 'Turkish' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'th', name: 'Thai' },
    { code: 'id', name: 'Indonesian' },
    { code: 'ms', name: 'Malay' },
    { code: 'sw', name: 'Swahili' },
    { code: 'fi', name: 'Finnish' },
    { code: 'no', name: 'Norwegian' },
    { code: 'da', name: 'Danish' },
    { code: 'sv', name: 'Swedish' },
    { code: 'pl', name: 'Polish' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'cs', name: 'Czech' },
    { code: 'ro', name: 'Romanian' },
    { code: 'sk', name: 'Slovak' },
    { code: 'bg', name: 'Bulgarian' },
    { code: 'hr', name: 'Croatian' },
    { code: 'sr', name: 'Serbian' },
    { code: 'sl', name: 'Slovenian' },
    { code: 'lt', name: 'Lithuanian' },
    { code: 'lv', name: 'Latvian' },
    { code: 'et', name: 'Estonian' },
    { code: 'is', name: 'Icelandic' },
    { code: 'el', name: 'Greek' },
    { code: 'he', name: 'Hebrew' },
    { code: 'fa', name: 'Persian' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'bs', name: 'Bosnian' },
    { code: 'mk', name: 'Macedonian' },
    { code: 'sq', name: 'Albanian' },
    { code: 'tl', name: 'Tagalog' },
    { code: 'zu', name: 'Zulu' },
    { code: 'xh', name: 'Xhosa' },
    { code: 'af', name: 'Afrikaans' },
    { code: 'jw', name: 'Javanese' },
    { code: 'cy', name: 'Welsh' },
    { code: 'ga', name: 'Irish' },
    { code: 'la', name: 'Latin' },
    { code: 'ht', name: 'Haitian Creole' },
    { code: 'yi', name: 'Yiddish' },
    { code: 'eo', name: 'Esperanto' },
    { code: 'ca', name: 'Catalan' },
    { code: 'gl', name: 'Galician' },
    { code: 'eu', name: 'Basque' },
    { code: 'haw', name: 'Hawaiian' },
  ];

  return (
    <div className="h-screen w-screen bg-slate-200 flex items-center justify-center">
      <div className="flex items-center justify-center flex-col gap-y-10">
        <h1 className="text-3xl text-zinc-700 font-bold">Text & Voice Translation</h1>

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex items-center justify-center flex-col gap-y-5 relative">
          <div className="relative">
            <textarea
              name="input-text"
              className="bg-white h-30 w-[500px] border border-slate-700 outline-none rounded-lg text-lg px-5 py-2 pr-12"
              placeholder="Enter text to translate"
              onChange={(e) => setTextInput(e.target.value)}
              value={textInput}
            />
            <button
              className={`absolute right-2 top-2 p-2 rounded-full ${isListening ? 'bg-red-500' : 'bg-slate-700'} text-white`}
              onClick={handleVoiceInput}
              title={isListening ? 'Stop Listening' : 'Start Voice Input'}
            >
              {isListening ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              )}
            </button>
            <div className="absolute bottom-2 right-2">
              <label htmlFor="source-language" className="mr-2">Source Language:</label>
              <select
                name="source-language"
                className="bg-white px-2 py-1 rounded-lg border border-zinc-700 outline-none cursor-pointer"
                onChange={(e) => setSourceLanguage(e.target.value)}
                value={sourceLanguage}
              >
                <option value="">Select</option>
                {languageOptions.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="relative">
            <textarea
              name="output-text"
              className="bg-white h-30 w-[500px] border border-slate-700 outline-none rounded-lg text-lg px-5 py-2"
              placeholder="Translated text will appear here"
              value={result}
              readOnly
            />
            <div className="absolute bottom-2 right-2">
              <label htmlFor="target-language" className="mr-2">Target Language:</label>
              <select
                name="target-language"
                className="bg-white px-2 py-1 rounded-lg border border-zinc-700 outline-none cursor-pointer"
                onChange={(e) => setTargetLanguage(e.target.value)}
                value={targetLanguage}
              >
                <option value="">Select</option>
                {languageOptions.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          className="bg-slate-700 text-slate-100 mx-auto w-[500px] py-2 rounded-lg cursor-pointer flex items-center justify-center"
          onClick={handleTextTranslation}
          disabled={loading}
        >
          {loading ? <LoaderCircle className="animate-spin" /> : 'Translate'}
        </button>
      </div>
    </div>
  );
}

export default App;