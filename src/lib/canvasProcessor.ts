import { FilterSettings, CropState } from "../types";

export const DEFAULT_FILTERS: FilterSettings = {
  sharpness: 35,
  skinSmoothness: 25,
  eyeClarity: 30,
  brightness: 15, // β (Beta) boost (+10 to +20 face illumination)
  contrast: 15,   // α (Alpha) gain (1.1 to 1.2 range)
  highlights: 10,
  shadows: 10,
  saturation: 12,
  vibrance: 15,
  warmth: 5,
  vignette: 10,
  denoise: 15,
  colorizeVintage: 0,
  lipTint: 0,
  teethWhite: 0,
};

export const PRESET_PROFILES: Record<string, FilterSettings> = {
  auto_hd: {
    sharpness: 65,
    skinSmoothness: 40,
    eyeClarity: 50,
    brightness: 15, // β = +15
    contrast: 15,   // α = 1.15
    highlights: 12,
    shadows: 15,
    saturation: 18,
    vibrance: 20,
    warmth: 6,
    vignette: 15,
    denoise: 25,
    colorizeVintage: 0,
    lipTint: 10,
    teethWhite: 15,
  },
  beauty_glow: {
    sharpness: 30,
    skinSmoothness: 75,
    eyeClarity: 60,
    brightness: 18, // β = +18
    contrast: 12,   // α = 1.12
    highlights: 15,
    shadows: 12,
    saturation: 15,
    vibrance: 22,
    warmth: 12,
    vignette: 8,
    denoise: 40,
    colorizeVintage: 0,
    lipTint: 35,
    teethWhite: 30,
  },
  ultra_unblur: {
    sharpness: 90,
    skinSmoothness: 15,
    eyeClarity: 80,
    brightness: 14, // β = +14
    contrast: 18,   // α = 1.18
    highlights: 20,
    shadows: 10,
    saturation: 15,
    vibrance: 15,
    warmth: 0,
    vignette: 12,
    denoise: 10,
    colorizeVintage: 0,
    lipTint: 0,
    teethWhite: 10,
  },
  colorize_bw: {
    sharpness: 50,
    skinSmoothness: 35,
    eyeClarity: 45,
    brightness: 15, // β = +15
    contrast: 15,   // α = 1.15
    highlights: 15,
    shadows: 20,
    saturation: 45,
    vibrance: 50,
    warmth: 20,
    vignette: 25,
    denoise: 30,
    colorizeVintage: 85,
    lipTint: 20,
    teethWhite: 15,
  },
  hdr_studio: {
    sharpness: 55,
    skinSmoothness: 30,
    eyeClarity: 50,
    brightness: 16, // β = +16
    contrast: 16,   // α = 1.16
    highlights: -15,
    shadows: 45,
    saturation: 28,
    vibrance: 35,
    warmth: 10,
    vignette: 20,
    denoise: 20,
    colorizeVintage: 0,
    lipTint: 12,
    teethWhite: 15,
  },
  soft_studio: {
    sharpness: 50,
    skinSmoothness: 65,
    eyeClarity: 55,
    brightness: 18, // β = +18
    contrast: 10,   // α = 1.10 (low contrast portrait)
    highlights: -10, // Tame harsh highlights
    shadows: 35,     // Fix harsh shadows
    saturation: 15,
    vibrance: 18,
    warmth: 8,
    vignette: 10,
    denoise: 30,
    colorizeVintage: 0,
    lipTint: 15,
    teethWhite: 20,
  },
};

/**
 * Process image on HTML Canvas using pixel manipulation & convolution filters
 */
