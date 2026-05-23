import { useState, useRef, useEffect } from "react";
import {
  Mic,
  Play,
  Settings,
  Upload,
  Wand2,
  Volume2,
  Download,
  Plus,
  Settings2,
  Sparkles,
  AlertCircle,
  Terminal,
  Cpu,
  Monitor,
  Zap,
  FileText,
  ClipboardCopy,
  Languages,
  ArrowRightLeft,
} from "lucide-react";

const SPEECH_TAGS = [
  "[pause]",
  "[emphasis]",
  "[laughing]",
  "[inhale]",
  "[chuckle]",
  "[tsk]",
  "[singing]",
  "[excited]",
  "[laughing tone]",
  "[interrupting]",
  "[chuckling]",
  "[excited tone]",
  "[volume up]",
  "[echo]",
  "[angry]",
  "[low volume]",
  "[sigh]",
  "[low voice]",
  "[whisper]",
  "[screaming]",
  "[shouting]",
  "[loud]",
  "[surprised]",
  "[short pause]",
  "[exhale]",
  "[delight]",
  "[panting]",
  "[audience laughter]",
  "[with strong accent]",
  "[volume down]",
  "[clearing throat]",
  "[sad]",
  "[moaning]",
  "[shocked]",
];

const FULL_LANGUAGES = [
  "English",
  "Chinese (Mandarin)",
  "Japanese",
  "Korean",
  "German",
  "French",
  "Spanish",
  "Arabic",
  "Russian",
  "Portuguese",
  "Italian",
  "Hindi",
  "Dutch",
  "Turkish",
  "Polish",
  "Swedish",
  "Vietnamese",
  "Indonesian",
  "Thai",
  "Greek",
  "Hebrew",
  "Bengali",
  "Urdu",
  "Tamil",
  "Afrikaans",
  "Albanian",
  "Amharic",
  "Armenian",
  "Azerbaijani",
  "Basque",
  "Belarusian",
  "Bosnian",
  "Bulgarian",
  "Catalan",
  "Cebuano",
  "Chichewa",
  "Corsican",
  "Croatian",
  "Czech",
  "Danish",
  "Esperanto",
  "Estonian",
  "Filipino",
  "Finnish",
  "Frisian",
  "Galician",
  "Georgian",
  "Gujarati",
  "Haitian Creole",
  "Hausa",
  "Hawaiian",
  "Hmong",
  "Hungarian",
  "Icelandic",
  "Igbo",
  "Irish",
  "Javanese",
  "Kannada",
  "Kazakh",
  "Khmer",
  "Kinyarwanda",
  "Kurdish (Kurmanji)",
  "Kyrgyz",
  "Lao",
  "Latin",
  "Latvian",
  "Lithuanian",
  "Luxembourgish",
  "Macedonian",
  "Malagasy",
  "Malay",
  "Malayalam",
  "Maltese",
  "Maori",
  "Marathi",
  "Mongolian",
  "Myanmar (Burmese)",
  "Nepali",
  "Norwegian",
  "Oriya",
  "Pashto",
  "Persian",
  "Punjabi",
  "Romanian",
  "Samoan",
  "Scots Gaelic",
  "Serbian",
  "Sesotho",
  "Shona",
  "Sindhi",
  "Sinhala",
  "Slovak",
  "Slovenian",
  "Somali",
  "Sundanese",
  "Swahili",
  "Tajik",
  "Telugu",
  "Turkmen",
  "Ukrainian",
  "Uyghur",
  "Uzbek",
  "Welsh",
  "Xhosa",
  "Yiddish",
  "Yoruba",
  "Zulu",
];

const VOICES = [
  { id: "en-us-male-1", name: "US English - Default Male" },
  { id: "en-us-female-1", name: "US English - Default Female" },
  { id: "en-uk-male-1", name: "UK English - Refined Male" },
  { id: "zh-cn-female-1", name: "Chinese - Standard Female" },
  { id: "jp-female-1", name: "Japanese - Anime Female" },
  { id: "cloned-voice-1", name: "My Cloned Voice (Test)" },
  { id: "unlimited-clones", name: "... (Unlimited Zero-Shot Clones)" },
];

