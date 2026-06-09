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
}: ChatPanelProps) {
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
            className="bg-pink-500/10 border-b border-pink-500/20 px-4 py-2.5 flex items-center gap-3 text-pink-300 text-xs"
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
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-800" id="chat_history_canvas">
        {chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-500">
            <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 text-2xl mb-4 animate-bounce">
              💬
            </div>
            <p className="text-sm font-medium text-gray-400">目前还没有聊天记录呢</p>
            <p className="text-xs text-gray-500 mt-1">
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-md ${
                isUser 
                  ? "bg-slate-700 text-white border border-white/10" 
                  : "bg-gradient-to-tr from-pink-500 to-rose-400 text-white"
              }`}>
                {isUser ? <User className="w-4 h-4" /> : "团"}
              </div>

              {/* Speech Box */}
              <div className={`max-w-[75%] rounded-2xl p-3.5 shadow-lg relative border ${
                isUser 
                  ? "bg-slate-800/90 text-slate-150 rounded-tr-none border-white/5" 
                  : "bg-gradient-to-br from-pink-900/40 to-pink-950/40 text-pink-100 rounded-tl-none border-pink-500/20"
              }`}>
                <p className="text-xs md:text-sm leading-relaxed whitespace-pre-line text-slate-100">
                  {m.text}
                </p>

                <div className="flex justify-between items-center mt-2.5">
                  <span className="text-[9px] text-gray-400 font-mono">{m.timestamp}</span>
                  
                  {!isUser && (
                    <button 
                      onClick={() => playSimulatedVoice(m.text)}
                      className="text-pink-400 hover:text-pink-300 p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
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
            <div className="bg-gray-800/60 rounded-2xl rounded-tl-none p-4 shadow-lg border border-white/5">
              <div className="flex gap-1.5 items-center justify-center py-1">
                <span className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce" />
                <span className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2.5 h-2.5 bg-pink-300 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Preset Topics Board */}
      <div className="px-4 py-2 bg-gray-900/10 border-t border-white/5" id="chat_presets">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PRESET_TOPICS.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(topic.text)}
              disabled={isSending}
              className="flex items-center gap-1.5 shrink-0 bg-gray-800/40 hover:bg-pink-500/10 border border-white/5 hover:border-pink-500/30 rounded-full px-3 py-1.5 text-[11px] text-slate-300 hover:text-pink-300 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            >
              <span>{topic.icon}</span>
              <span>{topic.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-gray-900/35 border-t border-white/5 flex gap-2 items-center" id="chat_input_bar">
        <div className="bg-gray-800/20 p-2 rounded-xl text-gray-400 hover:text-white cursor-pointer active:scale-95 transition-all">
          <Mic className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
          placeholder={`想跟小团说什么？(按下 Enter 发送)`}
          className="flex-1 bg-gray-800/65 text-white placeholder-gray-500 text-xs rounded-xl px-4 py-3 outline-none border border-white/10 hover:border-white/20 focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 transition-all font-sans"
          disabled={isSending}
          id="chat_keyboard_input"
        />

        <button
          onClick={() => handleSendMessage(inputText)}
          disabled={!inputText.trim() || isSending}
          className={`p-3 rounded-xl shadow-lg font-medium text-xs transition-all flex items-center justify-center cursor-pointer active:scale-95 ${
            inputText.trim() && !isSending
              ? "bg-gradient-to-tr from-pink-500 to-rose-500 text-white hover:opacity-90"
              : "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5"
          }`}
          id="chat_send_btn"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
