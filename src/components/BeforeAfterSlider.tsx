import React, { useState, useRef, useEffect, useCallback } from "react";
import { ViewMode } from "../types";
import { ZoomIn, ZoomOut, Sparkles, MoveHorizontal, Eye } from "lucide-react";

interface BeforeAfterSliderProps {
  originalUrl: string;
  enhancedCanvasUrl: string;
  viewMode: ViewMode;
  isAiProcessing: boolean;
  aiProgressMessage?: string;
  isAiEnhanced?: boolean;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  originalUrl,
  enhancedCanvasUrl,
  viewMode,
  isAiProcessing,
  aiProgressMessage = "Remini AI is restoring facial features...",
  isAiEnhanced = false,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100%
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showLoupe, setShowLoupe] = useState<boolean>(false);
  const [loupePos, setLoupePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [containerRect, setContainerRect] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Handle Drag / Touch on Slider Line
  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setContainerRect({ width: rect.width, height: rect.height });

    // Slider X calculation
    let offsetX = clientX - rect.left;
    let percentage = (offsetX / rect.width) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    setSliderPosition(percentage);

    // Loupe coordinates relative to image container
    const relX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const relY = Math.max(0, Math.min(rect.height, clientY - rect.top));
    setLoupePos({ x: relX, y: relY });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX, e.clientY);
    } else {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setLoupePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    }
  };
