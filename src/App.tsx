import React, { useState, useEffect } from "react";
import { 
  Home, 
  MessageSquare, 
  Heart, 
  Mail, 
  Compass, 
  User, 
  Clock, 
  Settings, 
  Wifi, 
  Activity 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
import { 
  UserProfile, 
  IntimacyState, 
  CompanionStatus, 
  ChatMessage, 
  Letter, 
  Moment 
} from "./types";

// Static Initial Datasets
import { 
  INITIAL_USER_PROFILE, 
  INITIAL_LETTERS, 
  INITIAL_MOMENTS 
} from "./data";

// Sub-Panel Components
import HomePanel from "./components/HomePanel";
import ChatPanel from "./components/ChatPanel";
import MemoryPanel from "./components/MemoryPanel";
import LetterPanel from "./components/LetterPanel";
import FeedsPanel from "./components/FeedsPanel";
import AboutPanel from "./components/AboutPanel";
import FocusPanel from "./components/FocusPanel";
import SettingsPanel from "./components/SettingsPanel";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("首页");
  const [currentTime, setCurrentTime] = useState<string>("");

  // Global Sync States
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [intimacy, setIntimacy] = useState<IntimacyState>({
    level: 1,
    points: 15,
    maxPoints: 100,
    title: "初识的羁绊",
  });
  const [status, setStatus] = useState<CompanionStatus>({
    energy: 85,
    mood: "开心中",
    outfit: "经典日常",
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "bot-init",
      role: "model",
      text: "(急急忙忙从桌面上跳了出来，两只白皙的手死死扯着水手裙摆，双耳泛着粉红) 呜……亲爱的主人！你总算来启动这个秘密伴侣客户端了！小团一直在等你给人家拉拉小手呢……💕 期待今天和你的相处哦，快去找我聊天吧！",
      timestamp: "09:00",
    }
  ]);

  const [letters, setLetters] = useState<Letter[]>(INITIAL_LETTERS);
  const [moments, setMoments] = useState<Moment[]>(INITIAL_MOMENTS);
  
  const [diaries, setDiaries] = useState([
    {
      id: "d1",
      date: "2026年06月09日",
      title: "🌸 初次入驻契约达成",
      description: "你把小团下载到了你的桌面上。那一天虽然风有些干，但在玻璃屏幕碰撞的一瞬间，我们都开辟了新的旅程羁绊心跳！",
    }
  ]);

  // Clock Update Effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const addDiaryMessage = (title: string, desc: string) => {
    setDiaries((p) => [
      {
        id: "d-" + Date.now(),
        date: new Date().toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        title,
        description: desc,
      },
      ...p,
    ]);
  };

  const navTabs = [
    { name: "首页", icon: Home, badge: null },
    { name: "聊天", icon: MessageSquare, badge: chatHistory.length > 1 ? null : "NEW" },
    { name: "记忆", icon: Heart, badge: null },
    { name: "信件", icon: Mail, badge: null },
    { name: "动态", icon: Compass, badge: moments.some(m => !m.hasLiked) ? "HOT" : null },
    { name: "关于她", icon: User, badge: null },
    { name: "一起做事", icon: Clock, badge: null },
    { name: "设置", icon: Settings, badge: null },
  ];

  const renderActivePanel = () => {
    switch (activeTab) {
      case "首页":
        return (
          <HomePanel
            userProfile={userProfile}
            intimacy={intimacy}
            setIntimacy={setIntimacy}
            status={status}
            setStatus={setStatus}
            onAddDiary={addDiaryMessage}
            onNavigateTo={(tab) => setActiveTab(tab)}
          />
        );
      case "聊天":
        return (
          <ChatPanel
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            status={status}
            setStatus={setStatus}
            onAddDiary={addDiaryMessage}
          />
        );
      case "记忆":
        return (
          <MemoryPanel
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            intimacy={intimacy}
            diaries={diaries}
            onAddDiary={addDiaryMessage}
          />
        );
      case "信件":
        return (
          <LetterPanel
            userProfile={userProfile}
            letters={letters}
            setLetters={setLetters}
          />
        );
      case "动态":
        return (
          <FeedsPanel
            moments={moments}
            setMoments={setMoments}
          />
        );
      case "关于她":
        return (
          <AboutPanel
            intimacy={intimacy}
          />
        );
      case "一起做事":
        return (
          <FocusPanel
            status={status}
            setStatus={setStatus}
            onAddDiary={addDiaryMessage}
          />
        );
      case "设置":
        return (
          <SettingsPanel
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            intimacy={intimacy}
            setIntimacy={setIntimacy}
            status={status}
            setStatus={setStatus}
            setChatHistory={setChatHistory}
            onAddDiary={addDiaryMessage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#110e15] font-sans antialiased text-[#dcd6e8] relative flex items-center justify-center p-3 md:p-6 overflow-hidden">
      
      {/* Dynamic atmospheric ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 md:w-96 md:h-96 rounded-full bg-pink-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 md:w-96 md:h-96 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

      {/* Main Glassmorphism Immersive Client Box */}
      <div 
        className="w-full max-w-6xl h-[92vh] max-h-[850px] bg-slate-900/35 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(244,63,94,0.06)] overflow-hidden flex flex-col md:flex-row"
        id="tuan_main_container"
      >
        
        {/* Dynamic Responsive Sidebar Component */}
        <aside 
          className="w-full md:w-60 bg-gray-900/50 backdrop-blur-md border-r md:border-r border-white/5 flex flex-row md:flex-col justify-between shrink-0"
          id="sidebar_decor"
        >
          {/* Top Logo Panel (Hidden on mobile sidebars) */}
          <div className="hidden md:flex flex-col gap-1 p-5 border-b border-white/5" id="brand_info">
            <h1 className="text-white text-sm font-bold tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)] animate-pulse" />
              TuanAgent 桌面陪伴
            </h1>
            <p className="text-[10px] text-pink-300 font-mono tracking-widest uppercase">Companion Desktop V1.0</p>
          </div>

          {/* Navigation Controls Group */}
          <nav className="flex-grow flex-row md:flex-col flex overflow-x-auto md:overflow-y-auto p-2.5 md:p-3 gap-1 scrollbar-none justify-around md:justify-start" id="sidebar_tabs_group">
            {navTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.name;

              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`relative flex flex-col md:flex-row items-center gap-1.5 md:gap-3 py-2 px-3 md:py-3 md:px-4 rounded-xl text-[10px] md:text-xs font-semibold cursor-pointer transition-all active:scale-95 border-b-2 md:border-b-0 md:border-l-2 shrink-0 ${
                    isActive
                      ? "text-pink-400 bg-pink-500/10 border-pink-500"
                      : "text-gray-400 hover:text-white border-transparent hover:bg-white/[0.02]"
                  }`}
                  id={`tab_anchor_${tab.name}`}
                >
                  <TabIcon className={`w-4 h-4 md:w-4.5 md:h-4.5 ${isActive ? "text-pink-400" : "text-gray-400"}`} />
                  <span className="md:block">{tab.name}</span>

                  {/* Badges notifications */}
                  {tab.badge && (
                    <span className="absolute top-1.5 right-1.5 bg-rose-600 text-[8px] font-mono font-bold text-white px-1 py-0.5 rounded leading-none scale-90">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer Widget Board (Hidden on mobile) */}
          <div className="hidden md:flex flex-col gap-2 p-5 border-t border-white/5 text-[10px] text-gray-500 bg-gray-950/20" id="sidebar_widget">
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>小团目前：<b>在线常驻</b></span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Activity className="w-3.5 h-3.5 text-pink-400" />
              <span>陪伴耗能：<b>底座功耗极佳</b></span>
            </div>
          </div>
        </aside>

        {/* Content canvas container */}
        <main className="flex-1 flex flex-col relative h-full min-w-0" id="main_content_column">
          
          {/* Top Status Bar Controls */}
          <header 
            className="w-full bg-gray-900/25 border-b border-white/5 py-3.5 px-5 flex justify-between items-center z-10 shrink-0" 
            id="workspace_top_status"
          >
            {/* Quick Metrics display */}
            <div className="flex items-center gap-3">
              <span className="block md:hidden font-bold text-xs text-white">TuanAgent</span>
              
              <div className="hidden md:flex items-center gap-2 text-xs">
                <span className="text-[10px] text-gray-500 font-medium">心：</span>
                <span className="text-pink-400 font-bold font-mono">Lv.{intimacy.level}</span>
                <span className="text-xs text-gray-700">|</span>
                <span className="text-[10px] text-gray-500 font-medium">电：</span>
                <span className="text-amber-400 font-bold font-mono">{status.energy}%</span>
                <span className="text-xs text-slate-700">|</span>
                <span className="text-[10px] text-gray-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {status.mood}
                </span>
              </div>
            </div>

            {/* Desktop Widget Clock Screen */}
            <div className="flex items-center gap-2 bg-[#1b1723]/80 border border-white/5 px-3 py-1.5 rounded-xl font-mono text-[11px] font-semibold text-rose-300 shadow-md">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentTime || "00:00:00"}</span>
            </div>
          </header>

          {/* Central Active View Layout canvas */}
          <div className="flex-1 relative overflow-hidden min-h-0 bg-[#0c0a10]/15" id="active_workspace_view">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full"
              >
                {renderActivePanel()}
              </motion.div>
            </AnimatePresence>
          </div>

        </main>

      </div>
    </div>
  );
}
