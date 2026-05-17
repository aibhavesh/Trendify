const logoutController = async (_req, res) => {
  // For JWT-based auth we simply instruct the client to remove the token.
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export default logoutController;
