export const handleGeneralUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      url: req.file.path,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("General upload error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
