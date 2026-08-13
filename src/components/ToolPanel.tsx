import React, { useState } from "react";
import { FilterSettings, CropState, AIAnalysisResult } from "../types";
import {
  Sparkles,
  Smile,
  Sliders,
  Crop,
  BrainCircuit,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  CheckCircle2,
  Wand2,
  AlertCircle,
  Play,
  Palette,
  Sun,
  Flame,
} from "lucide-react";

interface ToolPanelProps {
  filters: FilterSettings;
  onFilterChange: (key: keyof FilterSettings, value: number) => void;
  cropState: CropState;
  onCropChange: (crop: Partial<CropState>) => void;
  onRunAiEnhance: (mode: string, promptExtra?: string) => void;
  onAnalyzePhoto: () => void;
  aiAnalysis: AIAnalysisResult | null;
  isAnalyzing: boolean;
  isAiProcessing: boolean;
}

type TabType = "ai_magic" | "beauty" | "adjust" | "crop" | "analysis";

export const ToolPanel: React.FC<ToolPanelProps> = ({
  filters,
  onFilterChange,
  cropState,
  onCropChange,
  onRunAiEnhance,
  onAnalyzePhoto,
  aiAnalysis,
  isAnalyzing,
  isAiProcessing,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("ai_magic");
  const [customPrompt, setCustomPrompt] = useState<string>(
    "Soft studio lighting, balanced contrast, low contrast portrait, natural skin texture, smooth skin, fix harsh shadows, photorealistic, 4k detail."
  );

  return (
    <div className="w-full bg-[#1E293B] border-t border-slate-700/50 text-slate-200 flex flex-col shadow-2xl">
      {/* Tab Navigation Row */}
      <div className="flex items-center justify-around border-b border-slate-700/50 bg-[#0F172A] px-2">
        <button
          onClick={() => setActiveTab("ai_magic")}
          className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === "ai_magic"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>AI Magic</span>
        </button>

        <button
          onClick={() => setActiveTab("beauty")}
          className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === "beauty"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Smile className="w-4 h-4 text-fuchsia-400" />
          <span>Beauty Studio</span>
        </button>

        <button
          onClick={() => setActiveTab("adjust")}
          className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === "adjust"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Adjustments</span>
        </button>

        <button
          onClick={() => setActiveTab("crop")}
          className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === "crop"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Crop className="w-4 h-4 text-cyan-400" />
          <span>Crop & Rotate</span>
        </button>

        <button
          onClick={() => setActiveTab("analysis")}
          className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === "analysis"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-fuchsia-400" />
          <span>AI Inspector</span>
        </button>
      </div>

      {/* Tab Contents Area */}
      <div className="p-4 max-w-5xl mx-auto w-full min-h-[170px] max-h-[260px] overflow-y-auto custom-scrollbar">
        {/* TAB 1: AI MAGIC RESTORATION */}
        {activeTab === "ai_magic" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                disabled={isAiProcessing}
                onClick={() => onRunAiEnhance("face_enhance")}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800 border border-cyan-500/30 hover:bg-slate-700/50 transition-all text-left group disabled:opacity-50 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Ultra Enhance</p>
                  <p className="text-xs text-slate-400">4K Detail Unblur</p>
                </div>
              </button>

              <button
                disabled={isAiProcessing}
                onClick={() => onRunAiEnhance("beauty_touchup")}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-700 hover:bg-slate-700/50 transition-all text-left group disabled:opacity-50 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Smile className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Beauty Retouch</p>
                  <p className="text-xs text-slate-400">Smooth skin & glow</p>
                </div>
              </button>

              <button
                disabled={isAiProcessing}
                onClick={() => onRunAiEnhance("old_photo_restore")}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-700 hover:bg-slate-700/50 transition-all text-left group disabled:opacity-50 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Smart Color</p>
                  <p className="text-xs text-slate-400">Colorize B&W</p>
                </div>
              </button>

              <button
                disabled={isAiProcessing}
                onClick={() => onRunAiEnhance("hdr_lighting")}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-700 hover:bg-slate-700/50 transition-all text-left group disabled:opacity-50 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">HDR Studio</p>
                  <p className="text-xs text-slate-400">Fix dark shadows</p>
                </div>
              </button>
            </div>

            {/* Custom AI Style Prompt Input */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row items-center gap-2 bg-[#0F172A] p-2.5 rounded-xl border border-slate-700">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 pl-1 min-w-max">
                  <Wand2 className="w-4 h-4" />
                  <span>AI Prompt:</span>
                </div>

                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., Soft studio rim lighting, sharpen pupils, smooth acne spots"
                  className="flex-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder-slate-500"
                />

                <button
                  disabled={isAiProcessing}
                  onClick={() => onRunAiEnhance("face_enhance", customPrompt)}
                  className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-full transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Prompt</span>
                </button>
              </div>

              {/* Quick Prompt Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold pr-1 shrink-0">Quick Prompts:</span>
                <button
                  type="button"
                  onClick={() =>
                    setCustomPrompt(
                      "Soft studio lighting, balanced contrast, low contrast portrait, natural skin texture, smooth skin, fix harsh shadows, photorealistic, 4k detail."
                    )
                  }
                  className="px-2.5 py-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-[11px] font-medium transition-all shrink-0 cursor-pointer"
                >
                  ✨ Soft Studio Lighting
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCustomPrompt(
                      "Ultra sharp 4K detail, unblur face, crisp pupils and eyelashes, natural micro skin texture."
                    )
                  }
                  className="px-2.5 py-1 rounded-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 text-blue-300 text-[11px] font-medium transition-all shrink-0 cursor-pointer"
                >
                  🔍 4K Crisp Details
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCustomPrompt(
                      "Soft studio fill lighting, even facial exposure, remove dark under-eye shadows and harsh glare."
                    )
                  }
                  className="px-2.5 py-1 rounded-full bg-fuchsia-500/20 hover:bg-fuchsia-500/30 border border-fuchsia-400/40 text-fuchsia-300 text-[11px] font-medium transition-all shrink-0 cursor-pointer"
                >
                  ☀️ Fix Harsh Shadows
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BEAUTY STUDIO */}
        {activeTab === "beauty" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <SliderControl
              label="Skin Smoothness"
              value={filters.skinSmoothness}
              onChange={(v) => onFilterChange("skinSmoothness", v)}
              min={0}
              max={100}
              icon={Smile}
              colorClass="text-fuchsia-400"
            />

            <SliderControl
              label="Eye Clarity & Iris Glow"
              value={filters.eyeClarity}
              onChange={(v) => onFilterChange("eyeClarity", v)}
              min={0}
              max={100}
              icon={Sparkles}
              colorClass="text-cyan-400"
            />

            <SliderControl
              label="Natural Lip Tint"
              value={filters.lipTint}
              onChange={(v) => onFilterChange("lipTint", v)}
              min={0}
              max={100}
              icon={Flame}
              colorClass="text-pink-400"
            />

            <SliderControl
              label="Teeth Whitening"
              value={filters.teethWhite}
              onChange={(v) => onFilterChange("teethWhite", v)}
              min={0}
              max={100}
              icon={CheckCircle2}
              colorClass="text-emerald-400"
            />

            <SliderControl
              label="Skin Denoise & Soft Focus"
              value={filters.denoise}
              onChange={(v) => onFilterChange("denoise", v)}
              min={0}
              max={100}
              icon={Sliders}
              colorClass="text-cyan-400"
            />

            <SliderControl
              label="Vintage Colorization"
              value={filters.colorizeVintage}
              onChange={(v) => onFilterChange("colorizeVintage", v)}
              min={0}
              max={100}
              icon={Palette}
              colorClass="text-amber-400"
            />
          </div>
        )}

        {/* TAB 3: PRO ADJUSTMENTS */}
        {activeTab === "adjust" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <SliderControl
              label="Sharpness"
              value={filters.sharpness}
              onChange={(v) => onFilterChange("sharpness", v)}
              min={0}
              max={100}
              colorClass="text-cyan-400"
            />

            <SliderControl
              label="Brightness (β: +10 to +20)"
              value={filters.brightness}
              onChange={(v) => onFilterChange("brightness", v)}
              min={-50}
              max={50}
              colorClass="text-cyan-400"
            />

            <SliderControl
              label="Contrast (α: 1.1 - 1.2)"
              value={filters.contrast}
              onChange={(v) => onFilterChange("contrast", v)}
              min={-50}
              max={50}
              colorClass="text-cyan-400"
            />

            <SliderControl
              label="Highlights"
              value={filters.highlights}
              onChange={(v) => onFilterChange("highlights", v)}
              min={-50}
              max={50}
              colorClass="text-cyan-400"
            />

            <SliderControl
              label="Shadows"
              value={filters.shadows}
              onChange={(v) => onFilterChange("shadows", v)}
              min={-50}
              max={50}
              colorClass="text-cyan-400"
            />

            <SliderControl
              label="Saturation / Color Pop"
              value={filters.saturation}
              onChange={(v) => onFilterChange("saturation", v)}
              min={-50}
              max={50}
              colorClass="text-cyan-400"
            />

            <SliderControl
              label="Warmth / Temperature"
              value={filters.warmth}
              onChange={(v) => onFilterChange("warmth", v)}
              min={-50}
              max={50}
              colorClass="text-cyan-400"
            />

            <SliderControl
              label="Vignette"
              value={filters.vignette}
              onChange={(v) => onFilterChange("vignette", v)}
              min={0}
              max={100}
              colorClass="text-cyan-400"
            />
          </div>
        )}

        {/* TAB 4: CROP & ROTATE */}
        {activeTab === "crop" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Aspect Ratio:</span>
              {(["free", "1:1", "4:5", "9:16", "16:9"] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => onCropChange({ aspectRatio: ratio })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    cropState.aspectRatio === ratio
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-md shadow-blue-500/20"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {ratio.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => onCropChange({ rotation: (cropState.rotation + 90) % 360 })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-all cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-cyan-400" />
                <span>Rotate 90°</span>
              </button>

              <button
                onClick={() => onCropChange({ flipH: !cropState.flipH })}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  cropState.flipH
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                    : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                }`}
              >
                <FlipHorizontal className="w-4 h-4 text-cyan-400" />
                <span>Flip Horiz</span>
              </button>

              <button
                onClick={() => onCropChange({ flipV: !cropState.flipV })}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  cropState.flipV
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                    : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                }`}
              >
                <FlipVertical className="w-4 h-4 text-fuchsia-400" />
                <span>Flip Vert</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: AI VISION INSPECTOR */}
        {activeTab === "analysis" && (
          <div className="space-y-3">
            {!aiAnalysis ? (
              <div className="flex flex-col items-center justify-center p-6 bg-[#0F172A] rounded-2xl border border-slate-700 text-center">
                <BrainCircuit className="w-10 h-10 text-cyan-400 mb-2 animate-pulse" />
                <h4 className="text-sm font-bold text-white mb-1">Analyze Photo Quality with Gemini Vision</h4>
                <p className="text-xs text-slate-400 max-w-md mb-4">
                  Get instant AI assessment of sharpness, blur level, skin texture, and custom optimization recommendations.
                </p>
                <button
                  disabled={isAnalyzing}
                  onClick={onAnalyzePhoto}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>{isAnalyzing ? "Analyzing Photo Quality..." : "Scan Photo Quality"}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Score Card */}
                <div className="p-3 bg-[#0F172A] rounded-xl border border-slate-700 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quality Score</div>
                    <div className="text-3xl font-extrabold text-cyan-400 mt-1">{aiAnalysis.qualityScore}/100</div>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1 mt-2">
                    <div><span className="text-slate-500">Blur:</span> {aiAnalysis.blurLevel}</div>
                    <div><span className="text-slate-500">Lighting:</span> {aiAnalysis.lighting}</div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="md:col-span-2 p-3 bg-[#0F172A] rounded-xl border border-slate-700">
                  <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Gemini AI Recommendations</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {aiAnalysis.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface SliderControlProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  icon?: React.ComponentType<{ className?: string }>;
  colorClass?: string;
}

const SliderControl: React.FC<SliderControlProps> = ({ label, value, onChange, min, max, icon: Icon, colorClass = "text-cyan-400" }) => {
  return (
    <div className="flex flex-col gap-1.5 bg-[#0F172A] p-2.5 rounded-xl border border-slate-700/80">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
          {Icon && <Icon className={`w-3.5 h-3.5 ${colorClass}`} />}
          {label}
        </span>
        <span className={`font-mono font-bold ${colorClass}`}>{value > 0 ? `+${value}` : value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan-400 bg-slate-700 h-1.5 rounded-lg cursor-pointer"
      />
    </div>
  );
};
