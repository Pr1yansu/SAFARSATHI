import React, { useState } from "react";
import { TbTrashX } from "react-icons/tb";
import { HiSparkles, HiPhoto, HiPlus } from "react-icons/hi2";
import { compressImage } from "../../utils/compress-image";
import toast from "react-hot-toast";

const AddImage = ({ selectedImages = [], setSelectedImages, selectedImage, setSelectedImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [compressing, setCompressing] = useState(false);

  // Normalize images array
  const images = Array.isArray(selectedImages) && selectedImages.length > 0
    ? selectedImages
    : selectedImage
    ? [selectedImage]
    : [];

  const updateImages = (newImagesList) => {
    if (setSelectedImages) {
      setSelectedImages(newImagesList);
    }
    if (setSelectedImage) {
      setSelectedImage(newImagesList[0] || null);
    }
  };

  const processFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    setCompressing(true);
    toast.loading("Processing & compressing photos under 8MB...", { id: "compress" });

    try {
      const processed = [];
      for (const file of files) {
        if (file.type && file.type.startsWith("image/")) {
          const compressed = await compressImage(file, 8);
          processed.push(compressed);
        }
      }
      toast.dismiss("compress");
      toast.success(`Processed ${processed.length} photo(s) successfully!`);
      updateImages([...images, ...processed]);
    } catch (err) {
      toast.dismiss("compress");
      toast.error("Failed to process images.");
    } finally {
      setCompressing(false);
    }
  };

  const handleImageChange = (e) => {
    processFiles(e.target.files);
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    updateImages(updated);
  };

  return (
    <div className="my-2 bg-white rounded-2xl space-y-4 max-h-[440px] overflow-y-auto scrollbar-none pr-1">
      <div className="space-y-1">
        <h4 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>Upload Property Photos</span>
          <HiSparkles className="text-indigo-600" />
        </h4>
        <p className="text-xs font-semibold text-slate-500">
          Upload clear high-resolution photos of your stay. Select multiple photos at once (auto-reduced under 8MB).
        </p>
      </div>

      <div
        className={`border-2 border-dashed p-6 rounded-2xl text-center cursor-pointer transition-all duration-200 ${
          isDragging ? "bg-indigo-50 border-indigo-500 scale-[1.01]" : "bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-slate-100/50"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files); }}
      >
        <label className="block cursor-pointer space-y-2">
          {compressing ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-indigo-700">Compressing photos under 8MB...</span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
                <HiPhoto size={24} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-center gap-1">
                  <HiPlus /> <span>Click to add photos (or drag & drop multiple)</span>
                </p>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                  JPG, PNG, WebP — Upload up to 10 photos
                </p>
              </div>
            </>
          )}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} disabled={compressing} />
        </label>
      </div>

      {/* Selected Images Grid */}
      {images.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Uploaded Photos ({images.length})</span>
            <span className="text-indigo-600 font-semibold">{images.length} File(s) Selected</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((imgFile, idx) => (
              <div key={idx} className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs group aspect-video bg-slate-100">
                <img
                  src={URL.createObjectURL(imgFile)}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1.5 shadow-md transition-colors opacity-90 group-hover:opacity-100"
                >
                  <TbTrashX size={16} />
                </button>
                <div className="absolute bottom-1.5 left-1.5 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  {(imgFile.size / (1024 * 1024)).toFixed(1)} MB
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddImage;
