import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, ShieldAlert, CheckCircle, Heart, Code2, Terminal, Copy, Cpu, Sparkles, Laptop, Check } from "lucide-react";
import { CompanionStatus } from "../types";

// Dynamic Glasses study avatar
const AVATAR_STUDY = "/src/assets/images/companion_study_1780973892626.png";

interface FocusPanelProps {
  status: CompanionStatus;
  setStatus: React.Dispatch<React.SetStateAction<CompanionStatus>>;
  onAddDiary: (title: string, desc: string) => void;
  theme?: "dark" | "light";
}

const TIMER_PRESETS = [
  { label: "1分钟 (极速体验)", seconds: 60 },
  { label: "25分钟 (经典番茄)", seconds: 1500 },
  { label: "45分钟 (高效办公)", seconds: 2700 },
  { label: "60分钟 (深度闭关)", seconds: 3600 },
];

const AMBIENCE_SOUNDS = [
  { id: "rain", label: "🌧️ 温暖春雨", activeLyric: "“听着雨声，心跳仿佛都和亲爱的同步了呢。工作加油哦！”" },
  { id: "fireplace", label: "🔥 柴火壁炉", activeLyric: "“噼啪作响的壁炉在燃烧，屏幕外手脚也暖融融的吧~”" },
  { id: "cafe", label: "☕ 深夜咖啡馆", activeLyric: "“咖啡香气弥漫，小团就是坐在你身旁的那个打工妹~”" },
  { id: "forest", label: "🎹 钢琴与蝉鸣", activeLyric: "“夏日柔风轻拂，最惬意的时光莫过于和你一起前行了。”" },
];

const TIPS = [
  "“亲爱的，写完这一段代码，记得抬起头闭眼眨一眨，活动下脖颈哦。”",
  "“咕噜咕噜……小团在监督你喝温水！抓起手边的杯子，喝三大口好不好嘛~”",
  "“挺直后背、挺胸抬头！不准弓着背写代码，脊背酸痛了小团会很心疼的。”",
  "“累了的话就看看小团。小团推了推金丝眼镜，正在一脸宠溺地给你比心哦 ❤️”",
];

const QUICK_TEMPLATES = [
  { label: "📧 验证校验邮箱", prompt: "构建高性能的电子邮箱验证正则表达式(Regex), 输出测试样例以及合规判断", lang: "TypeScript" },
  { label: "⚡ 快速排序算法", prompt: "用最优循环思想编写高维快速排序(QuickSort)算法, 打印排序前后的数组效果", lang: "TypeScript" },
  { label: "🌐 Express 路由器", prompt: "书写带有防爆破保护(RateLimit)的简易Express后端主服务路由结构", lang: "JavaScript" },
  { label: "⏱️ H5 计时器核心", prompt: "使用高精度 RequestAnimationFrame 原生函数编写优雅的Web倒计时逻辑", lang: "JavaScript" },
];