const handleMouseUp = () => {
  setIsDragging(false);
};


    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches[0]) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);} };
  useEffect(() => {
    const onGlobalMouseUp = () => setIsDragging(false);
    globalThis.addEventListener("mouseup", onGlobalMouseUp);
    return () => globalThis.removeEventListener("mouseup", onGlobalMouseUp);


  const finalEnhancedUrl = enhancedCanvasUrl || originalUrl;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-neutral-950 p-2 sm:p-4 select-none overflow-hidden">
      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-800 shadow-lg text-xs font-medium text-neutral-300">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{isAiEnhanced ? "AI Ultra 4K Enhanced" : "Realtime HD Canvas Filter"}</span>
        </div>

        <button
          onClick={() => setShowLoupe(!showLoupe)}
          className={`pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all shadow-lg border ${
            showLoupe
              ? "bg-amber-500 text-neutral-950 border-amber-400 font-bold"
              : "bg-neutral-900/80 text-neutral-300 border-neutral-800 hover:bg-neutral-800"
          }`}
        >
          {showLoupe ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
          <span>{showLoupe ? "Hide Lens" : "3x Zoom Lens"}</span>
        </button>
      </div>

      {/* Main Image View Container */}
      <div className="relative w-full max-w-5xl h-[calc(100vh-220px)] min-h-[380px] flex items-center justify-center rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/40 shadow-2xl">
        
        {/* Loading Overlay when AI processing */}
        {isAiProcessing && (
          <div className="absolute inset-0 z-30 bg-neutral-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="relative flex items-center justify-center w-20 h-20 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-amber-500/20 border-b-amber-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
              <Sparkles className="w-8 h-8 text-amber-400 animate-bounce" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1 tracking-tight">Remini AI Magic in Progress</h3>
            <p className="text-xs text-rose-300 max-w-md font-medium">{aiProgressMessage}</p>
            
            {} catch (error: unknown) {
  console.error("Analysis Error:", error instanceof Error ? error.message : error);
}
/* Animated Laser Scanning Line */}
            <div className="w-64 h-1 bg-neutral-800 rounded-full mt-6 overflow-hidden relative">
              <div className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 w-1/2 rounded-full animate-[pulse_1s_infinite]" />
            </div>
          </div>
        )}

        {/* MODE 1: SPLIT SLIDER MODE */}
        {viewMode === "split_slider" && (
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className="relative w-full h-full flex items-center justify-center cursor-ew-resize overflow-hidden"
          >
            {/* Underneath Layer: Original Image */}
            <img
              src={originalUrl}
              alt="Original Photo"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
            />

            {/* Top Layer: Remini Enhanced Image (Clipped by slider position) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none select-none transition-all duration-75"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={finalEnhancedUrl}
                alt="Enhanced Photo"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none max-w-none"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%",
                  height: containerRef.current ? `${containerRef.current.clientHeight}px` : "100%",
                }}
              />
            </div>

            {/* Split Drag Line Bar */}
            <div
              className="absolute top-0 bottom-0 z-10 w-1 bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.8)] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-neutral-900 border-2 border-white shadow-2xl flex items-center justify-center text-white">
                <MoveHorizontal className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            {/* Persistent Before / After Corner Labels */}
            <div className="absolute bottom-4 left-4 z-10 px-3 py-1 rounded-lg bg-neutral-950/80 border border-neutral-800 text-amber-400 font-bold text-xs shadow-lg uppercase tracking-wider backdrop-blur-md">
              ✨ Remini HD
            </div>
            <div className="absolute bottom-4 right-4 z-10 px-3 py-1 rounded-lg bg-neutral-950/80 border border-neutral-800 text-neutral-400 font-bold text-xs shadow-lg uppercase tracking-wider backdrop-blur-md">
              Original
            </div>
          </div>
        )}

        {/* MODE 2: SIDE BY SIDE COMPARISON */}
        {viewMode === "side_by_side" && (
          <div className="w-full h-full grid grid-cols-2 gap-2 p-2">
            <div className="relative w-full h-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 flex items-center justify-center">
              <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-neutral-900/80 text-neutral-400 text-[10px] font-bold uppercase tracking-wider border border-neutral-800">
                Original
              </span>
              <img
                src={originalUrl}
                alt="Original Photo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="relative w-full h-full rounded-xl overflow-hidden border border-rose-500/40 bg-neutral-950 flex items-center justify-center shadow-lg shadow-rose-950/20">
              <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-rose-600/90 text-white text-[10px] font-bold uppercase tracking-wider border border-rose-400/30 flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3 text-amber-300" /> Remini Enhanced
              </span>
              <img
                src={finalEnhancedUrl}
                alt="Enhanced Photo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* MODE 3: SINGLE ENHANCED VIEW */}
        {viewMode === "single_enhanced" && (
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-lg bg-rose-600/90 text-white text-xs font-bold uppercase tracking-wider border border-rose-400/30 flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-300" /> Remini Ultra 4K
            </span>
            <img
              src={finalEnhancedUrl}
              alt="Enhanced Photo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* MODE 4: SINGLE ORIGINAL VIEW */}
        {viewMode === "single_original" && (
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-lg bg-neutral-900/90 text-neutral-300 text-xs font-bold uppercase tracking-wider border border-neutral-800 flex items-center gap-1.5 shadow-lg">
              <Eye className="w-4 h-4 text-neutral-400" /> Original Input
            </span>
            <img
              src={originalUrl}
              alt="Original Photo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Magnifier Zoom Lens Circle */}
        {showLoupe && (
          <div
            className="pointer-events-none absolute w-36 h-36 rounded-full border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)] overflow-hidden z-40 bg-neutral-900"
            style={{
              left: `${loupePos.x - 72}px`,
              top: `${loupePos.y - 72}px`,
            }}
          >
            <div className="relative w-full h-full">
              <img
                src={finalEnhancedUrl}
                alt="Zoomed Detail"
                referrerPolicy="no-referrer"
                className="absolute max-w-none"
                style={{
                  width: containerRect.width ? `${containerRect.width * 2.8}px` : "280%",
                  height: containerRect.height ? `${containerRect.height * 2.8}px` : "280%",
                  left: `${-loupePos.x * 2.8 + 72}px`,
                  top: `${-loupePos.y * 2.8 + 72}px`,
                }}
              />
              <div className="absolute inset-0 rounded-full border-2 border-white/40" />
              <div className="absolute bottom-1 right-1 text-[9px] font-extrabold px-1.5 py-0.5 bg-black/80 text-amber-300 rounded-md">
                3.0x ZOOM
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
