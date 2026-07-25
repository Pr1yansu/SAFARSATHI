export const compressImage = (file, maxSizeMB = 8, quality = 0.9, maxDimension = 1920) => {
  return new Promise((resolve) => {
    if (!file || !file.type || !file.type.startsWith("image/")) {
      return resolve(file);
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size <= maxSizeBytes && quality >= 0.9 && maxDimension >= 1920) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";

        canvas.toBlob(
          async (blob) => {
            if (!blob) return resolve(file);
            if (blob.size > maxSizeBytes && quality > 0.3) {
              const tempFile = new File([blob], file.name, {
                type: mimeType,
                lastModified: Date.now(),
              });
              const result = await compressImage(
                tempFile,
                maxSizeMB,
                Math.max(0.3, quality - 0.15),
                Math.round(maxDimension * 0.85)
              );
              resolve(result);
            } else {
              const finalFile = new File([blob], file.name, {
                type: mimeType,
                lastModified: Date.now(),
              });
              resolve(finalFile);
            }
          },
          mimeType,
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};
