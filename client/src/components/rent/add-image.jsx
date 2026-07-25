import React, { useState } from "react";
import { TbTrashX } from "react-icons/tb";
import { HiSparkles } from "react-icons/hi2";
import { compressImage } from "../../utils/compress-image";
import toast from "react-hot-toast";

const AddImage = ({ onChange, selectedImage, setSelectedImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [compressing, setCompressing] = useState(false);

  const processFile = async (file) => {
    if (!file) return;
    try {
      setCompressing(true);
      if (file.size > 8 * 1024 * 1024) {
        toast.loading("Auto-compressing large image under 8MB...", { id: "compress" });
      }
      const finalFile = await compressImage(file, 8);
      toast.dismiss("compress");
      if (file.size > 8 * 1024 * 1024) {
        toast.success(`Image reduced from ${(file.size / (1024 * 1024)).toFixed(1)}MB to ${(finalFile.size / (1024 * 1024)).toFixed(1)}MB!`);
      }
      onChange(finalFile);
    } catch (err) {
      toast.dismiss("compress");
      onChange(file);
    } finally {
      setCompressing(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  return (
    <div className="my-4 bg-white rounded-2xl space-y-4">
      <div className="space-y-1">
        <h4 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>Upload Property Photos</span>
          <HiSparkles className="text-indigo-600" />
        </h4>
        <p className="text-xs font-semibold text-slate-500">
          Upload clear high-resolution photos of your stay. Large files are auto-compressed.
        </p>
      </div>

      <div
        className={`border-2 border-dashed p-8 rounded-2xl text-center cursor-pointer transition-all duration-200 ${
          isDragging ? "bg-indigo-50 border-indigo-500 scale-[1.01]" : "bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-slate-100/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label className="block cursor-pointer space-y-2">
          {compressing ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-indigo-700">Auto-compressing photo...</span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
                <HiSparkles size={24} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  Click to browse or drag & drop photo
                </p>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                  JPG, PNG, WebP — Any file size (auto-reduced if &gt; 10MB)
                </p>
              </div>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={compressing} />
        </label>
      </div>

      {selectedImage && (
        <div className="mt-4 relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-card">
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute top-3 right-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-2 shadow-md transition-colors z-10"
          >
            <TbTrashX size={18} />
          </button>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected Preview"
            className="w-full h-64 object-cover rounded-2xl"
          />
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
            {(selectedImage.size / (1024 * 1024)).toFixed(2)} MB Ready
          </div>
        </div>
      )}
    </div>
  );
};

export default AddImage;
