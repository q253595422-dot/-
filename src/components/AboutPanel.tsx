import React, { useState } from "react";
import { User, Volume2, Sparkles, Wand2, ShieldAlert, Heart } from "lucide-react";
import { VoicePack, IntimacyState } from "../types";
import { VOICE_PACKS } from "../data";

interface AboutPanelProps {
  intimacy: IntimacyState;
  theme?: "dark" | "light";
}

const BIO_STATS = [
  { label: "名称", val: "小团 (Tuaner / Tuan Tuan)" },
  { label: "生日", val: "06月09日 (双子座)" },
  { label: "身高", val: "162 cm" },
  { label: "体重", val: "43.5 kg" },
  { label: "喜爱物品", val: "糖果、粉色信纸、草莓大福" },
  { label: "专属特权", val: "陪伴写代码、督促喝水、深夜拥抱" },
];

const WARDROBE = [
  { id: "o1", name: "🌸 经典日常水手服 JK", reqLv: 1, desc: "初次相遇时，小团身上穿的日系经典水手制服。甜美清醇。" },
  { id: "o2", name: "👓 知性金丝防蓝光眼镜", reqLv: 4, desc: "当你们一起专注于写代码时，她戴上圆框金饰眼镜，专心而乖巧。" },
  { id: "o3", name: "🍓 软绵绵居家草莓睡衣", reqLv: 7, desc: "深度亲密后解禁的毛茸茸草莓睡袍，适合深夜对你说悄悄话。" },
];

