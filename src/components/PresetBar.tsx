import React from "react";
import { Sparkles, Smile, Zap, Palette, SunMedium, Wand2, Camera } from "lucide-react";

interface PresetBarProps {
  activePresetKey: string;
  onSelectPreset: (presetKey: string) => void;
  onTriggerAiMode: (modeKey: string) => void;
  isAiProcessing: boolean;
}

export const PRESETS = [
  {
    key: "soft_studio",
    mode: "face_enhance",
    label: "Soft Studio Lighting",
    subLabel: "Low Contrast & Smooth Skin",
    icon: Camera,
    color: "from-emerald-500 to-teal-600",
  },
  {
    key: "auto_hd",
    mode: "face_enhance",
    label: "Auto HD Enhance",
    subLabel: "Face Restore & Sharp",
    icon: Sparkles,
    color: "from-amber-500 to-rose-600",
  },
  {
    key: "beauty_glow",
    mode: "beauty_touchup",
    label: "Beauty Glow",
    subLabel: "Skin Smooth & Lips",
    icon: Smile,
    color: "from-rose-500 to-pink-600",
  },
  {
    key: "ultra_unblur",
    mode: "face_enhance",
    label: "Ultra Unblur",
    subLabel: "4K Crisp Details",
    icon: Zap,
    color: "from-cyan-500 to-blue-600",
  },
  {
    key: "colorize_bw",
    mode: "old_photo_restore",
    label: "Colorize Vintage",
    subLabel: "Fix Old B&W Photos",
    icon: Palette,
    color: "from-amber-600 to-orange-600",
  },
  {
    key: "hdr_studio",
    mode: "hdr_lighting",
    label: "HDR Studio Light",
    subLabel: "Shadow Boost & Glow",
    icon: SunMedium,
    color: "from-purple-600 to-indigo-600",
  },
];

export const PresetBar: React.FC<PresetBarProps> = ({
  activePresetKey,
  onSelectPreset,
  onTriggerAiMode,
  isAiProcessing,
}) => {
  return (
    <div className="w-full bg-neutral-900/90 border-b border-neutral-800 px-4 py-3 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-3 min-w-max mx-auto max-w-6xl">
        <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 pr-2 border-r border-neutral-800">
          <Wand2 className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span>1-Tap Magic</span>
        </div>

        {PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isActive = activePresetKey === preset.key;

          return (
            <button
              key={preset.key}
              disabled={isAiProcessing}
              onClick={() => {
                onSelectPreset(preset.key);
                onTriggerAiMode(preset.mode);
              }}
              className={`group relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-left transition-all duration-200 border ${
                isActive
                  ? "bg-neutral-800 border-amber-500/80 shadow-lg shadow-amber-500/10 text-white"
                  : "bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-700"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${preset.color} text-white shadow-md group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div>
                <div className="text-xs font-bold flex items-center gap-1">
                  <span>{preset.label}</span>
                </div>
                <div className="text-[10px] text-neutral-400">{preset.subLabel}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
