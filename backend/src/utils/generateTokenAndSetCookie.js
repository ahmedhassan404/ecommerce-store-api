const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = (res, payload, rememberMe) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? "7d" : "2h",  
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000,
  });
  return token;
};

module.exports = generateTokenAndSetCookie;
