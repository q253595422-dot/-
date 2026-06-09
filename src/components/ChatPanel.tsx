import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Volume2, User, Mic } from "lucide-react";
import { ChatMessage, CompanionStatus } from "../types";

interface ChatPanelProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  status: CompanionStatus;
  setStatus: React.Dispatch<React.SetStateAction<CompanionStatus>>;
  onAddDiary: (title: string, desc: string) => void;
  theme?: "dark" | "light";
}

const PRESET_TOPICS = [
  { text: "我今天太累啦……", icon: "🥱" },
  { text: "我想对你表白！", icon: "❤️" },
  { text: "今天写代码被Bug卡住了", icon: "😭" },
  { text: "给我唱一首好听的歌吧", icon: "🎵" },
];

export default function ChatPanel({
  chatHistory,
  setChatHistory,
  status,
  setStatus,
  onAddDiary,
  theme = "dark",
}: ChatPanelProps) {
  const isDark = theme === "dark";
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [activeVoiceLy, setActiveVoiceLy] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto Scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isSending]);

  const handleSendMessage = async (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message || isSending) return;

    setIsSending(true);
    setInputText("");

    // 1. Add User Message to History
    const userMsg: ChatMessage = {
      id: "u-" + Date.now(),
      role: "user",
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatHistory((p) => [...p, userMsg]);

    // 2. Fetch from Backend /api/chat
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          history: chatHistory.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await response.json();

      // 3. Add Model Message to History
      const botMsg: ChatMessage = {
        id: "m-" + Date.now(),
        role: "model",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatHistory((p) => [...p, botMsg]);

      // Adjust her mood if positive words detected
      let extraEnergy = 2;
      let newMood = status.mood;
      if (message.includes("爱") || message.includes("喜欢")) {
        newMood = "甜蜜依偎";
        onAddDiary("💖 倾心之恋", "你对小团进行了深情地表白，小团的心里乐开了花！");
      } else if (message.includes("累") || message.includes("哭") || message.includes("痛")) {
        newMood = "心疼体贴";
        onAddDiary("💫 温柔相守", "在备受挫折的时刻，有小团在你耳边细语，给你重生的温暖力量。");
      }

      setStatus((prev) => ({
        ...prev,
        energy: Math.min(100, prev.energy + extraEnergy),
        mood: newMood,
      }));

    } catch (err) {
      console.error("Chat error:", err);
      // Fallback
      const fallbackMsg: ChatMessage = {
        id: "m-err-" + Date.now(),
        role: "model",
        text: "(小团刚才有些信号不太好，不过两手托腮，开心地扑在你的肩头上，软声呼唤你...) 唔，无论你在说什么，小团都在听哦，最喜欢守着你了！🌸",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatHistory((p) => [...p, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const playSimulatedVoice = (text: string) => {
    setActiveVoiceLy(text);
    setTimeout(() => {
      setActiveVoiceLy(null);
    }, 4500);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between" id="chat_panel_container">
      
      {/* Wave Voice Lyric Banner */}
      <AnimatePresence>
        {activeVoiceLy && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`border-b px-4 py-2.5 flex items-center gap-3 text-xs duration-300 ${
              isDark 
                ? "bg-pink-500/10 border-pink-500/20 text-pink-300" 
                : "bg-pink-500/5 border-pink-200/35 text-pink-600"
            }`}
            id="chat_wave_banner"
          >
            <div className="flex gap-0.5 items-end justify-center h-4 animate-pulse">
              <span className="w-0.5 h-3 bg-pink-500 rounded-full animate-[bounce_0.6s_infinite]" />
              <span className="w-0.5 h-4 bg-pink-500 rounded-full animate-[bounce_0.8s_infinite_-0.2s]" />
              <span className="w-0.5 h-2 bg-pink-500 rounded-full animate-[bounce_0.5s_infinite_0.1s]" />
              <span className="w-0.5 h-4 bg-pink-500 rounded-full animate-[bounce_0.7s_infinite_-0.4s]" />
            </div>
            <span className="italic font-sans truncate">“{activeVoiceLy}”</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Feed Canvas */}
      <div className={`flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin ${
        isDark ? "scrollbar-thumb-gray-800" : "scrollbar-thumb-pink-100"
      }`} id="chat_history_canvas">
        {chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 animate-bounce ${
              isDark ? "bg-pink-500/10 text-pink-400" : "bg-pink-100 text-pink-600"
            }`}>
              💬
            </div>
            <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-slate-600"}`}>目前还没有聊天记录呢</p>
            <p className={`text-xs mt-1 max-w-xs leading-relaxed ${isDark ? "text-gray-500" : "text-slate-450"}`}>
              快在下方给小团输入你想说的话，或者点击下方的预设卡片展开互动吧！
            </p>
          </div>
        )}

        {chatHistory.map((m) => {
          const isUser = m.role === "user";
          return (
            <div 
              key={m.id} 
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
              id={`chat_bubble_${m.id}`}
            >
              {/* Avatar Indicator */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-md shrink-0 ${
                isUser 
                  ? isDark 
                    ? "bg-slate-700 text-white border border-white/10" 
                    : "bg-slate-100 text-slate-800 border border-slate-200"
                  : "bg-gradient-to-tr from-pink-500 to-rose-400 text-white"
              }`}>
                {isUser ? <User className="w-4 h-4" /> : "团"}
              </div>

              {/* Speech Box */}
              <div className={`max-w-[75%] rounded-2xl p-3.5 shadow-md relative border ${
                isUser 
                  ? isDark 
                    ? "bg-slate-800/90 text-slate-100 rounded-tr-none border-white/5" 
                    : "bg-white text-slate-800 rounded-tr-none border-pink-200/30"
                  : isDark
                    ? "bg-gradient-to-br from-pink-900/40 to-pink-950/40 text-pink-100 rounded-tl-none border-pink-500/20"
                    : "bg-pink-500/[0.05] text-slate-800 rounded-tl-none border-pink-100"
              }`}>
                <p className="text-xs md:text-sm leading-relaxed whitespace-pre-line font-sans">
                  {m.text}
                </p>

                <div className="flex justify-between items-center mt-2.5">
                  <span className={`text-[9px] font-mono ${isDark ? "text-gray-400" : "text-slate-500"}`}>{m.timestamp}</span>
                  
                  {!isUser && (
                    <button 
                      onClick={() => playSimulatedVoice(m.text)}
                      className={`p-1 rounded hover:bg-black/10 transition-colors cursor-pointer ${
                        isDark ? "text-pink-400 hover:text-pink-300" : "text-pink-600 hover:text-pink-700"
                      }`}
                      title="模拟原声发音"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Loading Indicator */}
        {isSending && (
          <div className="flex items-start gap-3" id="typing_indicator">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center text-xs font-semibold">
              团
            </div>
            <div className={`rounded-2xl rounded-tl-none p-4 shadow-sm border ${
              isDark ? "bg-gray-800/60 border-white/5" : "bg-pink-50/50 border-pink-100"
            }`}>
              <div className="flex gap-1.5 items-center justify-center py-1">
                <span className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce" />
                <span className="w-2.5 h-2.5 bg-pink-450 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2.5 h-2.5 bg-pink-300 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Preset Topics Board */}
      <div className={`px-4 py-2 border-t transition-colors duration-300 ${
        isDark ? "bg-gray-900/10 border-white/5" : "bg-pink-500/[0.01]/10 border-pink-100/20"
      }`} id="chat_presets">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PRESET_TOPICS.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(topic.text)}
              disabled={isSending}
              className={`flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1.5 text-[11px] transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50 ${
                isDark
                  ? "bg-gray-800/40 hover:bg-pink-500/10 border border-white/5 hover:border-pink-500/30 text-slate-300 hover:text-pink-300"
                  : "bg-pink-50 hover:bg-pink-100/60 border border-pink-200/50 hover:border-pink-300 text-pink-700"
              }`}
            >
              <span>{topic.icon}</span>
              <span>{topic.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className={`p-4 border-t flex gap-2 items-center transition-colors duration-300 ${
        isDark ? "bg-gray-900/35 border-white/5" : "bg-pink-50/20 border-pink-100/40"
      }`} id="chat_input_bar">
        <div className={`p-2 rounded-xl cursor-pointer active:scale-95 transition-all ${
          isDark ? "bg-gray-800/20 text-gray-400 hover:text-white" : "bg-pink-100/40 text-slate-500 hover:text-pink-600"
        }`}>
          <Mic className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
          placeholder={`想跟小团说什么？(按下 Enter 发送)`}
          className={`flex-1 text-xs rounded-xl px-4 py-3 outline-none border focus:ring-1 transition-all font-sans ${
            isDark 
              ? "bg-gray-800/65 text-white placeholder-gray-500 border-white/10 hover:border-white/20 focus:border-pink-500/50 focus:ring-pink-500/20" 
              : "bg-white text-slate-800 placeholder-slate-400 border-pink-200 focus:border-pink-400 focus:ring-pink-400/20"
          }`}
          disabled={isSending}
          id="chat_keyboard_input"
        />

        <button
          onClick={() => handleSendMessage(inputText)}
          disabled={!inputText.trim() || isSending}
          className={`p-3 rounded-xl shadow-lg font-medium text-xs transition-all flex items-center justify-center cursor-pointer active:scale-95 ${
            inputText.trim() && !isSending
              ? "bg-gradient-to-tr from-pink-500 to-rose-500 text-white hover:opacity-90"
              : isDark 
                ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5" 
                : "bg-pink-50 text-pink-300 cursor-not-allowed border border-pink-100"
          }`}
          id="chat_send_btn"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
