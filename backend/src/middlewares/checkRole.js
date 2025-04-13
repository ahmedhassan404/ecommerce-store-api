const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.userRole;
    // console.log("User Role:", userRole); // Debugging
    

    // Check if the user's role is allowed
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden - you do not have permission to perform this action",
      });
    }
    next();
  };
};

module.exports = checkRole;