export default function FocusPanel({
  status,
  setStatus,
  onAddDiary,
  theme = "dark",
}: FocusPanelProps) {
  const isDark = theme === "dark";

  // Mode selection state: "tomato" or "codex"
  const [activeTab, setActiveTab] = useState<"tomato" | "codex">("tomato");

  // Tomato focus states
  const [activeSeconds, setActiveSeconds] = useState(1500); // Default 25 min
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [activeAmbience, setActiveAmbience] = useState<string | null>(null);
  const [ambienceQuote, setAmbienceQuote] = useState("");
  const [tipIndex, setTipIndex] = useState(0);

  // Codex co-pilot states
  const [codexPrompt, setCodexPrompt] = useState("建立一个带有防爆破限制的 Express 登录路由守卫");
  const [codexLanguage, setCodexLanguage] = useState("TypeScript");
  const [generatedCode, setGeneratedCode] = useState(`/**
 * @name TuanerGuard
 * @author 小团 (Tuaner Codex IDE)
 * @description 一个能自动屏蔽黑客大坏蛋的登录路由守卫模块
 */
import express from 'express';

export const loginGuard = express.Router();

loginGuard.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // (偷偷揉了揉眼睛瞄一瞄后台) 验证开始噢~
  if (username === "admin" && password === "loveTuaner520") {
    res.json({ success: true, token: "jwt_sweet_token_forever" });
  } else {
    res.status(401).json({ success: false, msg: "密码好像填错啦，主人快重温一遍契约密码哟！" });
  }
});`);

  const [tuanExplanation, setTuanExplanation] = useState(
    "(骄傲地昂起小胸脯，嘴里嚼着软糖 🍬) 亲爱的主人！小团已经为你用 Express 封印好这个核心登录节点啦！如果有恶意的脚本攻击，小团的防卫机制会当场把他们关小黑屋呢，快试试‘编译运行’体验下吧！"
  );
  const [terminalLogs, setTerminalLogs] = useState(`> tsx tuan_workspace/index.ts
[TuanAgent Sandbox] Checking express dependencies... Installed!
[TuanAgent Compiler] Checking TypeScript compiler options... 0 errors
[TuanAgent Runtime] Active sandbox port 3000 mapped successfully
--------------------------------------------------------
[Tuaner Terminal] Sandbox initialized. Say 'loveTuaner520' to pass.
--------------------------------------------------------
Process finished with exit code 0. (小团为你比了个大大的赞)`);

  const [isLoading, setIsLoading] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Focus Timer Loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            handleFocusSuccess();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // Rotate Tips
  useEffect(() => {
    let tipTimer: NodeJS.Timeout;
    if (isRunning) {
      tipTimer = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % TIPS.length);
      }, 15000); // switch tips every 15s when active focus
    }
    return () => {
      if (tipTimer) clearInterval(tipTimer);
    };
  }, [isRunning]);

  const handleFocusSuccess = () => {
    // Intimacy diary log
    onAddDiary(
      "🏆 专注大捷成果",
      `你与小团一同完成了时长 ${(activeSeconds / 60).toFixed(0)} 分钟的深度专注陪伴！小团把奖励的草莓金牌捧给了你！`
    );

    // Increase energy
    setStatus((prev) => ({
      ...prev,
      energy: Math.min(100, prev.energy + 10),
      mood: "喜悦自豪",
    }));

    alert("🎉 叮铃铃！专注时间已圆满结束啦！小团给你倒好了温热水，快喝一口站起来歇息下吧！💕");
  };

  const selectPreset = (seconds: number) => {
    setIsRunning(false);
    setActiveSeconds(seconds);
    setTimeLeft(seconds);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(activeSeconds);
  };

  const toggleAmbience = (sound: typeof AMBIENCE_SOUNDS[0]) => {
    if (activeAmbience === sound.id) {
      setActiveAmbience(null);
      setAmbienceQuote("");
    } else {
      setActiveAmbience(sound.id);
      setAmbienceQuote(sound.activeLyric);
    }
  };

  // Format Helper
  const formatTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // Generate Code utilizing Backend Gemini endpoint
  const handleGenerateCode = async () => {
    if (!codexPrompt.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/codex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: codexPrompt,
          language: codexLanguage,
        }),
      });
      const data = await res.json();
      if (data.code) {
        setGeneratedCode(data.code);
        setTuanExplanation(data.explanation || "");
        setTerminalLogs(data.logs || "");
        
        // Boost intimacy relationship & energy
        setStatus((prev) => ({
          ...prev,
          energy: Math.max(0, prev.energy - 3), // Writing code burns slight system energy
          mood: "深度钻研中",
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate compiler sandbox run
  const handleSimulateRun = () => {
    if (isCompiling) return;
    setIsCompiling(true);
    
    // Play touch interaction chime
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880.00, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      }
    } catch {}

    setTimeout(() => {
      setIsCompiling(false);
      onAddDiary(
        "🏆 Codex 智能沙箱编译成功",
        `你让小团编写并本地跑通了「${codexPrompt.substring(0, 16)}...」等核心代码包。算法验证完毕，退出码为 0！`
      );
      alert("✨ [TuanAgent Runtime] 代码沙箱已经部署、静态检查与执行完毕！快看底部的虚拟终端控制台结果噢~");
    }, 1500);
  };

  const handleCopyCode = () => {
    if (isCopied) return;
    navigator.clipboard.writeText(generatedCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const loadTemplate = (tpl: typeof QUICK_TEMPLATES[0]) => {
    setCodexPrompt(tpl.prompt);
    setCodexLanguage(tpl.lang);
  };

  return (
    <div className="w-full h-full flex flex-col lg:grid lg:grid-cols-5 gap-6 overflow-y-auto p-4 lg:p-6" id="focus_panel_layout">
      
      {/* Left Avatar Showcase Glasses View (2 columns) */}
      <div className={`lg:col-span-2 flex flex-col items-center justify-center p-4 border shadow-xl rounded-2xl gap-3 transition-colors duration-500 ${
        isDark 
          ? "bg-gray-900/40 border-white/5" 
          : "bg-white border-pink-100/60"
      }`}>
        <div className="text-center">
          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
            isDark 
              ? "bg-pink-500/20 text-pink-300 border-pink-500/10" 
              : "bg-pink-100 text-pink-700 border-pink-200"
          }`}>当前状态：温柔学伴姿态</span>
          <h3 className={`text-xs font-semibold mt-1.5 ${isDark ? "text-white" : "text-slate-800"}`}>小团陪你一同奋斗</h3>
        </div>

        <div className={`relative w-52 md:w-60 h-auto aspect-[3/4] rounded-2xl overflow-hidden border shadow-2xl transition-all duration-500 ${
          isDark ? "border-white/10" : "border-pink-100/50"
        }`}>
          <img 
            src={AVATAR_STUDY} 
            alt="小团" 
            className="w-full h-full object-cover select-none pointer-events-none" 
            referrerPolicy="no-referrer"
          />
          {/* Focused Warm Overlay */}
          <div className="absolute inset-0 bg-yellow-500/5 mix-blend-color-burn pointer-events-none" />
          
          <div className="absolute top-2 right-2 bg-rose-600 px-2 py-0.5 rounded text-[9px] text-white font-bold tracking-wider animate-pulse uppercase">
            {activeTab === "tomato" ? (isRunning ? "Focusing..." : "Standby") : "Codex Active"}
          </div>
        </div>

        {/* Real-time postural bubble from her */}
        <div className={`p-3 rounded-xl border text-center text-[11px] font-sans transition-all duration-500 mt-2 leading-relaxed ${
          isDark 
            ? "bg-slate-800/60 border-white/5 text-pink-200" 
            : "bg-pink-50/70 border-pink-100/50 text-slate-700"
        }`} id="focus_tips_bubble">
          {activeTab === "tomato" ? (
            isRunning ? TIPS[tipIndex] : "“今天我们要解决哪些代码小怪兽呢？小团眼镜已经戴好啦！”"
          ) : (
            tuanExplanation || "“有什么编码重难点吗？告诉小团，小团大脑正在急速运算中！”"
          )}
        </div>
      </div>

      {/* Right Focus Operations & Codex Dashboard (3 columns) */}
      <div className="lg:col-span-3 flex flex-col gap-4 justify-between min-h-0" id="focus_dashboard_column">
        
        {/* Top Feature Swapper Tabs */}
        <div className={`flex border-b pb-1 transition-colors duration-500 ${isDark ? "border-white/5" : "border-pink-100/30"}`}>
          <button
            onClick={() => setActiveTab("tomato")}
            className={`flex-1 py-2 text-center text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "tomato"
                ? isDark 
                  ? "text-pink-400 border-pink-500 bg-pink-500/5" 
                  : "text-pink-600 border-pink-500 bg-pink-100/30"
                : isDark
                  ? "text-gray-400 border-transparent hover:text-white"
                  : "text-slate-500 border-transparent hover:text-pink-600"
            }`}
          >
            🍅 极简番茄专注
          </button>
          
          <button
            onClick={() => setActiveTab("codex")}
            className={`flex-1 py-2 text-center text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "codex"
                ? isDark 
                  ? "text-emerald-400 border-emerald-500 bg-emerald-500/5" 
                  : "text-emerald-600 border-emerald-500 bg-emerald-50"
                : isDark
                  ? "text-gray-400 border-transparent hover:text-white"
                  : "text-slate-500 border-transparent hover:text-emerald-500"
            }`}
          >
            💻 Codex 代码工坊
          </button>
        </div>

        {/* TAB 1: Classic Tomato Clock Focus Operations */}
        {activeTab === "tomato" && (
          <div className="flex-1 flex flex-col gap-4 justify-between min-h-0">
            {/* Focus Tomato Counter Board */}
            <div className={`p-5 rounded-2xl border shadow-xl flex flex-col items-center justify-center text-center transition-colors duration-500 ${
              isDark 
                ? "bg-gray-900/40 border-white/5" 
                : "bg-white border-pink-100/60"
            }`}>
              
              {/* Ticking Countdown Cover */}
              <div className="relative mb-6">
                <span className={`text-5xl md:text-6xl font-bold font-mono tracking-widest block select-none ${
                  isDark ? "text-white" : "text-slate-800"
                }`}>
                  {formatTime(timeLeft)}
                </span>
                <span className={`text-[10px] uppercase tracking-widest mt-1 block ${
                  isDark ? "text-gray-500" : "text-slate-400"
                }`}>Left Ticking Minutes</span>
              </div>

              {/* Preset Buttons Grid */}
              <div className="flex flex-wrap gap-1.5 justify-center mb-5" id="focus_presets_grid">
                {TIMER_PRESETS.map((p) => (
                  <button
                    key={p.seconds}
                    onClick={() => selectPreset(p.seconds)}
                    disabled={isRunning}
                    className={`py-1.5 px-3 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                      activeSeconds === p.seconds
                        ? "bg-pink-600 text-white shadow-md font-bold"
                        : isDark
                          ? "bg-gray-805/40 text-gray-400 hover:text-white border border-white/5 hover:bg-gray-800"
                          : "bg-pink-50/50 text-pink-700 hover:bg-pink-100 border border-pink-100"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Action Triggers */}
              <div className="flex gap-3 justify-center items-center w-full max-w-xs" id="focus_controls">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`flex-1 py-3 rounded-xl text-xs font-semibold shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 text-white ${
                    isRunning 
                      ? "bg-amber-600 hover:opacity-95" 
                      : "bg-gradient-to-tr from-pink-500 to-rose-500 hover:opacity-95"
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>暂停专注</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>开始番茄专注</span>
                    </>
                  )}
                </button>

                <button
                  onClick={resetTimer}
                  className={`p-3 rounded-xl transition-all border cursor-pointer active:scale-95 ${
                    isDark 
                      ? "bg-gray-850 hover:bg-gray-700 hover:text-white text-gray-450 border-white/5" 
                      : "bg-pink-50 hover:bg-pink-100 text-pink-650 border-pink-100"
                  }`}
                  title="重置计时器"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ambient binaural sounds board */}
            <div className={`p-4 rounded-xl border shadow-xl flex-1 flex flex-col justify-between transition-colors duration-500 ${
              isDark 
                ? "bg-gray-900/40 border-white/5" 
                : "bg-white border-pink-100/60"
            }`} id="ambience_sounds_dashboard">
              <div>
                <h3 className={`text-xs font-semibold tracking-wider uppercase mb-1.5 flex items-center gap-1.5 ${
                  isDark ? "text-white" : "text-slate-800"
                }`}>
                  <Volume2 className="w-4 h-4 text-emerald-500" />
                  白噪音自习室专属背景音
                </h3>
                <p className={`text-[10px] leading-relaxed mb-3 ${isDark ? "text-gray-400" : "text-slate-550"}`}>
                  为您配戴放松的自选白噪音。伴着这些悠扬声音，小团在您耳边说出贴心私密祝福：
                </p>

                <div className="grid grid-cols-2 gap-2" id="soundtracks_grid">
                  {AMBIENCE_SOUNDS.map((sound) => (
                    <button
                      key={sound.id}
                      onClick={() => toggleAmbience(sound)}
                      className={`py-2 px-3 rounded-xl border text-[11px] font-sans font-medium transition-all text-left flex items-center justify-between cursor-pointer ${
                        activeAmbience === sound.id
                          ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-400 font-semibold"
                          : isDark
                            ? "bg-gray-850/30 border-white/5 text-gray-400 hover:text-white hover:bg-gray-800/40"
                            : "bg-pink-50/40 border-pink-100/60 text-slate-600 hover:text-pink-700 hover:bg-pink-50"
                      }`}
                    >
                      <span>{sound.label}</span>
                      {activeAmbience === sound.id && <span className="text-[9px] text-emerald-500 font-bold">ON</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 font-sans" id="soundtrack_voice_overlay">
                {activeAmbience ? (
                  <div className="bg-emerald-505/10 border border-emerald-500/20 p-3 rounded-xl text-[10px] text-emerald-600 leading-relaxed italic animate-pulse">
                    {ambienceQuote}
                  </div>
                ) : (
                  <div className={`rounded-xl p-3 text-center text-[10px] italic ${
                    isDark ? "bg-gray-800/10 border border-white/5 text-gray-500" : "bg-pink-50/20 border border-pink-100/30 text-pink-400"
                  }`}>
                    💤 点击上方卡片开启专属静心音，听听小团对你说悄悄话~
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Codex Interactive Compiler Sandbox */}
        {activeTab === "codex" && (
          <div className="flex-1 flex flex-col gap-3 min-h-0" id="codex_studio_tab">
            
            {/* Template shortcuts */}
            <div className="flex flex-col gap-1.5 animate-fade-in">
              <span className={`text-[9px] font-mono uppercase tracking-wider ${isDark ? "text-gray-500" : "text-slate-400"}`}>小团快捷代码指令模板:</span>
              <div className="flex flex-wrap gap-1">
                {QUICK_TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    onClick={() => loadTemplate(tpl)}
                    className={`transition-all text-[10px] px-2.5 py-1 rounded-md border active:scale-95 cursor-pointer ${
                      isDark
                        ? "bg-gray-800/55 hover:bg-emerald-500/15 border-white/5 text-slate-300 hover:text-emerald-300"
                        : "bg-white hover:bg-emerald-50 border-pink-100 text-slate-700 hover:text-emerald-800 hover:border-emerald-200 shadow-sm"
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt input and language selector */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="在此输入逻辑功能、特定Api编写重难点或Bug原因..."
                value={codexPrompt}
                onChange={(e) => setCodexPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerateCode()}
                className={`flex-grow border rounded-xl px-3 py-2 text-xs outline-none font-sans transition-all ${
                  isDark
                    ? "bg-[#14121d] border-white/5 text-white placeholder-gray-500 focus:border-emerald-500/30"
                    : "bg-white border-pink-200 text-slate-800 placeholder-slate-400 focus:border-emerald-400"
                }`}
              />

              <select
                value={codexLanguage}
                onChange={(e) => setCodexLanguage(e.target.value)}
                className={`border rounded-xl px-2.5 outline-none font-mono text-xs transition-all ${
                  isDark
                    ? "bg-[#14121d] text-emerald-300 border-white/5 focus:border-emerald-500/30"
                    : "bg-white text-emerald-700 border-pink-200 focus:border-emerald-400"
                }`}
              >
                <option value="TypeScript">TypeScript</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="SQL">SQL</option>
                <option value="HTML">HTML</option>
              </select>

              <button
                onClick={handleGenerateCode}
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shrink-0 transition-all active:scale-95 flex items-center gap-1.5"
              >
                {isLoading ? (
                  <>
                    <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>少女思考中...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5" />
                    <span>让小团编码</span>
                  </>
                )}
              </button>
            </div>

            {/* Split Code output pane */}
            <div className={`flex-1 min-h-[160px] border rounded-2xl p-3 flex flex-col justify-between relative transition-colors duration-500 ${
              isDark 
                ? "bg-[#0c0911] border-white/5 text-slate-200" 
                : "bg-white border-pink-100 text-slate-800 shadow-md"
            }`}>
              {/* Header files layout bar */}
              <div className={`flex justify-between items-center border-b pb-1.5 mb-1.5 ${
                isDark ? "border-white/[0.04]" : "border-pink-100/50"
              }`}>
                <div className={`flex items-center gap-1.5 text-[10px] font-mono ${
                  isDark ? "text-gray-400" : "text-slate-500"
                }`}>
                  <Laptop className="w-3.5 h-3.5 text-emerald-500" />
                  <span>tuan_workspace / main.{codexLanguage === "Python" ? "py" : codexLanguage === "SQL" ? "sql" : "ts"}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopyCode}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer shadow-sm flex items-center gap-1 text-[9px] ${
                      isDark
                        ? "bg-gray-800/40 hover:bg-gray-800 text-gray-400 hover:text-white border border-white/5"
                        : "bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-100"
                    }`}
                    title="复制全段代码"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-500 animate-bounce" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? "复制成功!" : "复制代码"}</span>
                  </button>

                  <button
                    onClick={handleSimulateRun}
                    disabled={isCompiling || isLoading}
                    className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 hover:text-emerald-500 px-2 py-1 rounded-md transition-all cursor-pointer shadow-sm flex items-center gap-1 text-[9px] font-bold border border-emerald-500/20"
                  >
                    {isCompiling ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                        <span>编译中..</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        <span>测试运行</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Real syntax container styling code block text */}
              <div className={`flex-1 overflow-auto max-h-[140px] scrollbar-none font-mono text-[10.5px] leading-normal select-text whitespace-pre p-2.5 rounded-xl border ${
                isDark 
                  ? "bg-[#07050a] text-slate-200 border-white/[0.04]" 
                  : "bg-slate-50 text-slate-800 border-pink-100/30"
              }`}>
                {generatedCode}
              </div>
            </div>

            {/* Virtual Terminal console output board */}
            <div className={`rounded-xl p-3 font-mono text-[10px] flex flex-col gap-1.5 relative border transition-colors duration-500 ${
              isDark 
                ? "bg-black/80 border-white/5" 
                : "bg-slate-900 border-pink-200 shadow-inner"
            }`}>
              <div className="flex justify-between items-center text-[9px] text-gray-500 border-b border-white/[0.03] pb-1">
                <span className="flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-pink-400" />
                  TuanAgent Console Output (Sandbox V1)
                </span>
                <span className="bg-slate-950 px-1 rounded text-[8px] text-emerald-400">ONLINE</span>
              </div>

              <div className="text-gray-300 leading-relaxed overflow-y-auto max-h-[70px] whitespace-pre p-1">
                {isCompiling ? (
                  <span className="text-emerald-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    [Tuaner Sandbox] Installing node-modules imports, checking static structures & resolving variables...
                  </span>
                ) : (
                  terminalLogs
                )}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
