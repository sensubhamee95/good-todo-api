
const errorHandler = (err, req, res, next) => {
  //  Log full error stack (for debugging)
  console.error(err.stack);

  // Send generic response (do NOT expose internal details)
  res.status(500).json({
    error: "Internal server error",
  });
};

module.exports = errorHandler;