const NLLB_LANGUAGES = [
  { languageName: 'English', languageCode: 'eng_Latn' },
  { languageName: 'Hindi', languageCode: 'hin_Deva' },
  { languageName: 'Bengali', languageCode: 'ben_Beng' },
  { languageName: 'Bhojpuri', languageCode: 'bho_Deva' },
  { languageName: 'Urdu', languageCode: 'urd_Arab' },
  { languageName: 'Tamil', languageCode: 'tam_Taml' },
  { languageName: 'Telugu', languageCode: 'tel_Telu' },
  { languageName: 'Malayalam', languageCode: 'mal_Mlym' },
  { languageName: 'Spanish', languageCode: 'spa_Latn' },
  { languageName: 'French', languageCode: 'fra_Latn' },
  { languageName: 'German', languageCode: 'deu_Latn' },
  { languageName: 'Chinese (Simplified)', languageCode: 'zho_Hans' },
  { languageName: 'Russian', languageCode: 'rus_Cyrl' },
  { languageName: 'Portuguese', languageCode: 'por_Latn' },
  { languageName: 'Japanese', languageCode: 'jpn_Jpan' },
  { languageName: 'Korean', languageCode: 'kor_Hang' },
  { languageName: 'Italian', languageCode: 'ita_Latn' },
  { languageName: 'Dutch', languageCode: 'nld_Latn' },
  { languageName: 'Greek', languageCode: 'ell_Grek' },
  { languageName: 'Polish', languageCode: 'pol_Latn' },
  { languageName: 'Turkish', languageCode: 'tur_Latn' },
  { languageName: 'Swedish', languageCode: 'swe_Latn' },
  { languageName: 'Danish', languageCode: 'dan_Latn' },
  { languageName: 'Finnish', languageCode: 'fin_Latn' },
  { languageName: 'Hungarian', languageCode: 'hun_Latn' },
  { languageName: 'Czech', languageCode: 'ces_Latn' },
  { languageName: 'Norwegian Bokmål', languageCode: 'nob_Latn' },
  { languageName: 'Romanian', languageCode: 'ron_Latn' },
  { languageName: 'Slovak', languageCode: 'slk_Latn' },
  { languageName: 'Croatian', languageCode: 'hrv_Latn' },
  { languageName: 'Bulgarian', languageCode: 'bul_Cyrl' },
  { languageName: 'Ukrainian', languageCode: 'ukr_Cyrl' },
  { languageName: 'Serbian', languageCode: 'srp_Cyrl' },
  { languageName: 'Hebrew', languageCode: 'heb_Hebr' },
  { languageName: 'Arabic', languageCode: 'arb_Arab' },
  { languageName: 'Thai', languageCode: 'tha_Thai' },
  { languageName: 'Vietnamese', languageCode: 'vie_Latn' },
  { languageName: 'Indonesian', languageCode: 'ind_Latn' },
  { languageName: 'Malay', languageCode: 'zsm_Latn' },
  { languageName: 'Filipino', languageCode: 'tgl_Latn' },
  { languageName: 'Swahili', languageCode: 'swh_Latn' },
  { languageName: 'Amharic', languageCode: 'amh_Ethi' },
  { languageName: 'Somali', languageCode: 'som_Latn' },
  { languageName: 'Hausa', languageCode: 'hau_Latn' },
  { languageName: 'Yoruba', languageCode: 'yor_Latn' },
  { languageName: 'Zulu', languageCode: 'zul_Latn' },
  { languageName: 'Xhosa', languageCode: 'xho_Latn' },
  { languageName: 'Igbo', languageCode: 'ibo_Latn' },
  { languageName: 'Uzbek', languageCode: 'uzb_Latn' },
  { languageName: 'Kazakh', languageCode: 'kaz_Cyrl' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"tts" | "clone" | "transcribe" | "translate">(
    "tts",
  );
  const [text, setText] = useState("");
  const [refText, setRefText] = useState("");
  const [transcribedText, setTranscribedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [translateSourceLang, setTranslateSourceLang] = useState("eng_Latn");
  const [translateTargetLang, setTranslateTargetLang] = useState("hin_Deva");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hardwareMode, setHardwareMode] = useState<"cpu" | "gpu" | "hybrid">(
    "gpu",
  );
  const [inputLanguage, setInputLanguage] = useState("Auto-Detect");
  const [outputLanguage, setOutputLanguage] = useState(
    "Auto-Detect (From Text)",
  );
  const [selectedVoice, setSelectedVoice] = useState("en-us-male-1");
  const [logs, setLogs] = useState<string[]>([
    "[System] Web UI initialized.",
    "[System] Awaiting backend connection...",
  ]);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const cloneTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const transcribeTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const translateTextAreaRef = useRef<HTMLTextAreaElement>(null);

  // Advanced Settings State
  const [settings, setSettings] = useState({
    chunkLength: 200,
    maxNewTokens: 1024,
    topP: 0.7,
    temperature: 0.7,
    repetitionPenalty: 1.2,
    autoMerge: true,
    whisperModel: "small",
    ttsModel: "s2-pro",
  });

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString("en-US", { hour12: false })}] ${message}`,
    ]);
  };

  useEffect(() => {
    // Hardware Auto-Detection Simulation
    const timer = setTimeout(() => {
      setHardwareMode("hybrid");
      addLog(
        "[System] Hardware Auto-Detection Complete: Running on CPU with GPU environment.",
      );
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleTagClick = (tag: string) => {
    const activeRef = activeTab === "tts" ? textAreaRef : cloneTextAreaRef;
    if (!activeRef.current) return;

    const start = activeRef.current.selectionStart;
    const end = activeRef.current.selectionEnd;
    const currentText = activeTab === "tts" ? text : refText;
    const newText =
      currentText.substring(0, start) + tag + currentText.substring(end);

    if (activeTab === "tts") setText(newText);
    else setRefText(newText);

    // Set focus back to textarea after React re-renders
    setTimeout(() => {
      if (activeRef.current) {
        activeRef.current.focus();
        activeRef.current.setSelectionRange(
          start + tag.length,
          start + tag.length,
        );
      }
    }, 0);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    const activeText = activeTab === "tts" ? text : refText;
    const wordCount =
      activeText.split(/\s+/).filter((w) => w.length > 0).length || 1;
    const estimatedChunks = Math.ceil(wordCount / settings.chunkLength);

    addLog(
      `[System] Starting generation in ${hardwareMode.toUpperCase()} mode...`,
    );
    addLog(
      `[System] Text length: ${wordCount} words. Dividing into ${estimatedChunks} chunk(s) (${settings.chunkLength} words/chunk).`,
    );
    addLog(
      `[System] Target Language: ${outputLanguage}, Voice: ${VOICES.find((v) => v.id === selectedVoice)?.name}`,
    );
    addLog(
      `[System] Model: ${settings.ttsModel}, Temp: ${settings.temperature}`,
    );

    // Simulate generation delay with chunk-by-chunk processing
    let currentChunk = 1;
    const interval = setInterval(() => {
      if (currentChunk <= estimatedChunks) {
        addLog(
          `[Backend] Processing audio chunk ${currentChunk}/${estimatedChunks}...`,
        );
        currentChunk++;
      } else {
        clearInterval(interval);
        if (settings.autoMerge && estimatedChunks > 1) {
          addLog(
            `[FFmpeg] Merging ${estimatedChunks} audio chunks into a single file...`,
          );
          setTimeout(() => {
            addLog(
              `[System] Chunk merge complete. Final audio ready for playback.`,
            );
            setIsGenerating(false);
          }, 1500);
        } else {
          addLog(`[System] Generation complete. Ready for playback.`);
          setIsGenerating(false);
        }
      }
    }, 1000);
  };

  const handleAutoTranscribe = () => {
    addLog("[Whisper] Initiating auto-transcription model...");

    setTimeout(() => {
      addLog("[Whisper] Transcribing exact reference audio...");
      setRefText(
        "This is an exact transcription of the original audio, without translation.",
      );
      addLog(`[Whisper] Transcription complete. Ready for alignment.`);
    }, 2000);
  };

  const handleTranscribeTab = () => {
    setIsTranscribing(true);
    addLog(
      `[Whisper] Initiating standalone transcription model using ${settings.whisperModel}...`,
    );
    setTimeout(() => {
      setTranscribedText(
        "This is the full transcription from your standalone audio file using the local Whisper model.",
      );
      addLog(`[Whisper] Standalone transcription complete.`);
      setIsTranscribing(false);
    }, 2500);
  };

  const handleTranslateTab = async () => {
    if (!transcribedText) return;
    setIsTranslating(true);
    const sourceName = NLLB_LANGUAGES.find(l => l.languageCode === translateSourceLang)?.languageName;
    const targetName = NLLB_LANGUAGES.find(l => l.languageCode === translateTargetLang)?.languageName;
    addLog(`[NLLB-200] Translating text from ${sourceName} to ${targetName}...`);
    
    try {
      const response = await fetch("http://localhost:8000/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          languageText: transcribedText,
          sourceLanguageCode: translateSourceLang,
          targetLanguageCode: translateTargetLang
        })
      });

      if (!response.ok) {
        throw new Error("Local NLLB-200 Backend is not running on port 8000.");
      }

      const data = await response.json();
      
      if (data.success) {
        setTranslatedText(data.translated_text);
        addLog(`[NLLB-200] Translation complete.`);
      } else {
        setTranslatedText("");
        addLog(`[NLLB-200 Error] ${data.message}`);
      }
    } catch (error: any) {
      addLog(`[NLLB-200 Error] Failed to connect to Python backend: ${error.message}`);
      setTranslatedText(`Error: Could not connect to the local NLLB-200 backend. \n\nPlease ensure you have installed the requirements and started the FastAPI server from the next-nllb200-language-translator/backend directory on port 8000.\n\nRun:\npip install -r requirements.txt\nuvicorn app:app --port 8000`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopyFromTranscribe = () => {
    if (!transcribedText) return;
    if (activeTab === "tts") {
      setText((prev) => prev + (prev ? "\n\n" : "") + transcribedText);
    } else if (activeTab === "clone") {
      setRefText((prev) => prev + (prev ? "\n\n" : "") + transcribedText);
    }
    addLog(
      `[System] Copied transcribed text to ${activeTab === "tts" ? "TTS Input" : "Target Speech Text"}.`,
    );
  };

  // Auto-resize textarea logic
  const resizeNode = (node: HTMLTextAreaElement | null) => {
    if (!node) return;
    node.style.height = "auto";
    node.style.height = `${node.scrollHeight}px`;
  };

  useEffect(() => {
    resizeNode(textAreaRef.current);
  }, [text]);

  useEffect(() => {
    resizeNode(cloneTextAreaRef.current);
  }, [refText]);

  useEffect(() => {
    resizeNode(transcribeTextAreaRef.current);
  }, [transcribedText]);

  useEffect(() => {
    resizeNode(translateTextAreaRef.current);
  }, [translatedText]);

  const adjustHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    resizeNode(e.target);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 selection:bg-indigo-500/30 font-sans flex flex-col">
      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">
              Fish Speech S2
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            {/* Hardware Mode Selector */}
            <div className="bg-white/5 rounded-lg p-1 flex">
              <button
                onClick={() => {
                  setHardwareMode("cpu");
                  addLog("Hardware mode switched to CPU Only");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${hardwareMode === "cpu" ? "bg-indigo-500 text-white" : "text-gray-400 hover:text-gray-200"}`}
              >
                <Cpu className="w-3.5 h-3.5" /> CPU Only
              </button>
              <button
                onClick={() => {
                  setHardwareMode("gpu");
                  addLog("Hardware mode switched to GPU (EC2)");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${hardwareMode === "gpu" ? "bg-indigo-500 text-white" : "text-gray-400 hover:text-gray-200"}`}
              >
                <Monitor className="w-3.5 h-3.5" /> GPU (EC2)
              </button>
              <button
                onClick={() => {
                  setHardwareMode("hybrid");
                  addLog("Hardware mode switched to CPU + GPU");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${hardwareMode === "hybrid" ? "bg-indigo-500 text-white" : "text-gray-400 hover:text-gray-200"}`}
              >
                <Zap className="w-3.5 h-3.5" /> CPU + GPU
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-indigo-500/10 border-b border-indigo-500/20 px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-indigo-300 text-xs font-medium tracking-wide">
          <Terminal className="w-3.5 h-3.5" />
          Hardware Detection Alert:{" "}
          <span className="text-white">
            Right now we are running on{" "}
            {hardwareMode === "cpu"
              ? "only CPU"
              : hardwareMode === "gpu"
                ? "GPU (EC2 Instance)"
                : "CPU with GPU"}
            .
          </span>
        </div>
      </div>

      <main className="max-w-7xl w-full mx-auto px-6 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls & Input */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          {/* Module Tabs */}
          <div className="flex p-1 bg-white/5 rounded-xl backdrop-blur-sm w-fit border border-white/5">
            <button
              onClick={() => setActiveTab("tts")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "tts"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <Mic className="w-4 h-4" />
              Text-to-Speech
            </button>
            <button
              onClick={() => setActiveTab("clone")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "clone"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <Wand2 className="w-4 h-4" />
              Voice Cloning
            </button>
            <button
              onClick={() => setActiveTab("transcribe")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "transcribe"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <FileText className="w-4 h-4" />
              Transcribe Only
            </button>
            <button
              onClick={() => setActiveTab("translate")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "translate"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <Languages className="w-4 h-4" />
              Translate
            </button>
          </div>

          {activeTab !== "transcribe" && activeTab !== "translate" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-2">
                <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-200/80 leading-relaxed">
                  <strong className="text-blue-300 font-medium">
                    How Multilingual Works:
                  </strong>{" "}
                  S2 is a Text-to-Speech model, not a translator. It speaks
                  exactly what you type.{" "}
                  <strong>
                    Whisper's only job is to transcribe your reference audio
                  </strong>{" "}
                  (e.g., writing down the English text from an English voice
                  clip) so S2 learns your voice profile. Then, S2 takes over —
                  if you type Japanese text into the generator, S2 will use your
                  cloned voice to speak fluent Japanese! This is called{" "}
                  <strong className="text-blue-300">
                    Cross-Lingual Voice Cloning
                  </strong>
                  .
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Reference Audio Language
                    </label>
                  </div>
                  <select
                    value={inputLanguage}
                    onChange={(e) => setInputLanguage(e.target.value)}
                    className="bg-transparent text-sm text-gray-200 focus:outline-none w-full"
                  >
                    <option
                      value="Auto-Detect"
                      className="bg-neutral-900 font-semibold text-indigo-400"
                    >
                      ✨ Whisper Auto-Detect
                    </option>
                    {FULL_LANGUAGES.map((lang) => (
                      <option
                        key={`in-${lang}`}
                        value={lang}
                        className="bg-neutral-900"
                      >
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                  <label className="text-xs font-semibold text-emerald-500/70 uppercase tracking-wider">
                    Target Speech Language
                  </label>
                  <select
                    value={outputLanguage}
                    onChange={(e) => setOutputLanguage(e.target.value)}
                    className="bg-transparent text-sm text-gray-200 focus:outline-none w-full"
                  >
                    <option
                      value="Auto-Detect (From Text)"
                      className="bg-neutral-900 font-semibold text-emerald-400"
                    >
                      ✨ Auto-Detect (From Text)
                    </option>
                    {FULL_LANGUAGES.map((lang) => (
                      <option
                        key={`out-${lang}`}
                        value={lang}
                        className="bg-neutral-900"
                      >
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Voice Selector
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="bg-transparent text-sm text-gray-200 focus:outline-none w-full"
                >
                  {VOICES.map((v) => (
                    <option key={v.id} value={v.id} className="bg-neutral-900">
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === "clone" && (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
              <h2 className="text-lg font-medium text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-400" />
                Upload Reference Audio
              </h2>

              <div>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-indigo-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-200 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    Upload a 5-10s clip of the voice you want to clone
                  </p>
                </div>
              </div>
              <button
                onClick={handleAutoTranscribe}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium transition-colors border border-emerald-500/20"
              >
                <Sparkles className="w-4 h-4" />
                Auto-transcribe with Whisper
              </button>
            </div>
          )}

          {activeTab !== "transcribe" && (
            <div className="space-y-4 flex-1 flex flex-col">
              <h2 className="text-lg font-medium text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-indigo-400" />
                  {activeTab === "clone"
                    ? "Target Speech Text (Unlimited)"
                    : "Input Text (Unlimited)"}
                </div>
                <button
                  onClick={handleCopyFromTranscribe}
                  disabled={!transcribedText}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${transcribedText ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20" : "bg-white/5 text-gray-500 border-white/5 cursor-not-allowed"}`}
                  title={
                    !transcribedText
                      ? "Transcribe something in the Transcribe tab first"
                      : "Fetch text from transcriber tab"
                  }
                >
                  <ClipboardCopy className="w-3.5 h-3.5" />
                  Paste from Transcriber
                </button>
              </h2>

              <div className="relative flex-1 flex flex-col min-h-[300px]">
                <textarea
                  ref={activeTab === "tts" ? textAreaRef : cloneTextAreaRef}
                  value={activeTab === "tts" ? text : refText}
                  onChange={(e) => {
                    if (activeTab === "tts") setText(e.target.value);
                    else setRefText(e.target.value);
                    adjustHeight(e);
                  }}
                  placeholder="Enter unlimited text to generate speech... You can select emotion tags from the right panel to guide the prosody."
                  className="w-full flex-1 min-h-[250px] bg-white/[0.02] border border-white/10 rounded-2xl p-6 pb-20 text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-lg leading-relaxed shadow-inner overflow-hidden"
                />

                <div className="absolute bottom-4 right-4 flex gap-3">
                  <button
                    onClick={handleGenerate}
                    disabled={
                      isGenerating || (activeTab === "tts" ? !text : !refText)
                    }
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all shadow-lg text-sm ${
                      (activeTab === "tts" ? text : refText) && !isGenerating
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25"
                        : "bg-white/10 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Generate Audio
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "transcribe" && (
            <div className="space-y-6 flex-col flex flex-1 animate-in fade-in slide-in-from-bottom-2">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
                <h2 className="text-lg font-medium text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-indigo-400" />
                  Upload Audio for Transcription
                </h2>

                <div>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-gray-400 group-hover:text-indigo-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-200 mb-1">
                      Click to upload or drag and drop audio file
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports MP3, WAV, FLAC, M4A, etc. (Unlimited File Size,
                      No Limits)
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleTranscribeTab}
                  disabled={isTranscribing}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTranscribing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Transcribing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Transcribe Audio File
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4 flex-1 flex flex-col">
                <h2 className="text-lg font-medium text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    Transcribed Output
                  </div>
                  {transcribedText && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(transcribedText);
                        addLog("[System] Copied transcription to clipboard.");
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-500/20"
                    >
                      <ClipboardCopy className="w-3.5 h-3.5" />
                      Copy Text
                    </button>
                  )}
                </h2>

                <div className="relative flex-1 flex flex-col min-h-[300px]">
                  <textarea
                    ref={transcribeTextAreaRef}
                    value={transcribedText}
                    onChange={(e) => {
                      setTranscribedText(e.target.value);
                      adjustHeight(e);
                    }}
                    placeholder="Transcription result will appear here. Note: Whisper performs transcription natively across 99+ languages."
                    className="w-full flex-1 min-h-[250px] bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-emerald-100/90 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none text-lg leading-relaxed shadow-inner overflow-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "translate" && (
            <div className="space-y-6 flex-col flex flex-1 animate-in fade-in slide-in-from-bottom-2">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-white flex items-center gap-2">
                    <Languages className="w-5 h-5 text-indigo-400" />
                    NLLB-200 Translation Setup
                  </h2>
                  <span className="text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-md">Integration Ready</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                     <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Source Language</label>
                     <select 
                       value={translateSourceLang}
                       onChange={(e) => setTranslateSourceLang(e.target.value)}
                       className="bg-transparent text-sm text-gray-200 focus:outline-none w-full"
                     >
                       {NLLB_LANGUAGES.map((lang) => (
                         <option key={`src-${lang.languageCode}`} value={lang.languageCode} className="bg-neutral-900">
                           {lang.languageName}
                         </option>
                       ))}
                     </select>
                  </div>

                  <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl p-3 flex flex-col gap-1 relative">
                     <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center z-10 hidden md:flex">
                       <ArrowRightLeft className="w-4 h-4 text-gray-400" />
                     </div>
                     <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Target Language</label>
                     <select 
                       value={translateTargetLang}
                       onChange={(e) => setTranslateTargetLang(e.target.value)}
                       className="bg-transparent text-sm text-indigo-100 focus:outline-none w-full"
                     >
                       {NLLB_LANGUAGES.map((lang) => (
                         <option key={`tgt-${lang.languageCode}`} value={lang.languageCode} className="bg-neutral-900">
                           {lang.languageName}
                         </option>
                       ))}
                     </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-200">Text to Translate</label>
                      <button
                        onClick={() => {
                          if (transcribedText && translatedText) setTranslatedText("");
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Clear Translation?
                      </button>
                  </div>
                  <button 
                      onClick={handleTranslateTab}
                      disabled={isTranslating || !transcribedText}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      {isTranslating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Translating with NLLB-200...
                        </>
                      ) : (
                        <>
                          <Languages className="w-4 h-4" />
                          {transcribedText ? "Translate Transcribed Text" : "Transcribe Something First"}
                        </>
                      )}
                  </button>
                </div>
              </div>

              <div className="space-y-4 flex-1 flex flex-col">
                <h2 className="text-lg font-medium text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Translated Output
                  </div>
                  {translatedText && (
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(translatedText);
                        addLog('[System] Copied translation to clipboard. Ready for S2 TTS.');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-colors border border-indigo-500/20"
                    >
                      <ClipboardCopy className="w-3.5 h-3.5" />
                      Copy Translation
                    </button>
                  )}
                </h2>
                
                <div className="relative flex-1 flex flex-col min-h-[300px]">
                  <textarea
                    ref={translateTextAreaRef}
                    value={translatedText}
                    onChange={(e) => {
                      setTranslatedText(e.target.value);
                      adjustHeight(e);
                    }}
                    placeholder="Translated output will appear here. This text can then be directly copied into the Voice Cloning or TTS parameters."
                    className="w-full flex-1 min-h-[250px] bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-indigo-100/90 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-lg leading-relaxed shadow-inner overflow-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab !== "transcribe" && activeTab !== "translate" && (
            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between opacity-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Generated Output
                  </p>
                  <p className="text-xs text-gray-600">
                    Audio will appear here after generation
                  </p>
                </div>
              </div>
              <button
                disabled
                className="p-2 rounded-lg bg-white/5 text-gray-600 cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Tags, Settings & Logs */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col max-h-[350px] shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="font-medium text-gray-200">Emotion Tags</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Click to insert natural-language instructions at your cursor
              position to control S2's vocal delivery.
            </p>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex flex-wrap gap-2">
                {SPEECH_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-300 border border-white/5 hover:border-indigo-500/30 text-xs text-gray-400 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-gray-400" />
                <h3 className="font-medium text-gray-200">Advanced Settings</h3>
              </div>
              <Plus
                className={`w-4 h-4 text-gray-500 transition-transform ${showAdvanced ? "rotate-45" : ""}`}
              />
            </button>

            {showAdvanced && (
              <div className="space-y-5 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label className="text-gray-400 font-medium tracking-wide">
                      Temperature
                    </label>
                    <span className="text-indigo-400 font-mono">
                      {settings.temperature}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.5"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        temperature: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-indigo-500"
                  />
                  <p className="text-[10.5px] text-gray-500 leading-tight">
                    Controls creativity logic. Lower = consistent/robotic,
                    Higher = variable/expressive.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-medium tracking-wide">
                    Words per Chunk
                  </label>
                  <select
                    value={settings.chunkLength}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        chunkLength: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-gray-200 focus:outline-none"
                  >
                    <option value={100}>100 words (Safe for Low VRAM)</option>
                    <option value={200}>200 words (Recommended)</option>
                    <option value={500}>500 words (High VRAM)</option>
                  </select>
                  <p className="text-[10.5px] text-gray-500 leading-tight">
                    Long texts automatically divide into chunks to prevent
                    Out-Of-Memory errors.
                  </p>
                </div>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-black/30 border border-white/5 hover:bg-white/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.autoMerge}
                    onChange={(e) =>
                      setSettings({ ...settings, autoMerge: e.target.checked })
                    }
                    className="rounded bg-black border-white/20 text-indigo-500 focus:ring-1 focus:ring-indigo-500/50 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <p className="text-sm text-gray-200">FFmpeg Auto-Merge</p>
                    <p className="text-[10.5px] text-gray-500">
                      Store memory locally & combine chunks seamlessly after
                      generation ends.
                    </p>
                  </div>
                </label>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider">
                      TTS Model
                    </label>
                    <select
                      value={settings.ttsModel}
                      onChange={(e) =>
                        setSettings({ ...settings, ttsModel: e.target.value })
                      }
                      className="w-full bg-black/50 border border-white/10 rounded p-1.5 text-xs text-gray-200 focus:outline-none"
                    >
                      <option value="s2-pro">S2-Pro (4B)</option>
                      <option value="s2-base">S2-Base (Fast)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider">
                      Whisper Model
                    </label>
                    <select
                      value={settings.whisperModel}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          whisperModel: e.target.value,
                        })
                      }
                      className="w-full bg-black/50 border border-white/10 rounded p-1.5 text-xs text-gray-200 focus:outline-none"
                    >
                      <option value="tiny">Tiny (Fastest)</option>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large-v3">Large-v3 (Best)</option>
                    </select>
                    <p className="text-[9px] text-emerald-500/70 leading-tight">
                      Natively supports 99+ languages.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Log Window */}
          <div className="flex-1 flex flex-col p-5 rounded-2xl bg-black border border-white/10 min-h-[250px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-400" />
                <h3 className="font-medium text-xs tracking-wider text-gray-400 uppercase">
                  System Logs
                </h3>
              </div>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              </div>
            </div>
            <div className="flex-1 bg-black overflow-y-auto font-mono text-[11px] text-emerald-400/90 custom-scrollbar whitespace-pre-wrap leading-relaxed">
              {logs.map((log, i) => (
                <div key={i} className="mb-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `,
        }}
      />
    </div>
  );
}
