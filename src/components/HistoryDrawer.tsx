import React from "react";
import { HistoryItem } from "../types";
import { X, Trash2, RotateCcw, Clock, Sparkles } from "lucide-react";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#1E293B] border-l border-slate-700/50 text-slate-200 h-full flex flex-col p-5 shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-white">Enhancement History</h3>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 rounded-lg text-slate-400 hover:text-fuchsia-400 hover:bg-slate-800 transition-all cursor-pointer"
                title="Clear History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History Items List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
              <Clock className="w-12 h-12 mb-2 opacity-30" />
              <p className="text-xs font-semibold">No saved history yet</p>
              <p className="text-[11px] opacity-70">Enhanced photos will automatically appear here.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className="group relative flex items-center gap-3 p-2.5 rounded-xl bg-[#0F172A] border border-slate-700 hover:border-cyan-400 cursor-pointer transition-all shadow-md"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-900 border border-slate-700">
                  <img
                    src={item.enhancedImage || item.originalImage}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-0.5 right-0.5 p-0.5 rounded bg-black/80 text-cyan-300">
                    <Sparkles className="w-2.5 h-2.5" />
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-white truncate group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-cyan-400 font-medium">
                    <RotateCcw className="w-3 h-3" />
                    <span>Click to Restore</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
