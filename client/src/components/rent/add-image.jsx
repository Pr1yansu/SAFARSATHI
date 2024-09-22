import React, { useState } from "react";
import { TbTrashX } from "react-icons/tb";

const AddImage = ({ onChange, selectedImage, setSelectedImage }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true); // Set dragging state
  };

  const handleDragLeave = () => {
    setIsDragging(false); // Reset dragging state
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className="my-6 bg-white rounded-lg">
      <h4 className="text-xl font-semibold text-gray-900 mb-2">
        Upload an Image of Your Place
      </h4>
      <p className="text-gray-600 mb-4">
        Help your guests visualize your place by sharing a clear image.
      </p>
      <div
        className={`border border-dashed border-gray-300 p-4 rounded-lg hover:bg-gray-50 transition ${
          isDragging ? "bg-gray-100 border-blue-500" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label className="block cursor-pointer text-center">
          <span className="text-sm text-gray-500">
            Click to browse or drag and drop
          </span>
          <input type="file" className="hidden" onChange={handleImageChange} />
        </label>
      </div>

      {selectedImage && (
        <div className="mt-6 relative">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-sm"
          >
            <TbTrashX size={20} />
          </button>
          <h5 className="text-gray-700 font-medium mb-2">Preview:</h5>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            className="w-full h-64 object-cover rounded-lg shadow-sm border border-gray-200 object-center"
          />
        </div>
      )}
    </div>
  );
};

export default AddImage;