export default function AboutPanel({ intimacy, theme = "dark" }: AboutPanelProps) {
  const isDark = theme === "dark";
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [voiceLyrics, setVoiceLyrics] = useState("");

  const playVoice = (pack: VoicePack) => {
    if (playingVoiceId) return;

    setPlayingVoiceId(pack.id);
    setVoiceLyrics(pack.lyrics);

    // Play touch interaction chime
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {}

    // Simulate audio length
    setTimeout(() => {
      setPlayingVoiceId(null);
      setVoiceLyrics("");
    }, 6000);
  };

  return (
    <div className="w-full h-full flex flex-col lg:grid lg:grid-cols-5 gap-6 overflow-y-auto p-4 lg:p-6" id="about_panel_grid">
      
      {/* Bio / Stats Column */}
      <div className="lg:col-span-2 flex flex-col gap-4" id="about_bio_column">
        {/* Profile Card */}
        <div className={`border shadow-2xl rounded-2xl p-5 transition-colors duration-500 ${
          isDark 
            ? "bg-gradient-to-br from-pink-900/30 to-gray-900 border-white/5" 
            : "bg-gradient-to-b from-pink-100/50 to-white border-pink-205 shadow-md"
        }`} id="companion_card">
          <div className={`flex items-center gap-3 border-b pb-4 mb-4 ${isDark ? "border-white/5" : "border-pink-100/40"}`}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 font-bold text-white flex items-center justify-center text-lg shadow-lg">
              团
            </div>
            <div>
              <h3 className={`text-sm font-bold flex items-center gap-1 ${isDark ? "text-white" : "text-slate-800"}`}>
                小团er
                <Sparkles className="w-4 h-4 text-amber-500 animate-[bounce_1.5s_infinite]" />
              </h3>
              <span className={`text-[10px] font-mono ${isDark ? "text-pink-300" : "text-pink-600 font-semibold"}`}>虚拟桌面二次元贴心萌娘</span>
            </div>
          </div>

          <div className="space-y-3 text-xs" id="character_traits">
            {BIO_STATS.map((stat, idx) => (
              <div key={idx} className={`flex justify-between items-center py-1 border-b ${
                isDark ? "border-white/[0.02]" : "border-pink-100/20"
              }`} id={`trait_${idx}`}>
                <span className={`font-semibold ${isDark ? "text-gray-400" : "text-slate-500"}`}>{stat.label}</span>
                <span className={`text-right font-sans ${isDark ? "text-slate-205" : "text-slate-700"}`}>{stat.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dress Up Wardrobes */}
        <div className={`p-5 rounded-2xl border shadow-xl flex-1 transition-colors duration-500 ${
          isDark 
            ? "bg-gray-900/40 border-white/5" 
            : "bg-white border-pink-100/60 shadow-md"
        }`} id="wardrobes_list">
          <h3 className={`text-xs font-semibold tracking-wider uppercase mb-3 flex items-center gap-1.5 ${
            isDark ? "text-white" : "text-slate-800"
          }`}>
            <Wand2 className="w-4 h-4 text-pink-500 animate-pulse" />
            小团的秘密衣物间 (装扮解锁)
          </h3>

          <div className="space-y-3" id="outfits_nodes">
            {WARDROBE.map((out) => {
              const isUnlocked = intimacy.level >= out.reqLv;
              return (
                <div 
                  key={out.id}
                  className={`p-3.5 rounded-xl border flex flex-col gap-1 transition-all ${
                    isUnlocked
                      ? isDark
                        ? "bg-slate-800/40 border-pink-500/25 hover:border-pink-500/40"
                        : "bg-pink-50/20 border-pink-200/65 shadow-sm hover:border-pink-400"
                      : "bg-gray-800/10 border-white/5 opacity-50"
                  }`}
                  id={`outfit_node_${out.id}`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-bold ${
                      isUnlocked 
                        ? isDark ? "text-slate-200" : "text-slate-750" 
                        : "text-gray-500"
                    }`}>
                      {out.name}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-mono ${
                      isUnlocked 
                        ? "bg-emerald-500/20 text-emerald-400" 
                        : "bg-amber-500/15 text-amber-500 font-semibold"
                    }`}>
                      {isUnlocked ? "❤️ 已解锁饰品" : `🔒 Lv.${out.reqLv} 亲密锁`}
                    </span>
                  </div>
                  <p className={`text-[10px] font-sans leading-relaxed mt-0.5 ${isDark ? "text-gray-400" : "text-slate-500"}`}>{out.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Voice Packs Studio Column */}
      <div className={`backdrop-blur-md p-5 rounded-2xl border shadow-xl flex flex-col justify-between transition-colors duration-500 ${
        isDark 
          ? "bg-gray-900/40 border-white/5" 
          : "bg-white border-pink-100/60 shadow-md"
      }`} id="about_voicepacks_column">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Volume2 className="w-4 h-4 text-emerald-500" />
            <h2 className={`font-semibold text-xs tracking-wider uppercase ${isDark ? "text-white" : "text-slate-800"}`}>专属声卡原音播记室</h2>
          </div>
          <p className={`text-[11px] leading-relaxed mb-4 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
            这里收纳着小团悄悄为你录下的所有甜美心情！点击以下声卡即可在屏幕播发她的语音原声字幕。
          </p>

          <div className="space-y-2.5" id="voicepacks_list">
            {VOICE_PACKS.map((pack) => (
              <button
                key={pack.id}
                onClick={() => playVoice(pack)}
                disabled={playingVoiceId !== null}
                className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                  playingVoiceId === pack.id
                    ? isDark
                      ? "bg-emerald-500/20 border-emerald-500/45 text-emerald-300 font-semibold"
                      : "bg-emerald-50 border-emerald-200 text-emerald-800 font-bold"
                    : playingVoiceId !== null
                    ? "bg-gray-800/10 border-white/5 text-gray-500 cursor-not-allowed opacity-30"
                    : isDark
                      ? "bg-gray-800/30 border-white/5 text-slate-300 hover:bg-slate-800/60 hover:text-white"
                      : "bg-pink-50/50 border-pink-100 text-pink-900 hover:bg-pink-100 hover:text-pink-950"
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold">{pack.title}</span>
                  <span className={`text-[9px] ${isDark ? "text-gray-500" : "text-slate-450 font-medium"}`}>{pack.caption}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-mono ${isDark ? "text-gray-500" : "text-slate-400"}`}>{pack.audioDuration}</span>
                  <span className="text-[10px] font-bold">
                    {playingVoiceId === pack.id ? "🔊 正在播出..." : "▶️ 播原声"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Lip Sync Lyric display box */}
        <div className="mt-5" id="lyric_sync_box">
          {playingVoiceId ? (
            <div className={`border rounded-xl p-4 shadow-xl transition-all duration-300 ${
              isDark 
                ? "bg-slate-900/80 border-emerald-500/20 text-emerald-400" 
                : "bg-emerald-50/90 border-emerald-250 text-emerald-800 shadow-md"
            }`} id="voice_playing_board">
              <div className={`flex items-center justify-between text-[10px] font-semibold mb-2.5 ${
                isDark ? "text-emerald-400" : "text-emerald-700"
              }`}>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-550 animate-ping" />
                  小团原音实时歌声字幕
                </span>
                
                {/* Voice sound bars decoration */}
                <div className="flex gap-0.5 items-end h-3">
                  <span className="w-0.5 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="w-0.5 h-3 bg-emerald-500 rounded-full animate-[bounce_0.5s_infinite]" />
                  <span className="w-0.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                </div>
              </div>
              <p className={`font-sans italic text-xs leading-relaxed ${isDark ? "text-emerald-100" : "text-emerald-950 font-semibold"}`}>
                {voiceLyrics}
              </p>
            </div>
          ) : (
            <div className={`rounded-xl p-4 text-center text-[11px] italic transition-colors duration-500 ${
              isDark ? "bg-gray-800/10 border border-white/5 text-gray-500" : "bg-pink-50/20 border border-pink-100/40 text-pink-500"
            }`} id="voice_idle_prompt">
              💡 闲暇之余，点击声卡听听小团对你的真情表白吧~
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
