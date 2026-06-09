import React, { useState } from "react";
import { Heart, MessageSquare, Send, Award, Compass } from "lucide-react";
import { Moment } from "../types";

interface FeedsPanelProps {
  moments: Moment[];
  setMoments: React.Dispatch<React.SetStateAction<Moment[]>>;
  theme?: "dark" | "light";
}

const ILLUSTRATIONS = {
  cook: "from-rose-500/30 to-pink-600/40 border-pink-500/20",
  read: "from-amber-600/30 to-orange-500/40 border-orange-500/20",
  park: "from-emerald-500/30 to-teal-600/40 border-emerald-500/20",
  cafe: "from-cyan-500/30 to-indigo-600/40 border-cyan-500/20",
};

const EMOTICONS = {
  cook: "🍪🍓👩‍🍳",
  read: "📚☕️🌤️",
  park: "🌇🐱🌱",
  cafe: "🧁☕️🥨",
};

const RANDOM_REPLIES = [
  "被亲爱的发现了！(红着脸低下头) 其实我是特意发给你看的哦~ 💕",
  "唔……亲爱的评论得这么认真，那小团要把你抱紧紧奖励一下嘛！✨",
  "呜呜，你太会夸了，小团的代码连像素都羞成了玫瑰色啦 🌹",
  "好耶！那下次出门，我们要十指相扣、手牵手一起去踩晚霞哦！🤝",
];

