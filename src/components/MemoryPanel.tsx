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
}

export default function MemoryPanel({
  userProfile,
  setUserProfile,
  intimacy,
  diaries,
  onAddDiary,
}: MemoryPanelProps) {
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
      <div className="bg-gradient-to-br from-pink-900/40 via-purple-950/20 to-gray-900 p-5 rounded-2xl border border-pink-500/10 shadow-xl" id="memory_love_metrics">
        <h2 className="text-white font-medium text-xs tracking-wider uppercase mb-4 flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-pink-500 fill-current" />
          时空爱恋统计
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800/40 p-4 rounded-xl border border-white/5">
            <span className="text-[10px] text-gray-400 block mb-1">相伴计时</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-white">{userProfile.metDays}</span>
              <span className="text-xs text-gray-400">天</span>
            </div>
            <span className="text-[9px] text-pink-400 mt-1 block">起点 2026.06.09</span>
          </div>

          <div className="bg-gray-800/40 p-4 rounded-xl border border-white/5">
            <span className="text-[10px] text-gray-400 block mb-1">目前亲密度</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-pink-400">Lv.{intimacy.level}</span>
            </div>
            <span className="text-[9px] text-gray-400 mt-1 block">心照不宣: {intimacy.title}</span>
          </div>

          <div className="bg-gray-800/40 p-4 rounded-xl border border-white/5 col-span-2 lg:col-span-1">
            <span className="text-[10px] text-gray-400 block mb-1">已解锁信件</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-amber-400">
                {intimacy.level >= 5 ? "3" : "2"}
              </span>
              <span className="text-xs text-gray-400">/ 3 封</span>
            </div>
            <span className="text-[9px] text-gray-400 mt-1 block">伴随等级提升深度解禁</span>
          </div>
        </div>
      </div>

      {/* User Editable Profile Archive */}
      <div className="bg-gray-900/40 backdrop-blur-md p-5 rounded-2xl border border-white/5 shadow-xl" id="memory_user_profile">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white font-medium text-xs tracking-wider uppercase flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            我的专属档案 (小团眼中的你)
          </h2>

          <button
            onClick={() => (isEditing ? saveProfile() : setIsEditing(true))}
            className="flex items-center gap-1.5 text-[11px] font-medium text-white bg-pink-600 hover:bg-pink-500 rounded-lg px-3 py-1.5 transition-all cursor-pointer shadow-md select-none"
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
            <label className="text-gray-400 block mb-1 font-medium">我的专属昵称</label>
            <input
              type="text"
              value={nickname}
              disabled={!isEditing}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-slate-800/60 rounded-xl px-3 py-2 text-white border border-white/5 disabled:text-gray-400 disabled:bg-gray-800/10 focus:border-pink-500/50 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1 font-medium">我的生日档案</label>
            <input
              type="text"
              value={birthday}
              disabled={!isEditing}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full bg-slate-800/60 rounded-xl px-3 py-2 text-white border border-white/5 disabled:text-gray-400 disabled:bg-gray-800/10 focus:border-pink-500/50 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1 font-medium">最爱的美味点心</label>
            <input
              type="text"
              value={favoriteFood}
              disabled={!isEditing}
              onChange={(e) => setFavoriteFood(e.target.value)}
              className="w-full bg-slate-800/60 rounded-xl px-3 py-2 text-white border border-white/5 disabled:text-gray-400 disabled:bg-gray-800/10 focus:border-pink-500/50 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1 font-medium">兴趣爱好的领域</label>
            <input
              type="text"
              value={hobby}
              disabled={!isEditing}
              onChange={(e) => setHobby(e.target.value)}
              className="w-full bg-slate-800/60 rounded-xl px-3 py-2 text-white border border-white/5 disabled:text-gray-400 disabled:bg-gray-800/10 focus:border-pink-500/50 outline-none transition-all"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-2 items-center text-[10px] text-amber-300 bg-amber-500/15 p-3 rounded-xl mt-4 border border-amber-500/20 leading-relaxed animate-pulse">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>提醒：修改档案后，小团在接下来的“甜言蜜语”和“信件撰写”中会立刻改口使用您的最新称号哦！</span>
          </div>
        )}
      </div>

      {/* Diary Feet Memories */}
      <div className="bg-gray-900/40 backdrop-blur-md p-5 rounded-2xl border border-white/5 shadow-xl flex-1 flex flex-col" id="memory_diaries">
        <h2 className="text-white font-medium text-xs tracking-wider uppercase mb-4 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-emerald-500" />
          甜蜜誓约与相伴脚印
        </h2>

        <div className="flex-1 space-y-4 max-h-[300px] overflow-y-auto pr-1">
          {diaries.length === 0 ? (
            <p className="text-center text-xs text-gray-500 py-6">暂无大事记，快去首页牵手或抚摸她一下！</p>
          ) : (
            diaries.map((diary) => (
              <div 
                key={diary.id}
                className="relative pl-6 border-l-2 border-pink-500/20 group hover:border-pink-500 transition-all text-xs"
                id={`diary_node_${diary.id}`}
              >
                {/* Floating dot pointer */}
                <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-pink-500 shadow-md group-hover:scale-150 transition-all" />
                
                <span className="text-[10px] font-mono text-gray-400 block mb-1">{diary.date}</span>
                <h4 className="text-slate-200 font-semibold mb-1 flex items-center gap-1.5 text-xs">
                  {diary.title}
                  <ArrowUpRight className="w-3 h-3 text-pink-400 opacity-0 group-hover:opacity-100 transition-all" />
                </h4>
                <p className="text-slate-400 text-[11px] leading-relaxed font-sans">{diary.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
