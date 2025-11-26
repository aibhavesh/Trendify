export const uploadImage = async (req, res) => {
  try {
    // multer + cloudinary gives image URL in req.file.path
    const imageUrl = req.file.path;

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: imageUrl,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
