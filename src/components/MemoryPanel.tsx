import React, { useState } from "react";
import { Calendar, Heart, Award, ArrowUpRight, Save, ShieldAlert } from "lucide-react";
import { UserProfile, IntimacyState } from "../types";

interface DiaryRecord {
  id: string;
  date: string;
  title: string;
  description: string;
}

interface MemoryPanelProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  intimacy: IntimacyState;
  diaries: DiaryRecord[];
  onAddDiary: (title: string, desc: string) => void;
  theme?: "dark" | "light";
}

export default function MemoryPanel({
  userProfile,
  setUserProfile,
  intimacy,
  diaries,
  onAddDiary,
  theme = "dark",
}: MemoryPanelProps) {
  const isDark = theme === "dark";
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(userProfile.nickname);
  const [birthday, setBirthday] = useState(userProfile.birthday);
  const [favoriteFood, setFavoriteFood] = useState(userProfile.favoriteFood);
  const [hobby, setHobby] = useState(userProfile.hobby);

  const saveProfile = () => {
    setUserProfile({
      ...userProfile,
      nickname,
      birthday,
      favoriteFood,
      hobby,
    });
    setIsEditing(false);
    onAddDiary(
      "📝 档案项更新",
      `你亲切地告诉了小团新的秘密：昵称改为了 ${nickname}。小团已经悄悄在脑海里背了一百遍哦！`
    );
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 overflow-y-auto p-4 lg:p-6" id="memory_panel_scroll">
      
      {/* Love Dashboard Card */}
      <div className={`p-5 rounded-2xl border shadow-xl transition-all duration-500 ${
        isDark 
          ? "bg-gradient-to-br from-pink-900/40 via-purple-950/20 to-gray-900 border-pink-500/15" 
          : "bg-gradient-to-br from-pink-100/50 via-pink-50/20 to-white border-pink-200/50"
      }`} id="memory_love_metrics">
        <h2 className={`font-semibold text-xs tracking-wider uppercase mb-4 flex items-center gap-1.5 ${
          isDark ? "text-white" : "text-slate-800"
        }`}>
          <Heart className="w-4 h-4 text-pink-500 fill-current" />
          时空相伴约定统计
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border ${
            isDark ? "bg-gray-800/40 border-white/5" : "bg-white/80 border-pink-100"
          }`}>
            <span className={`text-[10px] block mb-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>相伴计时</span>
            <div className="flex items-baseline gap-1 animate-pulse">
              <span className={`text-2xl font-bold font-mono ${isDark ? "text-white" : "text-slate-800"}`}>{userProfile.metDays}</span>
              <span className={`text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}>天</span>
            </div>
            <span className="text-[9px] text-pink-500 font-bold mt-1 block">起点 2026.06.09</span>
          </div>

          <div className={`p-4 rounded-xl border ${
            isDark ? "bg-gray-800/40 border-white/5" : "bg-white/80 border-pink-100"
          }`}>
            <span className={`text-[10px] block mb-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>目前亲密度</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-pink-500">Lv.{intimacy.level}</span>
            </div>
            <span className={`text-[9px] mt-1 block ${isDark ? "text-gray-400" : "text-slate-505 font-medium"}`}>{intimacy.title}</span>
          </div>

          <div className={`p-4 rounded-xl border col-span-2 lg:col-span-1 ${
            isDark ? "bg-gray-800/40 border-white/5" : "bg-white/80 border-pink-100"
          }`}>
            <span className={`text-[10px] block mb-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>已解锁信件</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-bold font-mono ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                {intimacy.level >= 5 ? "3" : "2"}
              </span>
              <span className={`text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}>/ 3 封</span>
            </div>
            <span className={`text-[9px] mt-1 block ${isDark ? "text-gray-450" : "text-slate-450"}`}>伴随等级提升深度解禁</span>
          </div>
        </div>
      </div>

      {/* User Editable Profile Archive */}
      <div className={`p-5 rounded-2xl border shadow-xl transition-all duration-500 ${
        isDark 
          ? "bg-gray-900/40 border-white/5" 
          : "bg-white border-pink-100/60 shadow-md"
      }`} id="memory_user_profile">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5 ${
            isDark ? "text-white" : "text-slate-805"
          }`}>
            <Award className="w-4 h-4 text-amber-500 animate-[spin_3s_linear_infinite]" />
            我的专属档案 (小团眼中的你)
          </h2>

          <button
            onClick={() => (isEditing ? saveProfile() : setIsEditing(true))}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-white bg-pink-650 hover:bg-pink-600 rounded-lg px-3 py-1.5 transition-all cursor-pointer shadow-md select-none"
            id="edit_profile_btn"
          >
            {isEditing ? (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>保存档案</span>
              </>
            ) : (
              <span>修改档案</span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className={`block mb-1 font-semibold ${isDark ? "text-gray-400" : "text-slate-600"}`}>我的专属昵称</label>
            <input
              type="text"
              value={nickname}
              disabled={!isEditing}
              onChange={(e) => setNickname(e.target.value)}
              className={`w-full rounded-xl px-3 py-2 border outline-none transition-all ${
                isDark 
                  ? "bg-slate-800/60 border-white/10 text-white disabled:text-gray-500 disabled:bg-gray-800/10 focus:border-pink-500/50" 
                  : "bg-pink-50/15 border-pink-200 text-slate-805 disabled:text-gray-400 disabled:bg-slate-100 focus:border-pink-400"
              }`}
            />
          </div>

          <div>
            <label className={`block mb-1 font-semibold ${isDark ? "text-gray-400" : "text-slate-600"}`}>我的生日档案</label>
            <input
              type="text"
              value={birthday}
              disabled={!isEditing}
              onChange={(e) => setBirthday(e.target.value)}
              className={`w-full rounded-xl px-3 py-2 border outline-none transition-all ${
                isDark 
                  ? "bg-slate-800/60 border-white/10 text-white disabled:text-gray-500 disabled:bg-gray-800/10 focus:border-pink-500/50" 
                  : "bg-pink-50/15 border-pink-200 text-slate-805 disabled:text-gray-400 disabled:bg-slate-100 focus:border-pink-400"
              }`}
            />
          </div>

          <div>
            <label className={`block mb-1 font-semibold ${isDark ? "text-gray-400" : "text-slate-600"}`}>最爱的美味点心</label>
            <input
              type="text"
              value={favoriteFood}
              disabled={!isEditing}
              onChange={(e) => setFavoriteFood(e.target.value)}
              className={`w-full rounded-xl px-3 py-2 border outline-none transition-all ${
                isDark 
                  ? "bg-slate-800/60 border-white/10 text-white disabled:text-gray-500 disabled:bg-gray-800/10 focus:border-pink-500/50" 
                  : "bg-pink-50/15 border-pink-200 text-slate-805 disabled:text-gray-400 disabled:bg-slate-100 focus:border-pink-400"
              }`}
            />
          </div>

          <div>
            <label className={`block mb-1 font-semibold ${isDark ? "text-gray-400" : "text-slate-600"}`}>兴趣爱好的领域</label>
            <input
              type="text"
              value={hobby}
              disabled={!isEditing}
              onChange={(e) => setHobby(e.target.value)}
              className={`w-full rounded-xl px-3 py-2 border outline-none transition-all ${
                isDark 
                  ? "bg-slate-800/60 border-white/10 text-white disabled:text-gray-500 disabled:bg-gray-800/10 focus:border-pink-500/50" 
                  : "bg-pink-50/15 border-pink-200 text-slate-805 disabled:text-gray-400 disabled:bg-slate-100 focus:border-pink-400"
              }`}
            />
          </div>
        </div>

        {isEditing && (
          <div className={`flex gap-2 items-center text-[10px] p-3 rounded-xl mt-4 border leading-relaxed animate-pulse ${
            isDark 
              ? "text-amber-305 bg-amber-500/15 border-amber-500/20" 
              : "text-amber-800 bg-amber-50 border-amber-200"
          }`}>
            <ShieldAlert className="w-5 h-5 shrink-0 text-amber-500" />
            <span>提醒：修改档案后，小团在接下来的“甜言蜜语互动”和“写信”中会立刻改口使用您的最新个人喜好信息与字眼称号哦！</span>
          </div>
        )}
      </div>

      {/* Diary Feet Memories */}
      <div className={`p-5 rounded-2xl border shadow-xl flex-1 flex flex-col transition-all duration-500 ${
        isDark 
          ? "bg-gray-900/40 border-white/5" 
          : "bg-white border-pink-100/60 shadow-md"
      }`} id="memory_diaries">
        <h2 className={`font-semibold text-xs tracking-wider uppercase mb-4 flex items-center gap-1.5 ${
          isDark ? "text-white" : "text-slate-800"
        }`}>
          <Calendar className="w-4 h-4 text-emerald-500 animate-[bounce_2s_infinite]" />
          甜蜜誓约与相伴脚印柜
        </h2>

        <div className="flex-1 space-y-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
          {diaries.length === 0 ? (
            <p className="text-center text-xs text-gray-500 py-6">暂无大事记，快去首页牵手或抚摸她一下！</p>
          ) : (
            diaries.map((diary) => (
              <div 
                key={diary.id}
                className={`relative pl-6 border-l-2 group hover:border-pink-500 transition-all text-xs ${
                  isDark ? "border-pink-500/20" : "border-pink-100"
                }`}
                id={`diary_node_${diary.id}`}
              >
                {/* Floating dot pointer */}
                <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-pink-500 shadow-md group-hover:scale-150 transition-all" />
                
                <span className={`text-[10px] font-mono block mb-1 ${isDark ? "text-gray-500" : "text-slate-400"}`}>{diary.date}</span>
                <h4 className={`font-semibold mb-1 flex items-center gap-1.5 text-xs ${
                  isDark ? "text-slate-200" : "text-slate-800"
                }`}>
                  {diary.title}
                  <ArrowUpRight className="w-3 h-3 text-pink-500 opacity-0 group-hover:opacity-100 transition-all" />
                </h4>
                <p className={`text-[11px] leading-relaxed font-sans ${isDark ? "text-gray-400" : "text-slate-600"}`}>{diary.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
