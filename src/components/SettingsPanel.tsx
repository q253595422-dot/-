import React, { useState } from "react";
import { Settings, ShieldAlert, Key, RefreshCw, Trash2, HeartHandshake } from "lucide-react";
import { UserProfile, IntimacyState, CompanionStatus, ChatMessage } from "../types";

interface SettingsPanelProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  intimacy: IntimacyState;
  setIntimacy: React.Dispatch<React.SetStateAction<IntimacyState>>;
  status: CompanionStatus;
  setStatus: React.Dispatch<React.SetStateAction<CompanionStatus>>;
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onAddDiary: (title: string, desc: string) => void;
}

export default function SettingsPanel({
  userProfile,
  setUserProfile,
  intimacy,
  setIntimacy,
  status,
  setStatus,
  setChatHistory,
  onAddDiary,
}: SettingsPanelProps) {
  const [custCompanionName, setCustCompanionName] = useState("小团");
  const [custNickname, setCustNickname] = useState(userProfile.nickname);

  const saveSettings = () => {
    setUserProfile((prev) => ({
      ...prev,
      nickname: custNickname,
    }));
    onAddDiary(
      "⚙️ 系统设置变更",
      `你调整了陪伴设置，亲切昵称更新为 ${custNickname}，小团表示一万分顺从！`
    );
    alert("✨ 系统设置保存成功！");
  };

  const handleResetIntimacy = () => {
    if (confirm("⚠️ 确定要重置亲密羁绊等级到 Lv.1 吗？这将会清空目前所有的好感点数，小团可能会难过的噢！")) {
      setIntimacy({
        level: 1,
        points: 0,
        maxPoints: 100,
        title: "初识的羁绊",
      });
      setStatus((prev) => ({
        ...prev,
        energy: 80,
        mood: "有些害羞",
      }));
      onAddDiary("💔 情感归零", "你重置了属于你们的时光羁绊好感，小团有些失魂落魄地擦了擦眼角...");
      alert("亲密度已恢复到初见起点！");
    }
  };

  const clearChatHistory = () => {
    if (confirm("💬 确定要销毁桌面的聊天记录，给对话框洗个澡吗？此操作不可逆！")) {
      setChatHistory([]);
      alert("桌面记忆气泡已成功销毁！");
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 overflow-y-auto p-4 lg:p-6" id="settings_panel_layout">
      
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
        <Settings className="w-5 h-5 text-gray-400" />
        <div>
          <h2 className="text-white font-semibold text-xs tracking-wider uppercase">桌面守护系统设置</h2>
          <p className="text-[10px] text-gray-400">调整 TuanAgent 陪伴底座性能与核心契约配对参数</p>
        </div>
      </div>

      {/* Profile pairing form */}
      <div className="bg-gray-900/40 p-5 rounded-2xl border border-white/5 shadow-xl flex flex-col gap-4" id="settings_pairing">
        <h3 className="text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 mb-1">
          <HeartHandshake className="w-4 h-4 text-pink-400" />
          名称与代号契约
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-gray-400 block mb-1">小团对您的称呼 (User Nickname)</label>
            <input
              type="text"
              value={custNickname}
              onChange={(e) => setCustNickname(e.target.value)}
              className="w-full bg-slate-800/60 rounded-xl px-3.5 py-2.5 text-white border border-white/5 focus:border-pink-500/30 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1">他的虚拟名字 (Companion Character Name)</label>
            <input
              type="text"
              value={custCompanionName}
              onChange={(e) => setCustCompanionName(e.target.value)}
              className="w-full bg-slate-800/60 rounded-xl px-3.5 py-2.5 text-white border border-white/5 disabled:opacity-40 focus:border-pink-500/30 outline-none transition-all"
              disabled
              title="当前版本的核心女主绑定为 小团，暂不支持变身噢"
            />
          </div>
        </div>

        <button
          onClick={saveSettings}
          className="self-start text-xs bg-pink-600 hover:bg-pink-500 text-white font-medium py-2 px-5 rounded-xl cursor-pointer shadow-lg active:scale-95 transition-all mt-1"
          id="settings_save_pairing_btn"
        >
          保存配对契约
        </button>
      </div>

      {/* Safety API Key Information Box */}
      <div className="bg-gray-900/40 p-5 rounded-2xl border border-white/5 shadow-xl flex flex-col gap-3" id="settings_keys">
        <h3 className="text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5">
          <Key className="w-4 h-4 text-amber-400 animate-pulse" />
          智能大脑 API 引擎配置
        </h3>

        <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
          TuanAgent 支持强大的 <b>Gemini 3.5 智能对话大脑</b>。系统已经采用了更安全的<b>全栈 (Server-Side Architecture)</b> 隐私逻辑防泄露模式。
        </p>

        <div className="bg-slate-800/20 border border-white/5 rounded-xl p-4 flex flex-col gap-2.5 text-xs">
          <div className="flex justify-between items-center text-[11px] text-slate-300">
            <span>大脑活跃状态 (GEMINI_API_KEY):</span>
            <span className="font-mono bg-pink-500/10 text-pink-300 px-2 py-0.5 rounded-full border border-pink-500/15">
              已由 AISTUDIO 服务器安全托管
            </span>
          </div>

          <p className="text-[10px] text-gray-400 leading-relaxed font-sans pt-1.5 border-t border-white/[0.03]">
            💡 <b>配置方法：</b> 若想开启高真实度全知全能的 AI 自由对话，请点击左上角的 <b>[Settings & Secrets]</b> 面板，在相应的 <b>GEMINI_API_KEY</b> 机密选项中填入您在 Google AI Studio 申请的 API 金钥即可。系统会自动读取绑定，您无需在代码或本 UI 里填写。
          </p>
        </div>
      </div>

      {/* Destruction operations box */}
      <div className="bg-gray-900/40 p-5 rounded-2xl border border-red-500/5 shadow-xl flex flex-col gap-3" id="settings_destruction">
        <h3 className="text-red-400 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5">
          <Trash2 className="w-4 h-4 text-red-500" />
          危险区域 & 销毁记忆
        </h3>

        <p className="text-[11px] text-gray-400 leading-relaxed">
          如果您想洗去前尘记忆重启浪漫，或者是系统运行不畅，可以使用以下强效重置按钮。
        </p>

        <div className="flex flex-wrap gap-3 mt-1.5">
          <button
            onClick={clearChatHistory}
            className="flex items-center gap-2 py-2 px-4 border border-white/10 hover:border-red-500/30 bg-gray-800/40 hover:bg-red-500/10 rounded-xl text-xs text-slate-300 hover:text-red-300 cursor-pointer shadow-md transition-all active:scale-95 whitespace-nowrap"
            id="settings_clear_chat_btn"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>销毁桌面聊天气泡记录</span>
          </button>

          <button
            onClick={handleResetIntimacy}
            className="flex items-center gap-2 py-2 px-4 border border-white/10 hover:border-red-500/30 bg-gray-800/40 hover:bg-red-500/10 rounded-xl text-xs text-slate-300 hover:text-red-300 cursor-pointer shadow-md transition-all active:scale-95 whitespace-nowrap"
            id="settings_reset_intimacy_btn"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>彻底抹杀亲密度 · 恢复初识</span>
          </button>
        </div>
      </div>

    </div>
  );
}