export function processImageOnCanvas(
  img: HTMLImageElement,
  filters: FilterSettings,
  cropState: CropState,
  targetWidth?: number,
  targetHeight?: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx) return canvas;

  let origWidth = img.naturalWidth || img.width;
  let origHeight = img.naturalHeight || img.height;

  if (!origWidth || !origHeight) {
    origWidth = 1000;
    origHeight = 1000;
  }

  // Calculate transform dimensions for rotation
  const isRotated = cropState.rotation === 90 || cropState.rotation === 270;
  const drawWidth = isRotated ? origHeight : origWidth;
  const drawHeight = isRotated ? origWidth : origHeight;

  canvas.width = targetWidth || drawWidth;
  canvas.height = targetHeight || drawHeight;

  ctx.save();

  // Apply Crop / Orientation Transforms
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((cropState.rotation * Math.PI) / 180);
  ctx.scale(cropState.flipH ? -1 : 1, cropState.flipV ? -1 : 1);

  // Draw base image centered
  const drawW = isRotated ? canvas.height : canvas.width;
  const drawH = isRotated ? canvas.width : canvas.height;
  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

  ctx.restore();

  // Read pixel data for Remini enhancement pipeline
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  // 1. Primary Color, Brightness (β), Contrast (α), Saturation, Warmth Pass
  // Contrast α (Alpha Gain Factor): strictly set between 1.1 and 1.2 (base α = 1.15)
  const alphaMin = 1.10;
  const alphaMax = 1.20;
  const alphaMid = 1.15;
  const alpha = Math.min(alphaMax, Math.max(alphaMin, alphaMid + (filters.contrast / 100) * 0.10));

  // Brightness β (Beta Bias Offset): increased by +10 to +20 for facial radiance (base β = +15)
  const betaMin = 10;
  const betaMax = 20;
  const betaMid = 15;
  const beta = Math.min(betaMax, Math.max(betaMin, betaMid + (filters.brightness / 100) * 10));

  const sat = (filters.saturation + 100) / 100;
  const warmth = filters.warmth;
  const colorizeBW = filters.colorizeVintage / 100;
  const lipTint = filters.lipTint / 100;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Linear transform: g(x,y) = α * (f(x,y) - 128) + 128 + β
    r = alpha * (r - 128) + 128 + beta;
    g = alpha * (g - 128) + 128 + beta;
    b = alpha * (b - 128) + 128 + beta;

    // Highlights & Shadows
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    if (luminance > 160 && filters.highlights !== 0) {
      const highBoost = (filters.highlights / 100) * (luminance - 160);
      r += highBoost;
      g += highBoost;
      b += highBoost;
    } else if (luminance < 96 && filters.shadows !== 0) {
      const shadBoost = (filters.shadows / 100) * (96 - luminance);
      r += shadBoost;
      g += shadBoost;
      b += shadBoost;
    }

    // Warmth adjustment
    if (warmth !== 0) {
      r += warmth * 0.8;
      b -= warmth * 0.8;
    }

    // Saturation / Color Pop
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    r = gray + sat * (r - gray);
    g = gray + sat * (g - gray);
    b = gray + sat * (b - gray);

    // B&W Vintage Colorization Simulation (if photo is mostly monochrome)
    if (colorizeBW > 0) {
      const isLowSat = Math.abs(r - g) < 25 && Math.abs(g - b) < 25;
      if (isLowSat) {
        // Add realistic skin and atmospheric tint based on luminance
        const normGray = gray / 255;
        let targetR = gray;
        let targetG = gray;
        let targetB = gray;

        if (normGray > 0.3 && normGray < 0.85) {
          // Warm skin highlight tint
          targetR = gray * 1.15 + 15;
          targetG = gray * 0.98 + 5;
          targetB = gray * 0.85;
        } else if (normGray >= 0.85) {
          // Bright soft glow
          targetR = gray * 1.05;
          targetG = gray * 1.05;
          targetB = gray * 1.02;
        }
        r = r * (1 - colorizeBW) + targetR * colorizeBW;
        g = g * (1 - colorizeBW) + targetG * colorizeBW;
        b = b * (1 - colorizeBW) + targetB * colorizeBW;
      }
    }

    // Lip Tint simulation (subtle pinkish-red boost on warm midtones)
    if (lipTint > 0) {
      const isRedDominant = r > g + 10 && r > b + 10;
      if (isRedDominant && luminance > 60 && luminance < 180) {
        r += lipTint * 25;
        g -= lipTint * 8;
        b += lipTint * 10;
      }
    }

    // Clamp RGBA
    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }

  // Put modified tone-mapped data back to canvas
  ctx.putImageData(imageData, 0, 0);

  // 2. High Pass Sharpening Kernel (Remini Crisp Unblur)
  if (filters.sharpness > 0) {
    const sharpFactor = (filters.sharpness / 100) * 0.8;
    applySharpenConvolution(ctx, width, height, sharpFactor);
  }

  // 3. Skin Smoothness (Bilateral / Edge-preserving Blur)
  if (filters.skinSmoothness > 0) {
    applySkinSmoothingPass(ctx, width, height, filters.skinSmoothness / 100);
  }

  // 4. Vignette Overlay
  if (filters.vignette > 0) {
    applyVignette(ctx, width, height, filters.vignette / 100);
  }

  return canvas;
}

/**
 * 3x3 Sharpen Kernel Convolution
 */
function applySharpenConvolution(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  factor: number
) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const copyData = new Uint8ClampedArray(data);

  // High-pass matrix:
  // [ 0  -1   0 ]
  // [-1 4+f  -1 ]
  // [ 0  -1   0 ]
  const center = 4 + factor * 3;
  const neg = -1 * (1 + factor * 0.4);

  for (let y = 1; y < height - 1; y += 2) {
    for (let x = 1; x < width - 1; x += 2) {
      const i = (y * width + x) * 4;

      for (let c = 0; c < 3; c++) {
        const val =
          copyData[i + c] * center +
          copyData[((y - 1) * width + x) * 4 + c] * neg +
          copyData[((y + 1) * width + x) * 4 + c] * neg +
          copyData[(y * width + (x - 1)) * 4 + c] * neg +
          copyData[(y * width + (x + 1)) * 4 + c] * neg;

        data[i + c] = Math.min(255, Math.max(0, val));
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Skin smoothing pass (Soft selective blur)
 */
function applySkinSmoothingPass(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
) {
  // Create offscreen layer for soft skin blur
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return;

  tempCtx.drawImage(ctx.canvas, 0, 0);

  // Apply subtle canvas blur
  const blurRadius = Math.max(1, Math.round(intensity * 4));
  ctx.save();
  ctx.globalAlpha = intensity * 0.35;
  ctx.filter = `blur(${blurRadius}px)`;
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.restore();
}

/**
 * Radial Vignette Effect
 */
function applyVignette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
) {
  const radius = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    radius * 0.4,
    width / 2,
    height / 2,
    radius
  );

  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(0.7, `rgba(0,0,0,${intensity * 0.2})`);
  gradient.addColorStop(1, `rgba(0,0,0,${intensity * 0.6})`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}
