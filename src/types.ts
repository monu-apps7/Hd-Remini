export type EnhanceMode = 
  | "face_enhance"
  | "beauty_touchup"
  | "old_photo_restore"
  | "hdr_lighting"
  | "ai_art_style";

export type ViewMode = "split_slider" | "side_by_side" | "single_enhanced" | "single_original";

export interface FilterSettings {
  sharpness: number;         // 0 to 100
  skinSmoothness: number;    // 0 to 100
  eyeClarity: number;        // 0 to 100
  brightness: number;        // -100 to 100
  contrast: number;          // -100 to 100
  highlights: number;        // -100 to 100
  shadows: number;           // -100 to 100
  saturation: number;        // -100 to 100
  vibrance: number;          // -100 to 100
  warmth: number;            // -100 to 100
  vignette: number;          // 0 to 100
  denoise: number;           // 0 to 100
  colorizeVintage: number;   // 0 to 100
  lipTint: number;           // 0 to 100
  teethWhite: number;        // 0 to 100
}

export interface CropState {
  aspectRatio: "free" | "1:1" | "4:5" | "9:16" | "16:9" | "3:4";
  rotation: number; // 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
}

export interface AIAnalysisResult {
  qualityScore: number;
  blurLevel: string;
  noiseLevel: string;
  lighting: string;
  faceDetected: boolean;
  recommendations: string[];
  suggestedFilters?: Partial<FilterSettings>;
}

export interface SamplePhoto {
  id: string;
  title: string;
  category: "Blurry Portrait" | "Vintage B&W" | "Low Light" | "Selfie Beauty";
  originalUrl: string;
  enhancedUrl: string;
  description: string;
  badge: string;
}

export interface ExportOptions {
  format: "image/jpeg" | "image/png" | "image/webp";
  quality: number; // 0.1 to 1.0
  scale: number; // 1x, 2x (4K)
  includeComparison: boolean;
  includeWatermark: boolean;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  title: string;
  originalImage: string;
  enhancedImage: string;
  filters: FilterSettings;
}
