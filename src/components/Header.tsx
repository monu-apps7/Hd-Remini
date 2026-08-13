import React from "react";
import {
  Sparkles,
  Download,
  RotateCcw,
  Image as ImageIcon,
  Columns,
  SplitSquareVertical,
  Maximize2,
  Key,
  History,
  Wand2,
} from "lucide-react";
import { ViewMode } from "../types";

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onOpenGallery: () => void;
  onOpenExport: () => void;
  onOpenHistory: () => void;
  onResetFilters: () => void;
  isAiProcessing: boolean;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  onOpenGallery,
  onOpenExport,
  onOpenHistory,
  onResetFilters,
  isAiProcessing,
  hasApiKey,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 text-white px-4 py-3 flex items-center justify-between shadow-xl">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-lg shadow-rose-500/20">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-neutral-900" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-neutral-200 to-amber-200 bg-clip-text text-transparent">
              Remini AI Studio
            </h1>
            <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              HD ULTRA 4K
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-medium">
            AI Photo Enhancement & Beauty Restoration
          </p>
        </div>
      </div>

      {/* Center View Controls */}
      <div className="hidden md:flex items-center gap-1 bg-neutral-800/80 p-1 rounded-xl border border-neutral-700/60">
        <button
          onClick={() => setViewMode("split_slider")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === "split_slider"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
              : "text-neutral-400 hover:text-white hover:bg-neutral-700/50"
          }`}
          title="Split View Comparison Slider"
        >
          <SplitSquareVertical className="w-4 h-4" />
          Split Slider
        </button>

        <button
          onClick={() => setViewMode("side_by_side")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === "side_by_side"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
              : "text-neutral-400 hover:text-white hover:bg-neutral-700/50"
          }`}
          title="Side-by-Side Comparison"
        >
          <Columns className="w-4 h-4" />
          Side-by-Side
        </button>

        <button
          onClick={() => setViewMode("single_enhanced")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === "single_enhanced"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
              : "text-neutral-400 hover:text-white hover:bg-neutral-700/50"
          }`}
          title="Enhanced HD View"
        >
          <Wand2 className="w-4 h-4" />
          Enhanced
        </button>

        <button
          onClick={() => setViewMode("single_original")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === "single_original"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
              : "text-neutral-400 hover:text-white hover:bg-neutral-700/50"
          }`}
          title="Original Photo"
        >
          <Maximize2 className="w-4 h-4" />
          Original
        </button>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenGallery}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 transition-all shadow-sm"
        >
          <ImageIcon className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Samples & Upload</span>
        </button>

        <button
          onClick={onResetFilters}
          className="p-2 rounded-xl text-xs text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-all"
          title="Reset All Filter Adjustments"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenHistory}
          className="p-2 rounded-xl text-xs text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-all relative"
          title="Saved Enhancements History"
        >
          <History className="w-4 h-4" />
        </button>

        {/* API Status Badge */}
        <div
          className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium border ${
            hasApiKey
              ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/60"
              : "bg-amber-950/60 text-amber-300 border-amber-800/60"
          }`}
          title={hasApiKey ? "Server Gemini API Connected" : "Local HD Filter Engine Mode"}
        >
          <Key className="w-3.5 h-3.5" />
          <span>{hasApiKey ? "Gemini AI Active" : "Local Engine"}</span>
        </div>

        {/* Main Export HD Button */}
        <button
          onClick={onOpenExport}
          disabled={isAiProcessing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 shadow-lg shadow-rose-500/25 active:scale-95 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Save HD</span>
        </button>
      </div>
    </header>
  );
};
