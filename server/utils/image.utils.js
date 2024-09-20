const Cloudinary = require("cloudinary").v2;

const uploadImage = async (file) => {
  console.log("Uploading image to cloudinary...", file);

  try {
    const { secure_url, public_id } = await Cloudinary.uploader.upload(file, {
      folder: "tourist-spot",
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });

    return { secure_url, public_id };
  } catch (error) {
    console.log("Error uploading image to cloudinary", error);
    return {
      error,
    };
  }
};

module.exports = { uploadImage };
