import React, { useState, useEffect, useRef, useCallback } from "react";
import { Header } from "./components/Header";
import { BeforeAfterSlider } from "./components/BeforeAfterSlider";
import { PresetBar, PRESETS } from "./components/PresetBar";
import { ToolPanel } from "./components/ToolPanel";
import { SampleGalleryModal } from "./components/SampleGalleryModal";
import { ExportModal } from "./components/ExportModal";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { SAMPLE_PHOTOS } from "./data/samplePhotos";
import { DEFAULT_FILTERS, PRESET_PROFILES, processImageOnCanvas } from "./lib/canvasProcessor";
import { FilterSettings, CropState, ViewMode, AIAnalysisResult, SamplePhoto, HistoryItem, ExportOptions } from "./types";

export default function App() {
  // Primary Photo States
  const [originalUrl, setOriginalUrl] = useState<string>(SAMPLE_PHOTOS[0].originalUrl);
  const [enhancedCanvasUrl, setEnhancedCanvasUrl] = useState<string>("");
  const [isAiEnhanced, setIsAiEnhanced] = useState<boolean>(false);

  // Filters & Crop States
  const [filters, setFilters] = useState<FilterSettings>(DEFAULT_FILTERS);
  const [cropState, setCropState] = useState<CropState>({
    aspectRatio: "free",
    rotation: 0,
    flipH: false,
    flipV: false,
  });

  // UI States
  const [viewMode, setViewMode] = useState<ViewMode>("split_slider");
  const [activePresetKey, setActivePresetKey] = useState<string>("auto_hd");
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [aiProgressMessage, setAiProgressMessage] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  // Modals States
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // History State
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("remini_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Image Ref for rendering canvas
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Check Backend Health & API Key Status
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hasApiKey) {
          setHasApiKey(true);
        }
      })
      .catch((err) => console.log("Backend check note:", err));
  }, []);

  // Save history to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("remini_history", JSON.stringify(history.slice(0, 15)));
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  }, [history]);

  // Re-render Canvas when photo, filters or crop changes
  const renderCanvas = useCallback(() => {
    if (!originalUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = originalUrl;
    img.onload = () => {
      imageRef.current = img;
      const canvas = processImageOnCanvas(img, filters, cropState);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      setEnhancedCanvasUrl(dataUrl);
    };
  }, [originalUrl, filters, cropState]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Select Preset Handler
  const handleSelectPreset = (presetKey: string) => {
    setActivePresetKey(presetKey);
    const profile = PRESET_PROFILES[presetKey] || DEFAULT_FILTERS;
    setFilters(profile);
  };

  // Filter Value Change Handler
  const handleFilterChange = (key: keyof FilterSettings, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Crop State Change Handler
  const handleCropChange = (updated: Partial<CropState>) => {
    setCropState((prev) => ({ ...prev, ...updated }));
  };

  // Reset Filters Handler
  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCropState({ aspectRatio: "free", rotation: 0, flipH: false, flipV: false });
    setIsAiEnhanced(false);
  };

  // Trigger Gemini AI Enhancement Mode
  const handleRunAiEnhance = async (mode: string, promptExtra: string = "") => {
    setIsAiProcessing(true);
    setAiProgressMessage("Connecting to Gemini AI Photo Restoration Engine...");

    try {
      const messages = [
        "Analyzing facial contours and eyes focus...",
        "Restoring 4K micro skin texture and unblurring...",
        "Balancing portrait lighting and color temperature...",
        "Finalizing Ultra HD Remini output..."
      ];

      let msgIndex = 0;
      const interval = setInterval(() => {
        if (msgIndex < messages.length) {
          setAiProgressMessage(messages[msgIndex]);
          msgIndex++;
        }
      }, 700);

      const res = await fetch("/api/enhance-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: enhancedCanvasUrl || originalUrl,
          mode,
          promptExtra,
        }),
      });

      clearInterval(interval);
      const data = await res.json();

      if (data.success && data.enhancedImage) {
        setEnhancedCanvasUrl(data.enhancedImage);
        setIsAiEnhanced(true);

        // Add to history
        const newItem: HistoryItem = {
          id: `hist_${Date.now()}`,
          timestamp: Date.now(),
          title: `Remini AI ${mode.replace("_", " ").toUpperCase()}`,
          originalImage: originalUrl,
          enhancedImage: data.enhancedImage,
          filters: { ...filters },
        };
        setHistory((prev) => [newItem, ...prev]);
      } else {
        // Apply AI vision filters or optimized HD Canvas Filter preset
        const modePreset = PRESET_PROFILES[mode] || PRESET_PROFILES["auto_hd"];
        const finalFilters = data.aiFilters
          ? { ...modePreset, ...data.aiFilters }
          : modePreset;

        setFilters(finalFilters);
        setIsAiEnhanced(true);

        // Add to history log
        const newItem: HistoryItem = {
          id: `hist_${Date.now()}`,
          timestamp: Date.now(),
          title: `Remini HD ${mode.replace("_", " ").toUpperCase()}`,
          originalImage: originalUrl,
          enhancedImage: originalUrl,
          filters: finalFilters,
        };
        setHistory((prev) => [newItem, ...prev]);
      }
    } catch (err) {
      console.error("AI Enhance error:", err);
      // Fallback smoothly to canvas preset
      setFilters(PRESET_PROFILES["auto_hd"]);
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Trigger Gemini Vision Photo Quality Analysis
  const handleAnalyzePhoto = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyze-face", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: originalUrl,
        }),
      });
      const data = await res.json();
      setAiAnalysis(data);

      if (data.suggestedFilters) {
        setFilters((prev) => ({ ...prev, ...data.suggestedFilters }));
      }
    } catch (err) {
      console.error("Analysis Error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Select Sample Photo
  const handleSelectSample = (sample: SamplePhoto) => {
    setOriginalUrl(sample.originalUrl);
    setEnhancedCanvasUrl(sample.enhancedUrl);
    setIsAiEnhanced(true);
    setAiAnalysis(null);
  };

  // Handle Custom Uploaded Image
  const handleCustomImageUploaded = (dataUrl: string) => {
    setOriginalUrl(dataUrl);
    setIsAiEnhanced(false);
    setAiAnalysis(null);
    setFilters(DEFAULT_FILTERS);
  };

  // Handle Export / Download Photo
  const handleExportDownload = (options: ExportOptions) => {
    setIsExporting(true);

    setTimeout(() => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = enhancedCanvasUrl || originalUrl;

      img.onload = () => {
        const exportCanvas = document.createElement("canvas");
        const ctx = exportCanvas.getContext("2d");
        if (!ctx) return;

        let exportWidth = img.naturalWidth * options.scale;
        let exportHeight = img.naturalHeight * options.scale;

        if (options.includeComparison) {
          // Double width for Side-by-Side comparison
          exportCanvas.width = exportWidth * 2;
          exportCanvas.height = exportHeight;

          // Draw Original on left
          const origImg = new Image();
          origImg.crossOrigin = "anonymous";
          origImg.src = originalUrl;
          origImg.onload = () => {
            ctx.drawImage(origImg, 0, 0, exportWidth, exportHeight);
            ctx.drawImage(img, exportWidth, 0, exportWidth, exportHeight);

            // Add Divider Line
            ctx.strokeStyle = "#f59e0b";
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(exportWidth, 0);
            ctx.lineTo(exportWidth, exportHeight);
            ctx.stroke();

            // Watermark
            if (options.includeWatermark) {
              ctx.font = "bold 24px sans-serif";
              ctx.fillStyle = "rgba(255,255,255,0.9)";
              ctx.fillText("✨ Remini AI Ultra HD", exportCanvas.width - 260, exportHeight - 30);
            }

            triggerDownload(exportCanvas, options.format);
          };
        } else {
          exportCanvas.width = exportWidth;
          exportCanvas.height = exportHeight;
          ctx.drawImage(img, 0, 0, exportWidth, exportHeight);

          if (options.includeWatermark) {
            ctx.font = "bold 24px sans-serif";
            ctx.fillStyle = "rgba(255,255,255,0.9)";
            ctx.fillText("✨ Remini AI Studio", exportWidth - 220, exportHeight - 30);
          }

          triggerDownload(exportCanvas, options.format);
        }
      };
    }, 400);
  };

  const triggerDownload = (canvas: HTMLCanvasElement, format: string) => {
    const link = document.createElement("a");
    const ext = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
    link.download = `remini_enhanced_${Date.now()}.${ext}`;
    link.href = canvas.toDataURL(format, 0.95);
    link.click();

    setIsExporting(false);
    setIsExportOpen(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0F172A] text-slate-200 overflow-hidden font-sans">
      {/* App Header Bar */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenGallery={() => setIsGalleryOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onResetFilters={handleResetFilters}
        isAiProcessing={isAiProcessing}
        hasApiKey={hasApiKey}
      />

      {/* 1-Tap Preset Enhancer Bar */}
      <PresetBar
        activePresetKey={activePresetKey}
        onSelectPreset={handleSelectPreset}
        onTriggerAiMode={handleRunAiEnhance}
        isAiProcessing={isAiProcessing}
      />

      {/* Main Interactive Before/After Canvas View */}
      <main className="flex-1 min-h-0 relative">
        <BeforeAfterSlider
          originalUrl={originalUrl}
          enhancedCanvasUrl={enhancedCanvasUrl}
          viewMode={viewMode}
          isAiProcessing={isAiProcessing}
          aiProgressMessage={aiProgressMessage}
          isAiEnhanced={isAiEnhanced}
        />
      </main>

      {/* Bottom Tool & Adjustments Panel */}
      <ToolPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        cropState={cropState}
        onCropChange={handleCropChange}
        onRunAiEnhance={handleRunAiEnhance}
        onAnalyzePhoto={handleAnalyzePhoto}
        aiAnalysis={aiAnalysis}
        isAnalyzing={isAnalyzing}
        isAiProcessing={isAiProcessing}
      />

      {/* Modals & Drawers */}
      <SampleGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectSample={handleSelectSample}
        onCustomImageUploaded={handleCustomImageUploaded}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExportDownload={handleExportDownload}
        isExporting={isExporting}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={(item) => {
          setOriginalUrl(item.originalImage);
          setEnhancedCanvasUrl(item.enhancedImage);
          setFilters(item.filters);
          setIsAiEnhanced(true);
        }}
        onClearHistory={() => setHistory([])}
      />
    </div>
  );
}
