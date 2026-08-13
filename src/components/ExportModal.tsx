import React, { useState } from "react";
import { Download, X, Sparkles, Image as ImageIcon, Columns, Check } from "lucide-react";
import { ExportOptions } from "../types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportDownload: (options: ExportOptions) => void;
  isExporting: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExportDownload,
  isExporting,
}) => {
  const [format, setFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");
  const [scale, setScale] = useState<number>(2); // 2x 4K Ultra HD
  const [includeComparison, setIncludeComparison] = useState<boolean>(false);
  const [includeWatermark, setIncludeWatermark] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleDownloadClick = () => {
    onExportDownload({
      format,
      quality: 0.95,
      scale,
      includeComparison,
      includeWatermark,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#1E293B] border border-slate-700/50 rounded-2xl shadow-2xl p-6 text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/50 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-400 to-fuchsia-500 text-white">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Export Remini Photo</h3>
              <p className="text-xs text-slate-400">Save Ultra HD enhanced photo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selection */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-2">
              File Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "image/png", label: "PNG", sub: "Lossless HD" },
                { id: "image/jpeg", label: "JPG", sub: "High Quality" },
                { id: "image/webp", label: "WEBP", sub: "Compact" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id as any)}
                  className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                    format === f.id
                      ? "bg-cyan-500/20 border-cyan-400 text-white"
                      : "bg-[#0F172A] border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="text-xs font-bold">{f.label}</div>
                  <div className="text-[10px] opacity-70">{f.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Scale */}
          <div>
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-2">
              Resolution Scale
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setScale(1)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  scale === 1
                    ? "bg-cyan-500/20 border-cyan-400 text-white"
                    : "bg-[#0F172A] border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="text-xs font-bold">1x Standard HD</div>
                <div className="text-[10px] text-slate-500">Original pixel dimensions</div>
              </button>

              <button
                onClick={() => setScale(2)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  scale === 2
                    ? "bg-cyan-500/20 border-cyan-400 text-white"
                    : "bg-[#0F172A] border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> 2x Ultra 4K
                </div>
                <div className="text-[10px] text-slate-500">High-definition super scale</div>
              </button>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-2 pt-2 border-t border-slate-700">
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#0F172A] border border-slate-700 cursor-pointer">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Columns className="w-4 h-4 text-cyan-400" />
                Include Before/After Comparison
              </span>
              <input
                type="checkbox"
                checked={includeComparison}
                onChange={(e) => setIncludeComparison(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#0F172A] border border-slate-700 cursor-pointer">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Add Remini HD Watermark Badge
              </span>
              <input
                type="checkbox"
                checked={includeWatermark}
                onChange={(e) => setIncludeWatermark(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleDownloadClick}
          disabled={isExporting}
          className="w-full py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? "Rendering 4K Photo..." : "EXPORT HD"}</span>
        </button>
      </div>
    </div>
  );
};
