import React, { useState } from "react";
import { SAMPLE_PHOTOS } from "../data/samplePhotos";
import { SamplePhoto } from "../types";
import { X, Upload, Camera, Sparkles, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

interface SampleGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: SamplePhoto) => void;
  onCustomImageUploaded: (dataUrl: string) => void;
}

export const SampleGalleryModal: React.FC<SampleGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
  onCustomImageUploaded,
}) => {
  const [imageUrlInput, setImageUrlInput] = useState<string>("");

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onCustomImageUploaded(event.target.result as string);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrlInput.trim()) {
      onCustomImageUploaded(imageUrlInput.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-[#1E293B] border border-slate-700/50 rounded-2xl shadow-2xl p-6 text-slate-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/50 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Choose or Upload Photo</h3>
              <p className="text-xs text-slate-400">Select a preloaded sample photo or upload your own image</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Drag & Drop Upload Zone */}
        <div className="mb-6 p-6 border-2 border-dashed border-slate-700 hover:border-cyan-400/80 rounded-2xl bg-[#0F172A] transition-all text-center group cursor-pointer relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-sm text-white mb-1">Click or Drag & Drop Your Photo Here</h4>
          <p className="text-xs text-slate-400">Supports HD JPG, PNG, WEBP, HEIC (Max 50MB)</p>
        </div>

        {/* URL Input */}
        <form onSubmit={handleUrlSubmit} className="mb-8 flex items-center gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="Or paste image URL (https://...)"
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder-slate-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            Load URL
          </button>
        </form>

        {/* Preloaded Sample Photos Grid */}
        <div>
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Preloaded Remini Test Gallery</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SAMPLE_PHOTOS.map((sample) => (
              <div
                key={sample.id}
                onClick={() => {
                  onSelectSample(sample);
                  onClose();
                }}
                className="group relative rounded-xl overflow-hidden border border-slate-700 hover:border-cyan-400 bg-[#0F172A] cursor-pointer transition-all shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={sample.originalUrl}
                    alt={sample.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 z-10 px-2.5 py-1 rounded bg-cyan-500/80 text-white text-[10px] font-bold uppercase tracking-widest shadow-md">
                    {sample.badge}
                  </span>
                </div>

                <div className="p-3 bg-[#1E293B]">
                  <h5 className="font-bold text-xs text-white group-hover:text-cyan-400 transition-colors">
                    {sample.title}
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{sample.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
