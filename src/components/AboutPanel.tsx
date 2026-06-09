import React, { useState } from "react";
import { User, Volume2, Sparkles, Wand2, ShieldAlert, Heart } from "lucide-react";
import { VoicePack, IntimacyState } from "../types";
import { VOICE_PACKS } from "../data";

interface AboutPanelProps {
  intimacy: IntimacyState;
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
  { id: "o1", name: "🌸 经典小西装 JK 裙", reqLv: 1, desc: "初次相遇时，小团身上穿的日系经典水手制服。甜美清醇。" },
  { id: "o2", name: "👓 温柔知性金丝眼镜装", reqLv: 4, desc: "当你们一起专注于学习或工作时，她戴上圆框金边装饰眼镜，十分懂行。" },
  { id: "o3", name: "🍓 居家草莓粉睡衣", reqLv: 7, desc: "深度亲密后解禁的毛茸茸草莓居家服，适合深夜对你说悄悄话。" },
];

export default function AboutPanel({ intimacy }: AboutPanelProps) {
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [voiceLyrics, setVoiceLyrics] = useState("");

  const playVoice = (pack: VoicePack) => {
    if (playingVoiceId) return;

    setPlayingVoiceId(pack.id);
    setVoiceLyrics(pack.lyrics);

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
        <div className="bg-gradient-to-br from-pink-900/30 to-gray-900 border border-white/5 shadow-2xl rounded-2xl p-5" id="companion_card">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 font-bold text-white flex items-center justify-center text-lg shadow-lg">
              团
            </div>
            <div>
              <h3 className="text-white text-sm font-bold flex items-center gap-1">
                小团er
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <span className="text-[10px] text-pink-300 font-mono">虚拟桌面二次元贴心萌娘</span>
            </div>
          </div>

          <div className="space-y-3 text-xs" id="character_traits">
            {BIO_STATS.map((stat, idx) => (
              <div key={idx} className="flex justify-between items-center py-1 border-b border-white/[0.02]" id={`trait_${idx}`}>
                <span className="text-gray-400 font-medium">{stat.label}</span>
                <span className="text-slate-200 text-right font-sans">{stat.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dress Up Wardrobes */}
        <div className="bg-gray-900/40 p-5 rounded-2xl border border-white/5 shadow-xl flex-1" id="wardrobes_list">
          <h3 className="text-white text-xs font-semibold tracking-wider uppercase mb-3 flex items-center gap-1.5">
            <Wand2 className="w-4 h-4 text-pink-400 animate-pulse" />
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
                      ? "bg-slate-800/40 border-pink-500/25 group hover:border-pink-500/40"
                      : "bg-gray-800/10 border-white/5 opacity-50"
                  }`}
                  id={`outfit_node_${out.id}`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-semibold ${isUnlocked ? "text-slate-200" : "text-gray-500"}`}>
                      {out.name}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-mono ${
                      isUnlocked 
                        ? "bg-emerald-500/20 text-emerald-400" 
                        : "bg-amber-500/15 text-amber-300"
                    }`}>
                      {isUnlocked ? "❤️ 已解锁装扮" : `🔒 Lv.${out.reqLv} 亲密锁`}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-sans leading-relaxed mt-0.5">{out.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Voice Packs Studio Column */}
      <div className="lg:col-span-3 bg-gray-900/40 backdrop-blur-md p-5 rounded-2xl border border-white/5 shadow-xl flex flex-col justify-between" id="about_voicepacks_column">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-white font-semibold text-xs tracking-wider uppercase">专属声卡原音播录室</h2>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
            这里收藏着小团悄悄为你录下的所有甜美日记！点击以下声卡即可在屏幕播发她的声音字幕。
          </p>

          <div className="space-y-2.5" id="voicepacks_list">
            {VOICE_PACKS.map((pack) => (
              <button
                key={pack.id}
                onClick={() => playVoice(pack)}
                disabled={playingVoiceId !== null}
                className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                  playingVoiceId === pack.id
                    ? "bg-emerald-500/20 border-emerald-500/45 text-emerald-300 font-medium"
                    : playingVoiceId !== null
                    ? "bg-gray-800/10 border-white/5 text-gray-600 cursor-not-allowed opacity-30"
                    : "bg-gray-800/30 border-white/5 text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold">{pack.title}</span>
                  <span className="text-[9px] text-gray-500">{pack.caption}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-gray-500">{pack.audioDuration}</span>
                  <span className="text-xs">
                    {playingVoiceId === pack.id ? "🔊 正在播发..." : "▶️ 播发原音"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Lip Sync Lyric display box */}
        <div className="mt-5" id="lyric_sync_box">
          {playingVoiceId ? (
            <div className="bg-slate-900/80 border border-emerald-500/20 rounded-xl p-4 shadow-xl" id="voice_playing_board">
              <div className="flex items-center justify-between text-[10px] text-emerald-400 font-semibold mb-2.5">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  小团原音实时歌声字幕
                </span>
                
                {/* Voice sound bars decoration */}
                <div className="flex gap-0.5 items-end h-3">
                  <span className="w-0.5 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="w-0.5 h-3 bg-emerald-500 rounded-full animate-[bounce_0.5s_infinite]" />
                  <span className="w-0.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                </div>
              </div>
              <p className="text-emerald-100 font-sans italic text-xs leading-relaxed">
                {voiceLyrics}
              </p>
            </div>
          ) : (
            <div className="bg-gray-800/10 border border-white/5 rounded-xl p-4 text-center text-[11px] text-gray-400 italic" id="voice_idle_prompt">
              💡 闲暇之余，点触声卡听听小团对你的真情告白吧~
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
