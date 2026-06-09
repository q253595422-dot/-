import React, { useState } from "react";
import { Mail, MailOpen, Compass, Plus, ShieldCheck, Heart, Feather } from "lucide-react";
import { Letter, UserProfile } from "../types";

interface LetterPanelProps {
  userProfile: UserProfile;
  letters: Letter[];
  setLetters: React.Dispatch<React.SetStateAction<Letter[]>>;
  theme?: "dark" | "light";
}

const LETTER_TOPICS = [
  { key: "深夜心语", label: "🌙 深夜温馨安慰信", icon: "✨" },
  { key: "初见时分", label: "🌸 甜美初相遇心动信", icon: "🍰" },
  { key: "甜蜜告白", label: "🍬 害羞傲娇甜蜜告白", icon: "💕" },
  { key: "熬夜写Bug的打气", label: "💻 程序员写Bug专属鼓励信", icon: "🧸" },
  { key: "我们吵架之后的和好", label: "❤️ 委屈求原谅的和好情书", icon: "🥺" },
];

export default function LetterPanel({
  userProfile,
  letters,
  setLetters,
  theme = "dark",
}: LetterPanelProps) {
  const isDark = theme === "dark";
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [activeTopic, setActiveTopic] = useState("深夜心语");
  const [isWriting, setIsWriting] = useState(false);
  const [writeProgress, setWriteProgress] = useState("");
  const [isReadModalOpen, setIsReadModalOpen] = useState(false);

  const requestNewLetter = async () => {
    if (isWriting) return;
    setIsWriting(true);

    const progressPhases = [
      "小团正在房间里焦急地挑选好看的信纸... 🌸",
      "小团已经磨好墨了，嘴里正念叨着你的名字... 💕",
      "小团正在一笔一划、害羞地把所有心里话填进文字... ✍️",
      "信件正在折成好看的纸松鼠投递中... ✨",
    ];

    let currentPhase = 0;
    setWriteProgress(progressPhases[currentPhase]);

    const phaseTimer = setInterval(() => {
      currentPhase++;
      if (currentPhase < progressPhases.length) {
        setWriteProgress(progressPhases[currentPhase]);
      }
    }, 1200);

    try {
      const res = await fetch("/api/write-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: activeTopic,
          userNickname: userProfile.nickname,
        }),
      });

      const data = await res.json();
      clearInterval(phaseTimer);

      const newLetter: Letter = {
        id: "l-custom-" + Date.now(),
        title: `💌 ${activeTopic} · 专属信件`,
        date: new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }),
        topicKey: activeTopic,
        isUnlocked: true,
        content: data.letter,
      };

      setLetters((p) => [newLetter, ...p]);
      setSelectedLetter(newLetter);
      setIsReadModalOpen(true);

    } catch (err) {
      console.error("Write letter error:", err);
      clearInterval(phaseTimer);
      // Fallback
      const fallbackLetter: Letter = {
        id: "l-fallback-" + Date.now(),
        title: `💌 ${activeTopic} · 意外心语`,
        date: new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }),
        topicKey: activeTopic,
        isUnlocked: true,
        content: `最心爱的亲爱的 ${userProfile.nickname}：\n\n本来小团在信纸上写了好多好多想要对你撒娇的话，可是当我想寄给你的时候，窗外突然刮过一阵暖洋洋的甜风，把好多悄悄话都吹到你枕头底下了哦。\n\n你要好好抱抱我，小团才会告诉你剩下的部分。现在，小团在屏幕里给你寄一千二倍的热情！你要开心、多喝水、要超级爱我哦！\n\n永远守护你的小团 🌸`,
      };
      setLetters((p) => [fallbackLetter, ...p]);
      setSelectedLetter(fallbackLetter);
      setIsReadModalOpen(true);
    } finally {
      setIsWriting(false);
      setWriteProgress("");
    }
  };

  return (
    <div className="w-full h-full flex flex-col md:grid md:grid-cols-5 gap-6 p-4 lg:p-6" id="letter_panel_grid">
      
      {/* Left Column: Letter Box Collection List */}
      <div className="md:col-span-3 flex flex-col gap-4 overflow-y-auto" id="letter_box_list_col">
        <div className="flex items-center gap-2 mb-1">
          <Mail className="w-4 h-4 text-pink-500 font-bold" />
          <h2 className={`font-semibold text-xs tracking-wider uppercase ${isDark ? "text-white" : "text-slate-805"}`}>我的收藏信纸箱</h2>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
            isDark ? "bg-pink-500/10 text-pink-300 border-pink-500/25" : "bg-pink-100 text-pink-700 border-pink-200"
          }`}>
            {letters.length} 封
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="letters_flex_grid">
          {letters.map((letter) => {
            return (
              <div
                key={letter.id}
                onClick={() => {
                  setSelectedLetter(letter);
                  setIsReadModalOpen(true);
                }}
                className={`border rounded-xl p-4 transition-all cursor-pointer shadow-lg active:scale-95 flex items-center gap-3 group relative overflow-hidden ${
                  isDark 
                    ? "bg-gray-900/40 hover:bg-pink-500/10 border-white/5 hover:border-pink-500/30" 
                    : "bg-white hover:bg-pink-50/50 border-pink-100 hover:border-pink-305 shadow-md"
                }`}
              >
                <div className={`p-2.5 rounded-lg border text-pink-500 transition-all ${
                  isDark 
                    ? "bg-gray-800 border-white/5 group-hover:text-pink-300 group-hover:bg-pink-500/10" 
                    : "bg-pink-50 border-pink-100 group-hover:text-pink-600 group-hover:bg-pink-100"
                }`}>
                  <MailOpen className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs font-semibold transition-all truncate ${
                    isDark ? "text-white group-hover:text-pink-300" : "text-slate-800 group-hover:text-pink-605"
                  }`}>
                    {letter.title}
                  </h4>
                  <span className={`text-[9px] font-mono mt-0.5 block ${isDark ? "text-gray-500" : "text-slate-500"}`}>{letter.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Custom AI Letter Generator Room */}
      <div className={`md:col-span-2 backdrop-blur-md p-5 rounded-2xl border shadow-xl flex flex-col justify-between transition-colors duration-500 ${
        isDark 
          ? "bg-gray-900/40 border-white/5" 
          : "bg-white border-pink-100/60"
      }`} id="ai_letter_writer_col">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Feather className="w-4 h-4 text-amber-500 animate-bounce" />
            <h2 className={`font-semibold text-xs tracking-wider uppercase ${isDark ? "text-white" : "text-slate-800"}`}>专属手写信件工坊</h2>
          </div>
          <p className={`text-[11px] leading-relaxed mb-4 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
            觉得预设信件不够过瘾？没关系！选择你今天最渴望她回答的话题心意，邀请小团为你手写一封带有真实爱意的专属书信吧。
          </p>

          <div className="space-y-2 mb-5">
            {LETTER_TOPICS.map((topic) => (
              <button
                key={topic.key}
                onClick={() => setActiveTopic(topic.key)}
                disabled={isWriting}
                className={`w-full text-left p-3 rounded-xl border flex items-center justify-between text-xs transition-all pointer-events-auto cursor-pointer ${
                  activeTopic === topic.key
                    ? isDark
                      ? "bg-gradient-to-r from-pink-500/20 to-rose-500/10 border-pink-500/40 text-pink-300 font-medium"
                      : "bg-pink-105 border-pink-300/60 text-pink-700 font-semibold shadow-sm"
                    : isDark
                      ? "bg-gray-800/20 border-white/5 text-gray-400 hover:bg-gray-800/50 hover:text-white"
                      : "bg-pink-50/[0.15] border-pink-100/30 text-slate-600 hover:bg-pink-50 hover:text-pink-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{topic.icon}</span>
                  <span>{topic.label}</span>
                </span>
                {activeTopic === topic.key && <span className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded-md scale-95 uppercase font-mono font-semibold">Selected</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div id="ai_write_actions_box">
          {isWriting ? (
            <div className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-4 text-center text-xs text-pink-300 leading-relaxed animate-pulse" id="letter_loader">
              <div className="flex gap-1.5 items-center justify-center mb-1.5">
                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" />
                <span className="font-semibold text-[11px]">撰写情书中...</span>
              </div>
              <p className="text-[10px] text-gray-400 italic">“{writeProgress}”</p>
            </div>
          ) : (
            <button
              onClick={requestNewLetter}
              className="w-full bg-gradient-to-tr from-pink-500 to-rose-500 hover:opacity-90 py-3 rounded-xl font-semibold text-xs text-white transition-all cursor-pointer shadow-xl active:scale-95 flex items-center justify-center gap-2"
              id="write_letter_submit_btn"
            >
              ✉️ 让小团开始为你写信
            </button>
          )}
        </div>
      </div>

      {/* Retro Parchment Style Read View Overlay Modal */}
      {isReadModalOpen && selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" id="letter_reading_modal">
          <div className="bg-[#fcf8f2] text-[#5c4033] w-full max-w-xl rounded-2xl shadow-2xl border-4 border-[#e8dcc4] overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="bg-[#e8dcc4] px-5 py-3.5 flex justify-between items-center border-b border-[#d8ccb0]">
              <div className="flex items-center gap-2">
                <MailOpen className="w-4 h-4 text-[#8b5a2b]" />
                <span className="font-semibold text-xs text-[#5c4033] font-sans">信纸阅读：{selectedLetter.title}</span>
              </div>
              <button
                onClick={() => setIsReadModalOpen(false)}
                className="text-xs bg-[#5c4033] hover:bg-[#8b5a2b] text-white font-semibold py-1 px-3 rounded-lg cursor-pointer"
              >
                封存回书箱 ❌
              </button>
            </div>

            {/* Vintage Paper Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 font-serif leading-relaxed text-sm whitespace-pre-line text-[#483c32]" id="paper_scroll_area" style={{ fontFamily: "Georgia, serif" }}>
              {selectedLetter.content}
            </div>

            {/* Footer paper rolled clip decor */}
            <div className="bg-[#e8dcc4] px-6 py-2.5 flex justify-between items-center text-[10px] text-[#7a5e43] border-t border-[#d8ccb0] font-sans font-medium">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-600 fill-current" />
                小团的真实专属手迹
              </span>
              <span>由 3D 桌面 TuanAgent 正式投递</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
