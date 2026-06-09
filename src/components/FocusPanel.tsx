import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, ShieldAlert, CheckCircle, Heart } from "lucide-react";
import { CompanionStatus } from "../types";

// Dynamic Glasses study avatar
const AVATAR_STUDY = "/src/assets/images/companion_study_1780973892626.png";

interface FocusPanelProps {
  status: CompanionStatus;
  setStatus: React.Dispatch<React.SetStateAction<CompanionStatus>>;
  onAddDiary: (title: string, desc: string) => void;
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

export default function FocusPanel({
  status,
  setStatus,
  onAddDiary,
}: FocusPanelProps) {
  const [activeSeconds, setActiveSeconds] = useState(1500); // Default 25 min
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [activeAmbience, setActiveAmbience] = useState<string | null>(null);
  const [ambienceQuote, setAmbienceQuote] = useState("");
  const [tipIndex, setTipIndex] = useState(0);

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

  return (
    <div className="w-full h-full flex flex-col lg:grid lg:grid-cols-5 gap-6 overflow-y-auto p-4 lg:p-6" id="focus_panel_layout">
      
      {/* Left Avatar Showcase Glasses View (2 columns) */}
      <div className="lg:col-span-2 flex flex-col items-center justify-center p-4 bg-gray-900/40 border border-white/5 shadow-xl rounded-2xl gap-3">
        <div className="text-center">
          <span className="text-[10px] bg-pink-500/20 text-pink-300 font-mono px-2 py-0.5 rounded-full border border-pink-500/10">当前状态：温柔学伴姿态</span>
          <h3 className="text-white text-xs font-semibold mt-1">小团陪你一同奋斗</h3>
        </div>

        <div className="relative w-52 md:w-60 h-auto aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <img 
            src={AVATAR_STUDY} 
            alt="小团" 
            className="w-full h-full object-cover select-none pointer-events-none" 
            referrerPolicy="no-referrer"
          />
          {/* Focused Warm Overlay */}
          <div className="absolute inset-0 bg-yellow-500/5 mix-blend-color-burn pointer-events-none" />
          
          <div className="absolute top-2 right-2 bg-rose-600 px-2 py-0.5 rounded text-[9px] text-white font-bold tracking-wider animate-pulse uppercase">
            {isRunning ? "Focusing..." : "Standby"}
          </div>
        </div>

        {/* Real-time postural bubble from her */}
        <div className="bg-slate-800/60 p-3 rounded-xl border border-white/5 text-center text-[11px] font-sans text-pink-200 mt-2 leading-relaxed" id="focus_tips_bubble">
          {isRunning ? TIPS[tipIndex] : "“今天我们要解决哪些代码小怪兽呢？小团眼镜已经带好啦！”"}
        </div>
      </div>

      {/* Right Focus Operations Dashboard (3 columns) */}
      <div className="lg:col-span-3 flex flex-col gap-5 justify-between" id="focus_dashboard_column">
        
        {/* Focus Tomato Counter Board */}
        <div className="bg-gray-900/40 p-5 rounded-2xl border border-white/5 shadow-xl flex flex-col items-center justify-center text-center">
          
          {/* Ticking Countdown Cover */}
          <div className="relative mb-6">
            <span className="text-5xl md:text-6xl font-bold font-mono tracking-widest text-white block select-none">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 block">Left Ticking Minutes</span>
          </div>

          {/* Preset Buttons Grid */}
          <div className="flex flex-wrap gap-1.5 justify-center mb-5" id="focus_presets_grid">
            {TIMER_PRESETS.map((p) => (
              <button
                key={p.seconds}
                onClick={() => selectPreset(p.seconds)}
                disabled={isRunning}
                className={`py-1.5 px-3 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                  activeSeconds === p.seconds
                    ? "bg-pink-600 text-white shadow-md font-bold"
                    : "bg-gray-800/40 text-gray-400 hover:text-white border border-white/5 hover:bg-gray-800"
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
              className="p-3 bg-gray-800 hover:bg-gray-700 hover:text-white text-gray-400 rounded-xl transition-all border border-white/5 cursor-pointer active:scale-95"
              title="重置计时器"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ambient binaural sounds board */}
        <div className="bg-gray-900/40 p-5 rounded-2xl border border-white/5 shadow-xl flex-1 flex flex-col justify-between" id="ambience_sounds_dashboard">
          <div>
            <h3 className="text-white text-xs font-semibold tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              白噪音自习室专属背景音
            </h3>
            <p className="text-[10px] text-gray-400 leading-relaxed mb-3">
              为您匹配放松的白噪音。伴着这些悠扬声音，小团在您耳边说出贴心私密祝福：
            </p>

            <div className="grid grid-cols-2 gap-2" id="soundtracks_grid">
              {AMBIENCE_SOUNDS.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => toggleAmbience(sound)}
                  className={`py-2.5 px-3 rounded-xl border text-[11px] font-sans font-medium transition-all text-left flex items-center justify-between cursor-pointer ${
                    activeAmbience === sound.id
                      ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-300 font-semibold"
                      : "bg-gray-850/30 border-white/5 text-gray-400 hover:text-white hover:bg-gray-800/40"
                  }`}
                >
                  <span>{sound.label}</span>
                  {activeAmbience === sound.id && <span className="text-[9px] text-emerald-400 font-bold">ON</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4" id="soundtrack_voice_overlay">
            {activeAmbience ? (
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl text-[10px] text-emerald-300 leading-relaxed italic animate-pulse">
                {ambienceQuote}
              </div>
            ) : (
              <div className="bg-gray-800/10 border border-white/5 rounded-xl p-3 text-center text-[10px] text-gray-400 italic">
                💤 点击上方卡片开启专属静心音，听听小团对你说悄悄话~
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