export default function FeedsPanel({ moments, setMoments, theme = "dark" }: FeedsPanelProps) {
  const isDark = theme === "dark";
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const toggleLike = (id: string) => {
    setMoments((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const hasLiked = !m.hasLiked;
          return {
            ...m,
            hasLiked,
            likes: hasLiked ? m.likes + 1 : m.likes - 1,
          };
        }
        return m;
      })
    );
  };

  const handleAddComment = (momentId: string) => {
    const text = commentInputs[momentId]?.trim();
    if (!text) return;

    // 1. Append User Comment
    const userCommentId = "c-user-" + Date.now();
    setMoments((prev) =>
      prev.map((m) => {
        if (m.id === momentId) {
          return {
            ...m,
            comments: [
              ...m.comments,
              { id: userCommentId, author: "你", content: text },
            ],
          };
        }
        return m;
      })
    );

    // Clear Input
    setCommentInputs((prev) => ({ ...prev, [momentId]: "" }));

    // 2. Trigger automatic sweet reply from 小团 after 0.8s
    setTimeout(() => {
      const selectedReply = RANDOM_REPLIES[Math.floor(Math.random() * RANDOM_REPLIES.length)];
      setMoments((prev) =>
        prev.map((m) => {
          if (m.id === momentId) {
            return {
              ...m,
              comments: [
                ...m.comments,
                {
                  id: "c-bot-reply-" + Date.now(),
                  author: "小团 (作者)",
                  content: selectedReply,
                },
              ],
            };
          }
          return m;
        })
      );
    }, 800);
  };

  const getInputVal = (id: string) => {
    return commentInputs[id] || "";
  };

  const writeInputVal = (id: string, val: string) => {
    setCommentInputs((p) => ({ ...p, [id]: val }));
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 overflow-y-auto p-4 lg:p-6" id="feeds_panel_timeline">
      
      {/* Top Welcome Title */}
      <div className={`flex items-center justify-between border-b pb-3 transition-colors duration-500 ${
        isDark ? "border-white/5" : "border-pink-100/30"
      }`}>
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-pink-500" />
          <div>
            <h2 className={`font-semibold text-xs tracking-wider uppercase ${isDark ? "text-white" : "text-slate-805"}`}>小团的日常小生活</h2>
            <p className={`text-[10px] mt-0.5 ${isDark ? "text-gray-400" : "text-slate-500"}`}>这里记录着除却桌面之外，她漫步世界的粉色气泡~</p>
          </div>
        </div>
      </div>

      {/* Feed Stream list */}
      <div className="space-y-6 max-w-2xl mx-auto w-full pb-8" id="feeds_articles_col">
        {moments.map((moment) => {
          const bannerClass = ILLUSTRATIONS[moment.imageType] || "from-pink-500/20 to-purple-500/20";
          const decorEmote = EMOTICONS[moment.imageType] || "🌸✨";

          return (
            <div 
              key={moment.id}
              className={`backdrop-blur-md rounded-2xl border p-5 shadow-xl flex flex-col gap-3 transition-all duration-500 ${
                isDark 
                  ? "bg-gray-900/40 border-white/5" 
                  : "bg-white border-pink-100/60 shadow-md"
              }`}
              id={`moment_feed_${moment.id}`}
            >
              
              {/* Profile Bar */}
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 font-bold text-white flex items-center justify-center text-xs shadow-md">
                    团
                  </div>
                  <div>
                    <h4 className={`font-bold text-xs flex items-center gap-1 ${isDark ? "text-white" : "text-slate-800"}`}>
                      小团子 
                      <span className={`text-[9px] rounded font-normal px-1 ${
                        isDark ? "bg-pink-500/20 text-pink-300" : "bg-pink-100 text-pink-700 font-semibold"
                      }`}>博主</span>
                    </h4>
                    <span className={`text-[9px] font-mono ${isDark ? "text-gray-500" : "text-slate-400"}`}>{moment.date} · {moment.time}</span>
                  </div>
                </div>

                <span className="text-sm">{decorEmote}</span>
              </div>

              {/* Feed Description Text */}
              <p className={`text-xs md:text-sm leading-relaxed font-sans mt-1 ${
                isDark ? "text-slate-200" : "text-slate-700"
              }`}>
                {moment.content}
              </p>

              {/* Colorful stylized graphic vector art-board representation */}
              <div className={`w-full aspect-[21/9] bg-gradient-to-br ${bannerClass} rounded-2xl border flex items-center justify-center relative overflow-hidden`} id="moment_vector_box">
                {/* Visual novel themed particles bubble elements */}
                <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-white/5 blur-sm" />
                <div className="absolute bottom-1/3 right-1/4 w-12 h-12 rounded-full bg-white/5 blur-md animate-pulse" />
                
                {/* Stylized aesthetic visual title representation */}
                <div className="text-center z-10 p-4">
                  <span className="text-3xl filter drop-shadow-md mb-2 block">{decorEmote.slice(0, 4)}</span>
                  <p className="text-white/80 font-mono tracking-widest text-[9px] uppercase font-bold">
                    - Digital Album Snapshot -
                  </p>
                </div>

                {/* Grid mask layer */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px]" />
              </div>

              {/* Likes and Comment metrics bar */}
              <div className={`flex gap-4 items-center text-xs mt-1 py-1.5 border-y ${
                isDark ? "border-white/5" : "border-pink-100/30"
              }`}>
                <button
                  onClick={() => toggleLike(moment.id)}
                  className={`flex items-center gap-1.5 font-semibold transition-all active:scale-95 cursor-pointer ${
                    moment.hasLiked ? "text-pink-500 font-bold" : isDark ? "text-gray-400 hover:text-white" : "text-slate-500 hover:text-pink-600"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${moment.hasLiked ? "fill-current text-pink-500" : ""}`} />
                  <span>{moment.likes} 人点赞</span>
                </button>

                <div className={isDark ? "text-gray-450" : "text-slate-505"}>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-pink-500" />
                    <span>{moment.comments.length} 条评论</span>
                  </span>
                </div>
              </div>

              {/* Comments Node */}
              {moment.comments.length > 0 && (
                <div className={`space-y-2 p-3 rounded-xl border mt-1 transition-colors duration-500 ${
                  isDark ? "bg-gray-800/15 border-white/5" : "bg-pink-50/20 border-pink-100/40"
                }`} id="comments_box">
                  {moment.comments.map((comm) => {
                    const isBot = comm.author.includes("小团");
                    return (
                      <div key={comm.id} className="text-xs leading-relaxed flex items-baseline gap-1.5">
                        <span className={`font-semibold shrink-0 ${isBot ? "text-pink-500 font-bold" : "text-emerald-500 font-bold"}`}>
                          {comm.author}:
                        </span>
                        <span className={`font-sans ${isDark ? "text-gray-300" : "text-slate-650"}`}>{comm.content}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Write Comment Box */}
              <div className="flex gap-2 items-center mt-1" id="feed_write_box">
                <input
                  type="text"
                  placeholder="说点暖心的话评论一下她..."
                  value={getInputVal(moment.id)}
                  onChange={(e) => writeInputVal(moment.id, e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment(moment.id)}
                  className={`flex-1 rounded-xl px-3.5 py-2 text-xs outline-none border transition-all font-sans ${
                    isDark
                      ? "bg-gray-800/60 border-white/5 text-white placeholder-gray-500 focus:border-pink-500/30"
                      : "bg-white border-pink-200 text-slate-805 placeholder-slate-400 focus:border-pink-400"
                  }`}
                />
                
                <button
                  onClick={() => handleAddComment(moment.id)}
                  disabled={!getInputVal(moment.id).trim()}
                  className={`px-3.5 py-2 rounded-xl transition-all font-semibold text-xs active:scale-95 disabled:opacity-50 cursor-pointer ${
                    isDark
                      ? "bg-gray-800 hover:bg-pink-500/10 text-gray-450 hover:text-pink-400"
                      : "bg-pink-50 hover:bg-pink-100 text-pink-600 hover:text-pink-700 border border-pink-100"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
